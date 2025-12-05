import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GAME_CONFIG } from './constants/gameConfig';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useContainerSize } from './hooks/useContainerSize';
import { usePauseKey } from './hooks/usePauseKey';
import { useLevelSystem } from './hooks/useLevelSystem';
import { useWeaponSystem } from './hooks/useWeaponSystem';
import { GameHUD } from './components/GameHUD';
import { GameArena } from './components/GameArena';
import { GameOverlay } from './components/GameOverlay';
import { MainMenu } from './components/MainMenu';
import { SystemSelect } from './components/SystemSelect';
import { AppSelect } from './components/AppSelect';
import { WeaponSelect } from './components/WeaponSelect';
import './App.css';

const App = () => {
  // Estados do React
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [health, setHealth] = useState(GAME_CONFIG.PLAYER.MAX_HEALTH);
  const [datacenterHealth, setDatacenterHealth] = useState(GAME_CONFIG.DATA_CENTER.MAX_HEALTH);
  const [money, setMoney] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null); // 'player' ou 'datacenter'
  const [enemies, setEnemies] = useState([]);
  const [moneyDrops, setMoneyDrops] = useState([]);
  const [defeatedEnemies, setDefeatedEnemies] = useState([]); // Inimigos derrotados para o bestiário
  const [currentWave, setCurrentWave] = useState(null); // Onda atual
  const [waveTimer, setWaveTimer] = useState(60); // Timer da onda

  // Estados do sistema de progressão roguelike
  const [gamePhase, setGamePhase] = useState('menu'); // 'menu', 'system', 'playing', 'app-select', 'weapon-select', 'level-up'
  const [selectedOS, setSelectedOS] = useState(null);
  const [installedApps, setInstalledApps] = useState([]);
  const [lastCompletedWave, setLastCompletedWave] = useState(0);
  const [pendingLevelUps, setPendingLevelUps] = useState(0); // Quantos level ups pendentes para escolher upgrade

  // Estados do sistema de armas
  const [projectiles, setProjectiles] = useState([]);
  const [barriers, setBarriers] = useState([]);
  const [activeEffects, setActiveEffects] = useState([]);

  // Refs para manipulação DOM
  const playerRef = useRef(null);
  const knifeRef = useRef(null);
  const enemiesRef = useRef([]);
  const moneyRef = useRef([]);
  const containerRef = useRef(null);
  const loopStartedRef = useRef(false);
  const resetLoopRef = useRef(null); // Ref para armazenar a função resetLoop

  // Estado do jogo (não causa re-render)
  const gameState = useRef({
    player: {
      x: GAME_CONFIG.PLAYER.INITIAL_X === 'center' ? 0 : GAME_CONFIG.PLAYER.INITIAL_X,
      y: GAME_CONFIG.PLAYER.INITIAL_Y === 'center' ? 0 : GAME_CONFIG.PLAYER.INITIAL_Y,
      size: GAME_CONFIG.PLAYER.SIZE,
      speed: GAME_CONFIG.PLAYER.SPEED,
    },
    level: 1,
    currentXP: 0,
    datacenter: {
      x: GAME_CONFIG.DATA_CENTER.POSITION_X === 'center' ? 0 : GAME_CONFIG.DATA_CENTER.POSITION_X,
      y: GAME_CONFIG.DATA_CENTER.POSITION_Y === 'center' ? 0 : GAME_CONFIG.DATA_CENTER.POSITION_Y,
      size: GAME_CONFIG.DATA_CENTER.SIZE,
      health: GAME_CONFIG.DATA_CENTER.MAX_HEALTH,
      lastDamageTime: 0,
    },
    knife: {
      x: 0,
      y: 0,
      angle: 0,
      width: GAME_CONFIG.KNIFE.WIDTH,
      height: GAME_CONFIG.KNIFE.HEIGHT,
    },
    enemies: [],
    moneyDrops: [],
    keys: { ...GAME_CONFIG.KEYS },
    container: { width: 0, height: 0 },
  });

  // Sistema de armas
  const weaponSystem = useWeaponSystem(selectedOS, installedApps);
  const {
    currentWeapon,
    weaponTier,
    switchWeapon,
    upgradeTier,
    addUpgrade,
    useSpecial,
    getActiveBarriers,
    getWeaponOptions,
    getUpgradeOptions,
    getWeaponInfo,
    resetWeaponSystem,
  } = weaponSystem;

  // Handlers de progressão roguelike
  const handleStartNewRun = useCallback(() => {
    setGamePhase('system');
  }, []);

  const handleSelectOS = useCallback((os) => {
    setSelectedOS(os);
    setInstalledApps([]);
    setLastCompletedWave(0);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setGamePhase('menu');
    setSelectedOS(null);
    setInstalledApps([]);
    setLastCompletedWave(0);
  }, []);

  const handleAppSelect = useCallback((app) => {
    setInstalledApps((prev) => [...prev, app]);
    // Retoma o jogo após instalar app
    setGamePhase('playing');
    setGameActive(true);
  }, []);

  const handleSkipApp = useCallback(() => {
    // Retoma o jogo sem instalar app
    setGamePhase('playing');
    setGameActive(true);
  }, []);

  // Handlers para seleção de armas
  const handleSelectWeapon = useCallback(
    (option) => {
      if (option.type === 'upgrade') {
        // Evoluir tier da arma atual
        upgradeTier();
      } else if (option.type === 'new' || option.type === 'hybrid') {
        // Trocar para nova arma
        switchWeapon(option.weapon);
      }
      // Continua o jogo
      setGamePhase('playing');
      setGameActive(true);
    },
    [upgradeTier, switchWeapon]
  );

  const handleSelectUpgrade = useCallback(
    (upgrade) => {
      addUpgrade(upgrade);
      // Continua o jogo
      setGamePhase('playing');
      setGameActive(true);
    },
    [addUpgrade]
  );

  const handleSkipWeapon = useCallback(() => {
    // Continua sem melhoria de arma
    setGamePhase('playing');
    setGameActive(true);
  }, []);

  // Handler para usar habilidade especial
  const handleUseSpecial = useCallback(() => {
    const result = useSpecial();
    if (result.success) {
      // Aplicar efeito especial baseado na arma
      console.log('Habilidade especial ativada:', result.effect);
      // TODO: Integrar com o game loop para aplicar efeitos
    }
  }, [useSpecial]);

  // Função para iniciar o jogo com as configurações de progressão
  const startGameWithProgression = useCallback(() => {
    setScore(0);
    setLevel(1);
    setCurrentXP(0);
    setHealth(GAME_CONFIG.PLAYER.MAX_HEALTH);
    setDatacenterHealth(GAME_CONFIG.DATA_CENTER.MAX_HEALTH);
    setMoney(0);
    setIsGameOver(false);
    setGameOverReason(null);
    setIsPaused(false);

    // Calcular posição do player (centro ou posição fixa)
    if (GAME_CONFIG.PLAYER.INITIAL_X === 'center') {
      gameState.current.player.x =
        gameState.current.container.width / 2 - GAME_CONFIG.PLAYER.SIZE / 2;
    } else {
      gameState.current.player.x = GAME_CONFIG.PLAYER.INITIAL_X;
    }

    if (GAME_CONFIG.PLAYER.INITIAL_Y === 'center') {
      gameState.current.player.y =
        gameState.current.container.height / 2 - GAME_CONFIG.PLAYER.SIZE / 2;
    } else {
      gameState.current.player.y = GAME_CONFIG.PLAYER.INITIAL_Y;
    }

    // Calcular posição do data center (centro ou posição fixa)
    if (GAME_CONFIG.DATA_CENTER.POSITION_X === 'center') {
      gameState.current.datacenter.x =
        gameState.current.container.width / 2 - GAME_CONFIG.DATA_CENTER.SIZE / 2;
    } else {
      gameState.current.datacenter.x = GAME_CONFIG.DATA_CENTER.POSITION_X;
    }

    if (GAME_CONFIG.DATA_CENTER.POSITION_Y === 'center') {
      gameState.current.datacenter.y =
        gameState.current.container.height / 2 - GAME_CONFIG.DATA_CENTER.SIZE / 2;
    } else {
      gameState.current.datacenter.y = GAME_CONFIG.DATA_CENTER.POSITION_Y;
    }

    gameState.current.level = 1;
    gameState.current.currentXP = 0;
    gameState.current.datacenter.health = GAME_CONFIG.DATA_CENTER.MAX_HEALTH;
    gameState.current.knife.angle = 0;
    gameState.current.enemies = [];
    gameState.current.moneyDrops = [];
    setEnemies([]);
    setProjectiles([]);
    setBarriers([]);
    setActiveEffects([]);
    resetWeaponSystem();
    // Reset do timer das waves para novo jogo (usa ref para evitar dependência circular)
    if (resetLoopRef.current) {
      resetLoopRef.current();
    }
    setGamePhase('playing');
    setGameActive(true);
  }, [resetWeaponSystem]);

  // Handlers
  const startGame = useCallback(() => {
    // Se já tem SO selecionado, inicia direto
    if (selectedOS) {
      startGameWithProgression();
    } else {
      // Senão, vai para seleção de sistema
      handleStartNewRun();
    }
  }, [selectedOS, startGameWithProgression, handleStartNewRun]);

  const pauseGame = useCallback(() => {
    setGameActive(false);
    setIsPaused(true);
    loopStartedRef.current = false;
  }, []);

  const resumeGame = useCallback(() => {
    setGameActive(true);
    setIsPaused(false);
  }, []);

  const backToMenu = useCallback(() => {
    setGameActive(false);
    setIsPaused(false);
    setIsGameOver(false);
    setGameOverReason(null);
    setGamePhase('menu');
    setSelectedOS(null);
    setInstalledApps([]);
    setLastCompletedWave(0);
    setProjectiles([]);
    setBarriers([]);
    setActiveEffects([]);
    resetWeaponSystem();
    loopStartedRef.current = false;
  }, [resetWeaponSystem]);

  // Callback para registrar inimigos derrotados no bestiário
  const handleEnemyDefeated = useCallback((malwareType) => {
    setDefeatedEnemies((prev) => {
      if (prev.includes(malwareType)) return prev;
      return [...prev, malwareType];
    });
  }, []);

  // Callback para mudança de onda - mostra seleção de apps/armas
  const handleWaveChange = useCallback(
    (wave) => {
      const newWaveNumber = wave?.id || 1;
      setCurrentWave(wave);

      // Se mudou de onda e não é a primeira, mostra seleção de melhorias
      if (newWaveNumber > lastCompletedWave && lastCompletedWave > 0) {
        setLastCompletedWave(newWaveNumber - 1);
        // Pausa o jogo para selecionar melhoria
        setGameActive(false);
        // Alterna entre seleção de app e arma
        if (lastCompletedWave % 2 === 0) {
          setGamePhase('weapon-select');
        } else {
          setGamePhase('app-select');
        }
      } else if (lastCompletedWave === 0 && newWaveNumber === 1) {
        // Primeira wave
        setLastCompletedWave(1);
      }
    },
    [lastCompletedWave]
  );

  // Callback para level up - mostra seleção de upgrades
  const handleLevelUp = useCallback((newLevel, levelsGained) => {
    console.log(`Level up! Novo nível: ${newLevel}, ganhou ${levelsGained} níveis`);
    setPendingLevelUps((prev) => prev + levelsGained);
    // Pausa o jogo para selecionar upgrade
    setGameActive(false);
    setGamePhase('level-up');
  }, []);

  // Custom Hooks
  const { getLevelStats, addXP, getXPDisplay } = useLevelSystem(
    gameState,
    setLevel,
    setCurrentXP,
    handleLevelUp
  );

  // Função para obter stats atuais da arma (para o sistema de colisão)
  const getWeaponStats = useCallback(() => {
    return weaponSystem.weaponStats;
  }, [weaponSystem.weaponStats]);

  const { startLoop, stopLoop, resetLoop, getCurrentWave, getWaveNumber, getWaveTimeRemaining } =
    useGameLoop(
      gameState,
      playerRef,
      knifeRef,
      enemiesRef,
      setScore,
      setHealth,
      setDatacenterHealth,
      setMoney,
      setEnemies,
      addXP,
      getLevelStats,
      (reason) => {
        setGameActive(false);
        setGameOverReason(reason);
        setIsGameOver(true);
      },
      handleEnemyDefeated,
      handleWaveChange,
      getWeaponStats
    );

  // Armazena resetLoop no ref para uso em startGameWithProgression
  resetLoopRef.current = resetLoop;

  useKeyboardControls(gameState);
  useContainerSize(containerRef, gameState);
  usePauseKey(gameActive && !isPaused, pauseGame);

  // Sincronizar enemies com o estado do React para renderização
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setEnemies([...gameState.current.enemies]);
        setMoneyDrops([...gameState.current.moneyDrops]);
        // Atualiza informações da onda
        setCurrentWave(getCurrentWave());
        setWaveTimer(getWaveTimeRemaining());
        // Atualiza barreiras ativas
        setBarriers(getActiveBarriers());
      }, 16); // ~60 FPS

      return () => clearInterval(interval);
    }
  }, [gameActive, getCurrentWave, getWaveTimeRemaining, getActiveBarriers]);

  // Parar o loop quando o jogo termina
  useEffect(() => {
    if (isGameOver) {
      stopLoop();
    }
  }, [isGameOver, stopLoop]);

  // Iniciar loop do jogo quando gameActive muda para true
  useEffect(() => {
    if (gameActive && !loopStartedRef.current) {
      loopStartedRef.current = true;
      startLoop();
    } else if (!gameActive) {
      loopStartedRef.current = false;
      stopLoop();
    }
  }, [gameActive, startLoop, stopLoop]);

  // Inicia o jogo quando selecionar um OS
  useEffect(() => {
    if (selectedOS && gamePhase === 'system') {
      startGameWithProgression();
    }
  }, [selectedOS, gamePhase, startGameWithProgression]);

  // Listener para tecla Q (habilidade especial)
  useEffect(() => {
    const handleSpecialKey = () => {
      if (gameActive && !isPaused && (gameState.current.keys.q || gameState.current.keys.Q)) {
        handleUseSpecial();
        // Reset para não disparar múltiplas vezes
        gameState.current.keys.q = false;
        gameState.current.keys.Q = false;
      }
    };

    if (gameActive) {
      const interval = setInterval(handleSpecialKey, 100);
      return () => clearInterval(interval);
    }
  }, [gameActive, isPaused, handleUseSpecial]);

  // Handler para selecionar upgrade ao subir de nível
  const handleLevelUpUpgrade = useCallback(
    (upgrade) => {
      addUpgrade(upgrade);
      setPendingLevelUps((prev) => {
        const remaining = prev - 1;
        if (remaining <= 0) {
          // Todos os level ups processados, volta ao jogo
          setGamePhase('playing');
          setGameActive(true);
        }
        return remaining;
      });
    },
    [addUpgrade]
  );

  const handleSkipLevelUpUpgrade = useCallback(() => {
    setPendingLevelUps((prev) => {
      const remaining = prev - 1;
      if (remaining <= 0) {
        // Todos os level ups processados, volta ao jogo
        setGamePhase('playing');
        setGameActive(true);
      }
      return remaining;
    });
  }, []);

  return (
    <div className="app-container dark">
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <GameArena
          containerRef={containerRef}
          playerRef={playerRef}
          knifeRef={knifeRef}
          enemiesRef={enemiesRef}
          moneyRef={moneyRef}
          gameActive={gameActive}
          playerSize={GAME_CONFIG.PLAYER.SIZE}
          knifeWidth={GAME_CONFIG.KNIFE.WIDTH}
          knifeHeight={GAME_CONFIG.KNIFE.HEIGHT}
          datacenterSize={GAME_CONFIG.DATA_CENTER.SIZE}
          enemies={enemies}
          moneyDrops={moneyDrops}
          gameState={gameState}
          weaponInfo={getWeaponInfo()}
          projectiles={projectiles}
          barriers={barriers}
          activeEffects={activeEffects}
        />

        {/* Menu Principal */}
        {gamePhase === 'menu' && !isPaused && !isGameOver && (
          <MainMenu onStart={handleStartNewRun} defeatedEnemies={defeatedEnemies} />
        )}

        {/* Seleção de Sistema Operacional */}
        {gamePhase === 'system' && (
          <SystemSelect onSelect={handleSelectOS} onBack={handleBackToMenu} />
        )}

        {/* Seleção de Apps (entre waves) */}
        {gamePhase === 'app-select' && selectedOS && (
          <AppSelect
            selectedOS={selectedOS}
            waveNumber={lastCompletedWave}
            installedApps={installedApps}
            onSelect={handleAppSelect}
            onSkip={handleSkipApp}
          />
        )}

        {/* Seleção de Armas (entre waves) */}
        {gamePhase === 'weapon-select' && selectedOS && (
          <WeaponSelect
            currentWeapon={currentWeapon}
            currentTier={weaponTier}
            weaponOptions={getWeaponOptions(lastCompletedWave)}
            upgradeOptions={getUpgradeOptions(lastCompletedWave)}
            selectedOS={selectedOS}
            waveNumber={lastCompletedWave}
            onSelectWeapon={handleSelectWeapon}
            onSelectUpgrade={handleSelectUpgrade}
            onSkip={handleSkipWeapon}
          />
        )}

        {/* Seleção de Upgrade ao subir de nível */}
        {gamePhase === 'level-up' && selectedOS && (
          <WeaponSelect
            currentWeapon={currentWeapon}
            currentTier={weaponTier}
            weaponOptions={[]} // Não oferece novas armas no level up
            upgradeOptions={getUpgradeOptions(level)}
            selectedOS={selectedOS}
            waveNumber={level}
            onSelectWeapon={() => {}}
            onSelectUpgrade={handleLevelUpUpgrade}
            onSkip={handleSkipLevelUpUpgrade}
            isLevelUp={true}
            pendingLevelUps={pendingLevelUps}
          />
        )}

        {isGameOver && (
          <GameOverlay
            onStart={startGame}
            isGameOver={isGameOver}
            score={score}
            reason={gameOverReason}
            selectedOS={selectedOS}
            installedApps={installedApps}
            onBackToMenu={backToMenu}
          />
        )}

        {isPaused && !isGameOver && (
          <div className="pause-overlay">
            <div className="pause-content">
              <h2>⏸️ DEFESA EM PAUSA</h2>
              <button onClick={resumeGame} className="btn btn-resume">
                CONTINUAR DEFENDENDO
              </button>
              <button onClick={backToMenu} className="btn btn-restart">
                REINICIAR DEFESA
              </button>
            </div>
          </div>
        )}

        <GameHUD
          score={score}
          health={health}
          datacenterHealth={datacenterHealth}
          money={money}
          level={level}
          xpDisplay={getXPDisplay(level, currentXP)}
          maxHealth={GAME_CONFIG.PLAYER.MAX_HEALTH}
          maxDatacenterHealth={GAME_CONFIG.DATA_CENTER.MAX_HEALTH}
          gameActive={gameActive && !isPaused}
          onPause={pauseGame}
          currentWave={currentWave}
          waveTimer={waveTimer}
          waveNumber={getWaveNumber()}
          selectedOS={selectedOS}
          installedApps={installedApps}
          weaponInfo={getWeaponInfo()}
          onUseSpecial={handleUseSpecial}
        />
      </div>
    </div>
  );
};

export default App;
