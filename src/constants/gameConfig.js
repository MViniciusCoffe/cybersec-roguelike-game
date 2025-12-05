export const GAME_CONFIG = {
  PLAYER: {
    SIZE: 24,
    SPEED: 4.5,
    INITIAL_X: 'center',
    INITIAL_Y: 'center',
    MAX_HEALTH: 100,
  },
  ENEMY: {
    SIZE: 16,
    SPEED: 1.3, // Velocidade que persegue o jogador
    SPAWN_MARGIN: 10,
    SPAWN_INTERVAL: 1800, // Spawn a cada 1.8 segundos
    MAX_ENEMIES: 50, // Máximo de inimigos na tela
    HEALTH: 3, // Vida de cada inimigo
    MAX_HEALTH: 3, // Vida máxima (para referência)
    DAMAGE: 20, // Dano que causa ao jogador
    DATACENTER_DAMAGE: 25, // Dano que causa ao data center
  },
  KNIFE: {
    WIDTH: 6,
    HEIGHT: 20,
    ORBIT_RADIUS: 40,
    ROTATION_SPEED: 0.06,
    DAMAGE: 2, // Dano da espada por hit
    DAMAGE_COOLDOWN: 200, // Cooldown em ms entre hits no mesmo inimigo
  },
  DATA_CENTER: {
    SIZE: 60,
    MAX_HEALTH: 500,
    POSITION_X: 'center',
    POSITION_Y: 'center',
    COLLISION_DAMAGE_INTERVAL: 1000, // Dano a cada 1 segundo enquanto em contato
  },
  MONEY: {
    SIZE: 10,
    VALUE: 5, // Valor de cada moeda
    DROP_CHANCE: 0.15, // 15% de chance de dropar
    COLLECTION_RADIUS: 50, // Raio de coleta automática
  },
  LEVEL: {
    BASE_XP_REQUIRED: 10, // XP necessário para level 1
    XP_MULTIPLIER: 1.5, // Multiplicador de XP por nível (cresce exponencialmente)
    KNIFE_DAMAGE_BONUS: 0.5, // +0.5 de dano por nível (ex: level 5 = +2.5 dano)
    KNIFE_COOLDOWN_REDUCTION: 10, // -10ms de cooldown por nível
    MIN_COOLDOWN: 50, // Cooldown mínimo em ms
    PLAYER_SPEED_BONUS: 0.3, // +0.3 de velocidade por nível
    DEFENSE_BONUS: 0.03, // +3% de redução de dano por nível (multiplicativo)
    MAX_LEVEL: 100,
  },
  // Sistema de Ondas - Evolução da Tecnologia
  // Cada onda representa uma era tecnológica com ameaças mais avançadas
  WAVES: {
    DURATION: 60000, // 1 minuto por onda
    PREPARATION_TIME: 5000, // 5 segundos de preparação entre ondas
    // Definição de cada onda (era tecnológica)
    DEFINITIONS: [
      {
        id: 1,
        name: 'Wave 1',
        year: '1990',
        description: 'Os primeiros vírus de computador surgem',
        enemyHealth: 2,
        enemySpeed: 1.0,
        enemySize: 14,
        spawnInterval: 2500,
        maxEnemies: 15,
      },
      {
        id: 2,
        name: 'Wave 2',
        year: '2000',
        description: 'Worms se espalham pela internet',
        enemyHealth: 3,
        enemySpeed: 1.2,
        enemySize: 15,
        spawnInterval: 2200,
        maxEnemies: 20,
      },
      {
        id: 3,
        name: 'Wave 3',
        year: '2005',
        description: 'Spyware e adware dominam a web',
        enemyHealth: 4,
        enemySpeed: 1.4,
        enemySize: 16,
        spawnInterval: 1900,
        maxEnemies: 25,
      },
      {
        id: 4,
        name: 'Wave 4',
        year: '2010',
        description: 'Trojans sofisticados atacam sistemas',
        enemyHealth: 5,
        enemySpeed: 1.6,
        enemySize: 17,
        spawnInterval: 1600,
        maxEnemies: 30,
      },
      {
        id: 5,
        name: 'Wave 5',
        year: '2015',
        description: 'Ransomware sequestra dados críticos',
        enemyHealth: 6,
        enemySpeed: 1.8,
        enemySize: 18,
        spawnInterval: 1400,
        maxEnemies: 35,
      },
      {
        id: 6,
        name: 'Wave 6',
        year: '2020',
        description: 'Ameaças Persistentes Avançadas',
        enemyHealth: 8,
        enemySpeed: 2.0,
        enemySize: 20,
        spawnInterval: 1200,
        maxEnemies: 40,
      },
      {
        id: 7,
        name: 'Wave 7',
        year: '2025',
        description: 'Malware com inteligência artificial',
        enemyHealth: 10,
        enemySpeed: 2.2,
        enemySize: 22,
        spawnInterval: 1000,
        maxEnemies: 45,
      },
      {
        id: 8,
        name: 'Wave 8',
        year: '2030',
        description: 'O ataque final à infraestrutura global',
        enemyHealth: 12,
        enemySpeed: 2.5,
        enemySize: 24,
        spawnInterval: 800,
        maxEnemies: 50,
      },
    ],
  },
  KEYS: {
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    Q: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
  },
};
