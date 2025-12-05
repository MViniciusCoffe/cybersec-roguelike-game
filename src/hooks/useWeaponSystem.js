import { useState, useCallback, useRef, useMemo } from 'react';
import {
  WEAPON_TYPES,
  WEAPON_TIERS,
  HYBRID_WEAPONS,
  UNIVERSAL_UPGRADES,
  calculateWeaponStats,
  getAvailableWeapons,
  getAvailableUpgrades,
  WEAPON_CRIT_EFFECTS,
  OS_CRIT_MODIFIERS,
} from '../constants/weapons';

/**
 * Hook para gerenciar o sistema de armas
 * Controla a arma atual, upgrades, tier e mecânicas especiais
 */
export function useWeaponSystem(selectedOS = null, installedApps = []) {
  // Estado da arma atual
  const [currentWeapon, setCurrentWeapon] = useState(WEAPON_TYPES.DIGITAL_SWORD);
  const [weaponTier, setWeaponTier] = useState('BASIC');
  const [weaponUpgrades, setWeaponUpgrades] = useState([]);
  const [specialCooldown, setSpecialCooldown] = useState(0);

  // Refs para estado em tempo real
  const lastSpecialUseRef = useRef(0);
  const activeEffectsRef = useRef([]);
  const projectilesRef = useRef([]);
  const barriersRef = useRef([]);
  const debuffsRef = useRef(new Map()); // Map de inimigo -> debuff

  // Calcular stats finais da arma
  const weaponStats = useMemo(() => {
    return calculateWeaponStats(
      currentWeapon,
      weaponTier,
      weaponUpgrades,
      selectedOS?.id,
      installedApps
    );
  }, [currentWeapon, weaponTier, weaponUpgrades, selectedOS, installedApps]);

  // Obter efeito de crítico da arma
  const critEffect = useMemo(() => {
    const weaponCrit = WEAPON_CRIT_EFFECTS[currentWeapon.id];
    const osCrit = selectedOS ? OS_CRIT_MODIFIERS[selectedOS.id?.toLowerCase()] : null;

    return {
      weapon: weaponCrit,
      os: osCrit,
      finalMultiplier: (weaponCrit?.multiplier || 1) * (osCrit?.damage || 1),
    };
  }, [currentWeapon, selectedOS]);

  // Trocar arma
  const switchWeapon = useCallback((newWeapon) => {
    if (typeof newWeapon === 'string') {
      const weapon = WEAPON_TYPES[newWeapon.toUpperCase()] || WEAPON_TYPES.DIGITAL_SWORD;
      setCurrentWeapon(weapon);
    } else {
      setCurrentWeapon(newWeapon);
    }
    // Reset upgrades ao trocar de arma (mantém tier se for upgrade)
    setWeaponUpgrades([]);
    setSpecialCooldown(0);
  }, []);

  // Evoluir tier da arma
  const upgradeTier = useCallback(() => {
    const tiers = Object.keys(WEAPON_TIERS);
    const currentIndex = tiers.indexOf(weaponTier);
    if (currentIndex < tiers.length - 1) {
      setWeaponTier(tiers[currentIndex + 1]);
      return true;
    }
    return false;
  }, [weaponTier]);

  // Adicionar upgrade
  const addUpgrade = useCallback((upgrade) => {
    setWeaponUpgrades((prev) => {
      // Verificar se já tem o upgrade e pode stackar
      const existing = prev.find((u) => u.id === upgrade.id);
      if (existing) {
        const maxStacks = upgrade.maxStacks || 1;
        if ((existing.stacks || 1) < maxStacks) {
          return prev.map((u) => (u.id === upgrade.id ? { ...u, stacks: (u.stacks || 1) + 1 } : u));
        }
        return prev; // Já no máximo
      }
      return [...prev, { ...upgrade, stacks: 1 }];
    });
  }, []);

  // Usar habilidade especial
  const useSpecial = useCallback(() => {
    const now = Date.now();
    const cooldownTime = currentWeapon.special?.cooldown || 30000;
    const cooldownReduction = weaponStats.specialCooldown || 1;
    const actualCooldown = cooldownTime * cooldownReduction;

    if (now - lastSpecialUseRef.current < actualCooldown) {
      return {
        success: false,
        remainingCooldown: actualCooldown - (now - lastSpecialUseRef.current),
      };
    }

    lastSpecialUseRef.current = now;
    setSpecialCooldown(actualCooldown);

    // Retorna informações sobre o efeito especial a ser aplicado
    return {
      success: true,
      effect: currentWeapon.special?.effect,
      params: {
        ...currentWeapon.special,
        damage: weaponStats.damage * 2,
        radius: currentWeapon.special?.radius || 100,
      },
    };
  }, [currentWeapon, weaponStats]);

  // Calcular dano de ataque
  const calculateDamage = useCallback(
    (isCritical = false) => {
      let damage = weaponStats.damage;

      if (isCritical) {
        damage *= weaponStats.critMultiplier;
        damage *= critEffect.finalMultiplier;

        // Aplicar efeitos especiais de crítico do SO
        if (critEffect.os?.variance) {
          const variance = critEffect.os.variance;
          damage *= 1 + (Math.random() * variance * 2 - variance);
        }
      }

      return Math.round(damage);
    },
    [weaponStats, critEffect]
  );

  // Verificar se ataque é crítico
  const rollCritical = useCallback(() => {
    let critChance = weaponStats.critChance;

    // Bônus de crítico do SO
    if (critEffect.os?.bonus) {
      critChance += critEffect.os.bonus;
    }

    // Crítico caótico do Android
    if (critEffect.os?.chaos) {
      critChance += (Math.random() - 0.5) * critEffect.os.chaos;
    }

    return Math.random() < critChance;
  }, [weaponStats, critEffect]);

  // Executar ataque baseado no tipo de arma
  const executeAttack = useCallback(
    (playerPos, targetPos) => {
      const attackType = currentWeapon.mechanics.type;
      const isCrit = rollCritical();
      const damage = calculateDamage(isCrit);

      const attackResult = {
        damage,
        isCritical: isCrit,
        type: attackType,
        effects: [],
        projectiles: [],
        debuffs: [],
      };

      switch (attackType) {
        case 'rotating': {
          // Arma rotativa padrão (espada digital)
          attackResult.hitArea = {
            x: playerPos.x,
            y: playerPos.y,
            radius: weaponStats.range,
          };
          break;
        }

        case 'wave': {
          // Antivírus - onda de varredura
          const angle = Math.atan2(targetPos.y - playerPos.y, targetPos.x - playerPos.x);
          attackResult.projectiles.push({
            type: 'wave',
            x: playerPos.x,
            y: playerPos.y,
            angle,
            width: currentWeapon.mechanics.waveWidth * (weaponStats.waveWidth || 1),
            speed: currentWeapon.mechanics.waveSpeed,
            damage,
            piercing: currentWeapon.mechanics.piercing,
            pierceCount: weaponStats.pierceCount || 999,
          });
          break;
        }

        case 'barrier': {
          // Firewall - barreira
          const barrierAngle = Math.atan2(targetPos.y - playerPos.y, targetPos.x - playerPos.x);
          barriersRef.current.push({
            id: Date.now(),
            x: playerPos.x + Math.cos(barrierAngle) * 50,
            y: playerPos.y + Math.sin(barrierAngle) * 50,
            width: currentWeapon.mechanics.barrierWidth * (weaponStats.barrierWidth || 1),
            height: currentWeapon.mechanics.barrierHeight,
            angle: barrierAngle,
            duration: currentWeapon.mechanics.barrierDuration * (weaponStats.barrierDuration || 1),
            damagePerSecond: damage / 5,
            createdAt: Date.now(),
          });
          break;
        }

        case 'debuff': {
          // Antimalware - aplicar corrupção
          attackResult.applyDebuff = {
            type: 'corruption',
            duration: currentWeapon.mechanics.debuffDuration * (weaponStats.debuffDuration || 1),
            explosionDamage:
              currentWeapon.mechanics.explosionDamage *
              (weaponStats.explosionDamage || 1) *
              (isCrit ? 3 : 1),
            explosionRadius:
              currentWeapon.mechanics.explosionRadius * (weaponStats.explosionRadius || 1),
            canSpread: weaponStats.spreadToNearby || false,
            spreadChance: weaponStats.spreadChance || 0,
          };
          break;
        }

        case 'reactive': {
          // IDS - preparar contra-ataque
          attackResult.prepareCounterAttack = {
            radius: currentWeapon.mechanics.detectionRadius * (weaponStats.detectionRadius || 1),
            counterDamage:
              currentWeapon.mechanics.counterAttackDamage * (weaponStats.counterAttackDamage || 1),
            delay: currentWeapon.mechanics.reactionDelay * (weaponStats.reactionDelay || 1),
            stun: weaponStats.stunOnCounter || false,
          };
          break;
        }

        case 'stealth': {
          // VPN - ativar invisibilidade
          attackResult.activateStealth = {
            duration:
              currentWeapon.mechanics.invisibilityDuration *
              (weaponStats.invisibilityDuration || 1),
            teleportDistance:
              currentWeapon.mechanics.teleportDistance * (weaponStats.teleportDistance || 1),
            healPerSecond: currentWeapon.mechanics.healWhileInvisible,
            clones: currentWeapon.mechanics.cloneCount + (weaponStats.cloneCount || 0),
            clonesDoDamage: weaponStats.cloneDamage || false,
          };
          break;
        }

        case 'projectile': {
          // Anti-Spam - projéteis múltiplos
          const projectileCount = Math.round(
            currentWeapon.mechanics.projectileCount * (weaponStats.projectileCount || 1)
          );
          const baseAngle = Math.atan2(targetPos.y - playerPos.y, targetPos.x - playerPos.x);
          const spread = currentWeapon.mechanics.spread * (Math.PI / 180);

          for (let i = 0; i < projectileCount; i++) {
            const angleOffset = (i - (projectileCount - 1) / 2) * (spread / projectileCount);
            attackResult.projectiles.push({
              type: 'spam',
              x: playerPos.x,
              y: playerPos.y,
              angle:
                baseAngle + angleOffset + (weaponStats.chaos ? (Math.random() - 0.5) * 0.3 : 0),
              speed: currentWeapon.mechanics.projectileSpeed * (weaponStats.projectileSpeed || 1),
              damage: damage / projectileCount,
              piercing: weaponStats.piercing || false,
              homing: weaponStats.homing || false,
            });
          }
          break;
        }

        default:
          break;
      }

      // Adicionar efeitos de sinergia do SO
      if (weaponStats.synergyEffect) {
        attackResult.effects.push(weaponStats.synergyEffect);
      }

      // Verificar falha do Android/Windows
      if (selectedOS) {
        const synergy = currentWeapon.synergies?.[selectedOS.id?.toLowerCase()];
        if (synergy?.failChance && Math.random() < synergy.failChance) {
          attackResult.failed = true;
          attackResult.effects.push('Falha de ativação!');
        }
        if (synergy?.chaos && Math.random() < synergy.chaos) {
          attackResult.chaosEffect = true;
          attackResult.damage *= 0.5 + Math.random();
        }
      }

      return attackResult;
    },
    [currentWeapon, weaponStats, selectedOS, rollCritical, calculateDamage]
  );

  // Atualizar cooldown
  const updateCooldown = useCallback(
    (deltaTime) => {
      if (specialCooldown > 0) {
        setSpecialCooldown((prev) => Math.max(0, prev - deltaTime));
      }

      // Limpar barreiras expiradas
      const now = Date.now();
      barriersRef.current = barriersRef.current.filter((b) => now - b.createdAt < b.duration);

      // Processar debuffs
      debuffsRef.current.forEach((debuff, enemyId) => {
        if (now - debuff.appliedAt >= debuff.duration) {
          // Debuff expirou - explodir!
          debuffsRef.current.delete(enemyId);
        }
      });
    },
    [specialCooldown]
  );

  // Aplicar debuff a um inimigo
  const applyDebuff = useCallback((enemyId, debuffData) => {
    debuffsRef.current.set(enemyId, {
      ...debuffData,
      appliedAt: Date.now(),
    });
  }, []);

  // Obter debuffs de um inimigo
  const getEnemyDebuffs = useCallback((enemyId) => {
    return debuffsRef.current.get(enemyId);
  }, []);

  // Detonar todos os debuffs (habilidade especial do Antimalware)
  const detonateAllDebuffs = useCallback(() => {
    const explosions = [];
    debuffsRef.current.forEach((debuff, enemyId) => {
      explosions.push({
        enemyId,
        damage: debuff.explosionDamage * 2, // Dano dobrado
        radius: debuff.explosionRadius,
      });
    });
    debuffsRef.current.clear();
    return explosions;
  }, []);

  // Obter barreiras ativas
  const getActiveBarriers = useCallback(() => {
    return barriersRef.current;
  }, []);

  // Obter opções de armas para seleção entre waves
  const getWeaponOptions = useCallback(
    (waveNumber) => {
      return getAvailableWeapons(currentWeapon, waveNumber);
    },
    [currentWeapon]
  );

  // Obter opções de upgrades para seleção
  const getUpgradeOptions = useCallback(
    (waveNumber) => {
      const tierNum = WEAPON_TIERS[weaponTier]?.id || 1;
      return getAvailableUpgrades(currentWeapon, tierNum, waveNumber);
    },
    [currentWeapon, weaponTier]
  );

  // Resetar sistema de armas
  const resetWeaponSystem = useCallback(() => {
    setCurrentWeapon(WEAPON_TYPES.DIGITAL_SWORD);
    setWeaponTier('BASIC');
    setWeaponUpgrades([]);
    setSpecialCooldown(0);
    lastSpecialUseRef.current = 0;
    activeEffectsRef.current = [];
    projectilesRef.current = [];
    barriersRef.current = [];
    debuffsRef.current.clear();
  }, []);

  // Obter informações para a UI
  const getWeaponInfo = useCallback(() => {
    const tier = WEAPON_TIERS[weaponTier];
    const cooldownTime = currentWeapon.special?.cooldown || 30000;
    const cooldownReduction = weaponStats.specialCooldown || 1;
    const actualCooldown = cooldownTime * cooldownReduction;
    const cooldownRemaining = Math.max(
      0,
      actualCooldown - (Date.now() - lastSpecialUseRef.current)
    );

    return {
      weapon: currentWeapon,
      tier,
      stats: weaponStats,
      upgrades: weaponUpgrades,
      special: {
        ...currentWeapon.special,
        cooldownRemaining,
        cooldownTotal: actualCooldown,
        isReady: cooldownRemaining === 0,
      },
      critEffect,
      synergyEffect: weaponStats.synergyEffect,
    };
  }, [currentWeapon, weaponTier, weaponStats, weaponUpgrades, critEffect]);

  return {
    // Estado
    currentWeapon,
    weaponTier,
    weaponUpgrades,
    weaponStats,
    specialCooldown,
    critEffect,

    // Ações
    switchWeapon,
    upgradeTier,
    addUpgrade,
    useSpecial,
    executeAttack,
    updateCooldown,
    applyDebuff,
    getEnemyDebuffs,
    detonateAllDebuffs,
    getActiveBarriers,
    resetWeaponSystem,

    // Seleção
    getWeaponOptions,
    getUpgradeOptions,

    // UI
    getWeaponInfo,

    // Constantes
    WEAPON_TYPES,
    WEAPON_TIERS,
    HYBRID_WEAPONS,
  };
}
