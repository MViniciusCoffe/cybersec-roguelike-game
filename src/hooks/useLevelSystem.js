import { useCallback } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';

/**
 * Hook que gerencia o sistema de níveis
 * Calcula XP necessário, bônus por nível, etc
 */
export const useLevelSystem = (gameState, setLevel, setCurrentXP, onLevelUp = null) => {
  /**
   * Calcula XP necessário para um nível específico
   */
  const getXPRequiredForLevel = useCallback((level) => {
    if (level <= 1) return GAME_CONFIG.LEVEL.BASE_XP_REQUIRED;

    // Cresce exponencialmente: baseXP * multiplier^(level-1)
    return Math.floor(
      GAME_CONFIG.LEVEL.BASE_XP_REQUIRED * Math.pow(GAME_CONFIG.LEVEL.XP_MULTIPLIER, level - 1)
    );
  }, []);

  /**
   * Retorna estatísticas baseadas no nível
   */
  const getLevelStats = useCallback((level) => {
    return {
      level,
      knifeDamageBonus: level * GAME_CONFIG.LEVEL.KNIFE_DAMAGE_BONUS,
      knifeCooldownReduction: Math.min(
        level * GAME_CONFIG.LEVEL.KNIFE_COOLDOWN_REDUCTION,
        GAME_CONFIG.KNIFE.DAMAGE_COOLDOWN - GAME_CONFIG.LEVEL.MIN_COOLDOWN
      ),
      playerSpeedBonus: level * GAME_CONFIG.LEVEL.PLAYER_SPEED_BONUS,
      defenseMultiplier: 1 - Math.min(level * GAME_CONFIG.LEVEL.DEFENSE_BONUS, 0.8), // Máx 80% redução
      effectiveKnifeDamage: GAME_CONFIG.KNIFE.DAMAGE + level * GAME_CONFIG.LEVEL.KNIFE_DAMAGE_BONUS,
      effectiveKnifeCooldown: Math.max(
        GAME_CONFIG.KNIFE.DAMAGE_COOLDOWN - level * GAME_CONFIG.LEVEL.KNIFE_COOLDOWN_REDUCTION,
        GAME_CONFIG.LEVEL.MIN_COOLDOWN
      ),
      effectivePlayerSpeed: GAME_CONFIG.PLAYER.SPEED + level * GAME_CONFIG.LEVEL.PLAYER_SPEED_BONUS,
    };
  }, []);

  /**
   * Ganha XP e verifica se subiu de nível
   */
  const addXP = useCallback(
    (amount) => {
      const gameLevel = gameState.current.level || 1;
      let currentXP = gameState.current.currentXP || 0;
      let newLevel = gameLevel;

      currentXP += amount;

      // Verifica quantos níveis subiu
      while (newLevel < GAME_CONFIG.LEVEL.MAX_LEVEL) {
        const xpNeeded = getXPRequiredForLevel(newLevel + 1);
        if (currentXP >= xpNeeded) {
          currentXP -= xpNeeded;
          newLevel += 1;
        } else {
          break;
        }
      }

      // Atualiza game state
      gameState.current.level = newLevel;
      gameState.current.currentXP = currentXP;

      // Atualiza React state
      if (newLevel !== gameLevel) {
        setLevel(newLevel);
        // Notifica callback de level up
        if (onLevelUp) {
          onLevelUp(newLevel, newLevel - gameLevel);
        }
      }
      setCurrentXP(currentXP);

      return {
        leveledUp: newLevel > gameLevel,
        newLevel,
        newXP: currentXP,
      };
    },
    [gameState, setLevel, setCurrentXP, getXPRequiredForLevel]
  );

  /**
   * Retorna progresso para o próximo nível (0 a 100)
   */
  const getXPProgress = useCallback(
    (level, currentXP) => {
      const xpNeeded = getXPRequiredForLevel(level + 1);
      return Math.min(100, (currentXP / xpNeeded) * 100);
    },
    [getXPRequiredForLevel]
  );

  /**
   * Retorna XP atual e XP necessário para renderizar
   */
  const getXPDisplay = useCallback(
    (level, currentXP) => {
      const xpNeeded = getXPRequiredForLevel(level + 1);
      return {
        current: currentXP,
        needed: xpNeeded,
        progress: getXPProgress(level, currentXP),
      };
    },
    [getXPRequiredForLevel, getXPProgress]
  );

  return {
    getXPRequiredForLevel,
    getLevelStats,
    addXP,
    getXPProgress,
    getXPDisplay,
  };
};
