import { useRef, useCallback } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';

/**
 * Hook que gerencia o spawn de inimigos
 * Sistema de Ondas - Cada onda representa uma era tecnológica
 */
export const useEnemySpawner = (gameState, setEnemies, onWaveChange) => {
  const lastSpawnTime = useRef(0);
  const gameStartTime = useRef(0);
  const currentWaveRef = useRef(0);
  const pausedTimeRef = useRef(0); // Tempo total que o jogo ficou pausado
  const pauseStartRef = useRef(0); // Quando a pausa começou

  // Retorna tempo de jogo efetivo (desconta pausas)
  const getEffectiveGameTime = useCallback(() => {
    if (gameStartTime.current === 0) return 0;
    return performance.now() - gameStartTime.current - pausedTimeRef.current;
  }, []);

  // Retorna a onda atual baseada no tempo de jogo
  const getCurrentWave = useCallback(() => {
    const effectiveTime = getEffectiveGameTime();
    if (effectiveTime <= 0) return GAME_CONFIG.WAVES.DEFINITIONS[0];

    const waveIndex = Math.floor(effectiveTime / GAME_CONFIG.WAVES.DURATION);
    const maxWaveIndex = GAME_CONFIG.WAVES.DEFINITIONS.length - 1;

    return GAME_CONFIG.WAVES.DEFINITIONS[Math.min(waveIndex, maxWaveIndex)];
  }, [getEffectiveGameTime]);

  // Retorna o número da onda atual (1-indexed)
  const getWaveNumber = useCallback(() => {
    const effectiveTime = getEffectiveGameTime();
    if (effectiveTime <= 0) return 1;

    const waveNumber = Math.floor(effectiveTime / GAME_CONFIG.WAVES.DURATION) + 1;
    const maxWaves = GAME_CONFIG.WAVES.DEFINITIONS.length;

    return Math.min(waveNumber, maxWaves);
  }, [getEffectiveGameTime]);

  // Retorna tempo restante na onda atual (em segundos)
  const getWaveTimeRemaining = useCallback(() => {
    const effectiveTime = getEffectiveGameTime();
    if (effectiveTime <= 0) return GAME_CONFIG.WAVES.DURATION / 1000;

    const timeInCurrentWave = effectiveTime % GAME_CONFIG.WAVES.DURATION;
    const remaining = GAME_CONFIG.WAVES.DURATION - timeInCurrentWave;

    return Math.ceil(remaining / 1000);
  }, [getEffectiveGameTime]);

  // Retorna stats do inimigo baseado na onda atual
  const getWaveEnemyStats = useCallback(() => {
    const wave = getCurrentWave();
    return {
      health: wave.enemyHealth,
      speed: wave.enemySpeed,
      size: wave.enemySize,
      spawnInterval: wave.spawnInterval,
      maxEnemies: wave.maxEnemies,
    };
  }, [getCurrentWave]);

  const spawnEnemy = useCallback(() => {
    const state = gameState.current;
    const { container, enemies } = state;

    // Obtém stats da onda atual
    const waveStats = getWaveEnemyStats();

    // Não spawna se já atingiu o máximo da onda
    if (enemies.length >= waveStats.maxEnemies) return;

    // Escolhe um lado aleatório da tela
    const side = Math.floor(Math.random() * 4);
    let x, y;

    switch (side) {
      case 0: // Topo
        x = Math.random() * container.width;
        y = -waveStats.size;
        break;
      case 1: // Direita
        x = container.width;
        y = Math.random() * container.height;
        break;
      case 2: // Embaixo
        x = Math.random() * container.width;
        y = container.height;
        break;
      case 3: // Esquerda
        x = -waveStats.size;
        y = Math.random() * container.height;
        break;
      default:
        x = 0;
        y = 0;
    }

    // Tipos de malware (IDs correspondem ao MALWARE_DATABASE no Bestiary)
    const malwareTypes = [
      { type: 1, name: 'Malware' },
      { type: 2, name: 'Ransomware' },
      { type: 3, name: 'Phishing' },
      { type: 4, name: 'Trojan' },
      { type: 5, name: 'Spyware' },
      { type: 6, name: 'Worm' },
    ];

    // Escolhe um tipo aleatório de malware
    const randomMalware = malwareTypes[Math.floor(Math.random() * malwareTypes.length)];

    // Cria novo inimigo com stats da onda atual
    enemies.push({
      id: Date.now() + Math.random(),
      x,
      y,
      size: waveStats.size,
      health: waveStats.health,
      maxHealth: waveStats.health,
      speed: waveStats.speed,
      lastDamageTime: 0,
      lastDamageToDatacenter: 0,
      malwareType: randomMalware.type,
    });

    // Avisa o React para renderizar o novo inimigo
    setEnemies([...enemies]);
  }, [gameState, setEnemies, getWaveEnemyStats]);

  const checkAndSpawn = useCallback(
    (timestamp) => {
      // Inicializa tempo de início se necessário
      if (gameStartTime.current === 0) {
        gameStartTime.current = timestamp;
      }

      // Verifica mudança de onda
      const newWaveNumber = getWaveNumber();
      if (newWaveNumber !== currentWaveRef.current) {
        currentWaveRef.current = newWaveNumber;
        // Notifica mudança de onda se callback existir
        if (onWaveChange) {
          onWaveChange(getCurrentWave());
        }
      }

      // Obtém intervalo de spawn da onda atual
      const waveStats = getWaveEnemyStats();
      if (timestamp - lastSpawnTime.current > waveStats.spawnInterval) {
        spawnEnemy();
        lastSpawnTime.current = timestamp;
      }
    },
    [spawnEnemy, getWaveEnemyStats, getWaveNumber, getCurrentWave, onWaveChange]
  );

  const resetSpawnTime = useCallback(() => {
    lastSpawnTime.current = performance.now();
    gameStartTime.current = performance.now();
    currentWaveRef.current = 0;
    pausedTimeRef.current = 0;
    pauseStartRef.current = 0;
  }, []);

  // Pausar o timer (chamado quando o jogo pausa)
  const pauseTimer = useCallback(() => {
    if (pauseStartRef.current === 0) {
      pauseStartRef.current = performance.now();
    }
  }, []);

  // Resumir o timer (chamado quando o jogo despausa)
  const resumeTimer = useCallback(() => {
    if (pauseStartRef.current > 0) {
      pausedTimeRef.current += performance.now() - pauseStartRef.current;
      pauseStartRef.current = 0;
    }
  }, []);

  return {
    spawnEnemy,
    checkAndSpawn,
    resetSpawnTime,
    pauseTimer,
    resumeTimer,
    getCurrentWave,
    getWaveNumber,
    getWaveTimeRemaining,
  };
};
