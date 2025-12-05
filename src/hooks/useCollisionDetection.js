import { useCallback } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';
import { checkAABBCollision, checkCircleCollision } from '../utils/collision';

/**
 * Hook que gerencia toda a lógica de detecção de colisão
 * Inclui: player vs enemies, knife vs enemies, enemies vs datacenter
 */
export const useCollisionDetection = (
  gameState,
  setScore,
  setHealth,
  setDatacenterHealth,
  setEnemies,
  addXP,
  getLevelStats,
  onGameOver,
  onEnemyDefeated, // Callback para notificar quando um inimigo é derrotado
  getWeaponStats // Função para obter stats da arma atual
) => {
  /**
   * Verifica colisões do player com inimigos
   */
  const checkPlayerCollisions = useCallback(
    (enemies, player, currentLevel) => {
      const enemiesToRemove = [];
      const levelStats = getLevelStats(currentLevel);

      enemies.forEach((enemy, index) => {
        if (checkAABBCollision(player, enemy)) {
          enemiesToRemove.push(index);
          setHealth((h) => {
            // Aplica defesa ao dano recebido (multiplicativo)
            const actualDamage = Math.ceil(GAME_CONFIG.ENEMY.DAMAGE * levelStats.defenseMultiplier);
            const newHealth = Math.max(0, h - actualDamage);
            if (newHealth <= 0) onGameOver('player');
            return newHealth;
          });
        }
      });

      return enemiesToRemove;
    },
    [getLevelStats, setHealth, onGameOver]
  );

  /**
   * Verifica colisões com o data center
   */
  const checkDatacenterCollisions = useCallback(
    (enemies, datacenter) => {
      enemies.forEach((enemy) => {
        if (checkAABBCollision(datacenter, enemy)) {
          const now = Date.now();
          if (
            now - enemy.lastDamageToDatacenter >
            GAME_CONFIG.DATA_CENTER.COLLISION_DAMAGE_INTERVAL
          ) {
            setDatacenterHealth((h) => {
              const newHealth = Math.max(0, h - GAME_CONFIG.ENEMY.DATACENTER_DAMAGE);
              if (newHealth <= 0) onGameOver('datacenter');
              return newHealth;
            });
            enemy.lastDamageToDatacenter = now;
          }
        }
      });
    },
    [setDatacenterHealth, onGameOver]
  );

  /**
   * Verifica colisões da faca com inimigos
   */
  const checkKnifeCollisions = useCallback(
    (enemies, knife, currentLevel) => {
      const enemiesToRemove = [];
      const knifeRadius = GAME_CONFIG.KNIFE.HEIGHT / 2;

      // Obtém os bônus do nível atual
      const levelStats = getLevelStats(currentLevel);

      // Obtém stats da arma (inclui upgrades)
      const weaponStats = getWeaponStats ? getWeaponStats() : null;

      // Calcula dano efetivo: base + level bonus + weapon stats
      let effectiveDamage = levelStats.effectiveKnifeDamage;
      let effectiveCritChance = 0.1; // 10% base
      let effectiveCritMultiplier = 2.0; // 2x base

      if (weaponStats) {
        effectiveDamage = weaponStats.damage || effectiveDamage;
        effectiveCritChance = weaponStats.critChance || effectiveCritChance;
        effectiveCritMultiplier = weaponStats.critMultiplier || effectiveCritMultiplier;
      }

      enemies.forEach((enemy, index) => {
        const enemyCenterX = enemy.x + enemy.size / 2;
        const enemyCenterY = enemy.y + enemy.size / 2;
        const enemyRadius = enemy.size / 2;

        if (
          checkCircleCollision(
            knife.x,
            knife.y,
            enemyCenterX,
            enemyCenterY,
            knifeRadius + enemyRadius
          )
        ) {
          const now = Date.now();

          // Respeita o cooldown de dano (reduzido por nível)
          if (now - enemy.lastDamageTime > levelStats.effectiveKnifeCooldown) {
            // Verifica crítico
            const isCritical = Math.random() < effectiveCritChance;
            let damageDealt = effectiveDamage;

            if (isCritical) {
              damageDealt *= effectiveCritMultiplier;
            }

            enemy.health -= damageDealt;
            enemy.lastDamageTime = now;

            // Se morreu, marca para remover
            if (enemy.health <= 0) {
              enemiesToRemove.push(index);
              setScore((s) => s + 10);

              // Notifica que o inimigo foi derrotado (para desbloquear no bestiário)
              if (onEnemyDefeated && enemy.malwareType) {
                onEnemyDefeated(enemy.malwareType);
              }

              // Ganha XP ao matar inimigo
              addXP(25);

              // Chance de dropar moeda (pode ser aumentada por upgrades)
              const dropChance = weaponStats?.moneyDropBonus
                ? GAME_CONFIG.MONEY.DROP_CHANCE * weaponStats.moneyDropBonus
                : GAME_CONFIG.MONEY.DROP_CHANCE;

              if (Math.random() < dropChance) {
                gameState.current.moneyDrops.push({
                  id: Date.now() + Math.random(),
                  x: enemyCenterX,
                  y: enemyCenterY,
                  value: GAME_CONFIG.MONEY.VALUE,
                });
              }

              // Lifesteal (roubo de vida) se tiver upgrade
              if (weaponStats?.lifesteal && weaponStats.lifesteal > 0) {
                const _healAmount = Math.ceil(damageDealt * weaponStats.lifesteal);
                // TODO: Implementar heal via callback quando setHealth for passado
              }
            }
          }
        }
      });

      return enemiesToRemove;
    },
    [gameState, setScore, addXP, getLevelStats, onEnemyDefeated, getWeaponStats]
  );

  /**
   * Executa todas as colisões e retorna inimigos para remover
   */
  const handleAllCollisions = useCallback(
    (enemies, player, knife, datacenter, currentLevel) => {
      // Colisões com player
      const playerHits = checkPlayerCollisions(enemies, player, currentLevel);

      // Colisões com data center
      checkDatacenterCollisions(enemies, datacenter);

      // Colisões com faca
      const knifeHits = checkKnifeCollisions(enemies, knife, currentLevel);

      // Combina índices únicos para remover
      const allHitsSet = new Set([...playerHits, ...knifeHits]);
      const indicesToRemove = Array.from(allHitsSet).sort((a, b) => b - a);

      // Remove inimigos mortos (em ordem decrescente para não quebrar índices)
      if (indicesToRemove.length > 0) {
        indicesToRemove.forEach((index) => {
          enemies.splice(index, 1);
        });
        setEnemies([...enemies]);
      }
    },
    [checkPlayerCollisions, checkDatacenterCollisions, checkKnifeCollisions, setEnemies]
  );

  return {
    handleAllCollisions,
    checkPlayerCollisions,
    checkDatacenterCollisions,
    checkKnifeCollisions,
  };
};
