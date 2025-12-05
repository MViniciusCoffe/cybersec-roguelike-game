/**
 * Configuração dos Sistemas Operacionais
 * Organizados por categoria/dificuldade
 */

// === CONSOLES (Fácil) ===
const CONSOLE_SYSTEMS = {
  NINTENDO: {
    id: 'nintendo',
    name: 'Nintendista',
    category: 'console',
    icon: '🍄',
    color: '#e60012',
    description: 'O charme dos clássicos em sua defesa',
    advantages: ['Inimigos mais previsíveis', '+15% velocidade', 'Power-ups duram mais'],
    disadvantages: ['Menos dano base', 'Upgrades limitados'],
    flavorText: '"It\'s-a me, Defensor!"',
    effects: {
      playerSpeed: 1.15,
      damageMultiplier: 0.85,
      powerUpDuration: 1.5,
      enemyPredictability: 1.3,
    },
  },
  XBOX: {
    id: 'xbox',
    name: 'Caixista',
    category: 'console',
    icon: '🟢',
    color: '#107c10',
    description: 'Força bruta e conquistas épicas',
    advantages: ['+20% de dano', 'Bônus de XP', 'Ataques em área maiores'],
    disadvantages: ['Velocidade reduzida', 'Maior custo de energia'],
    flavorText: '"Achievement Unlocked: Sobrevivência"',
    effects: {
      damageMultiplier: 1.2,
      xpBonus: 1.25,
      areaMultiplier: 1.3,
      playerSpeed: 0.9,
    },
  },
  PLAYSTATION: {
    id: 'playstation',
    name: 'Sonysta',
    category: 'console',
    icon: '🔵',
    color: '#003087',
    description: 'Exclusividade e qualidade premium',
    advantages: ['Habilidades exclusivas', '+10% defesa', 'Regeneração constante'],
    disadvantages: ['Menos apps compatíveis', 'Preços mais altos'],
    flavorText: '"Greatness Awaits... se você sobreviver"',
    effects: {
      defenseMultiplier: 1.1,
      healthRegen: 0.5,
      appCompatibility: 0.7,
      upgradeCost: 1.3,
    },
  },
};

// === CELULARES (Médio) ===
const MOBILE_SYSTEMS = {
  ANDROID: {
    id: 'android',
    name: 'Android',
    category: 'mobile',
    icon: '🤖',
    color: '#3ddc84',
    description: 'Liberdade total, mas com riscos',
    advantages: ['Alta customização', 'Apps -30% custo', 'Drops variados'],
    disadvantages: ['Cooldowns +20%', 'Chance de vírus'],
    flavorText: '"Liberdade demais pode ser perigosa…"',
    effects: {
      appCost: 0.7,
      appVariety: 1.5,
      cooldownMultiplier: 1.2,
      virusChance: 0.05,
    },
  },
  IOS: {
    id: 'ios',
    name: 'iOS',
    category: 'mobile',
    icon: '🍎',
    color: '#555555',
    description: 'Funciona. Sempre. Mas vai custar caro.',
    advantages: ['Estabilidade', 'Regeneração constante', 'Dano consistente'],
    disadvantages: ['Upgrades +40% custo', 'Menos apps'],
    flavorText: '"Funciona. Sempre. Mas vai custar caro."',
    effects: {
      healthRegen: 1.0,
      damageConsistency: 0.9,
      upgradeCost: 1.4,
      appVariety: 0.6,
    },
  },
};

// === COMPUTADORES (Difícil) ===
const DESKTOP_SYSTEMS = {
  WINDOWS: {
    id: 'windows',
    name: 'Windows',
    category: 'desktop',
    icon: '🪟',
    color: '#00a4ef',
    description: 'Compatível com tudo, inclusive problemas',
    advantages: ['+15% dano a todos', '+25% chance crítico'],
    disadvantages: ['Chance de "travada"'],
    flavorText: '"Se travar, é só reiniciar."',
    effects: {
      damageMultiplier: 1.15,
      critChance: 0.25,
      freezeChance: 0.03,
      freezeDuration: 2000,
    },
  },
  LINUX: {
    id: 'linux',
    name: 'Linux',
    category: 'desktop',
    icon: '🐧',
    color: '#fcc624',
    description: 'Performance extrema para quem domina',
    advantages: ['+20% velocidade', 'Upgrades -40% custo'],
    disadvantages: ['Poucos apps', 'Depende de sinergias'],
    flavorText: '"Com grandes poderes vêm grandes linhas de comando."',
    effects: {
      playerSpeed: 1.2,
      defenseMultiplier: 1.15,
      upgradeCost: 0.6,
      appVariety: 0.4,
      synergyBonus: 1.5,
    },
  },
  MACOS: {
    id: 'macos',
    name: 'macOS',
    category: 'desktop',
    icon: '🍏',
    color: '#a3aaae',
    description: 'Bonito, limpo e caro',
    advantages: ['Estabilidade', '+25% dano', 'Cooldown -20%'],
    disadvantages: ['Menos compatibilidade', 'Upgrades +50%'],
    flavorText: '"Bonito, limpo e caro."',
    effects: {
      damageMultiplier: 1.25,
      cooldownMultiplier: 0.8,
      appCompatibility: 0.6,
      upgradeCost: 1.5,
    },
  },
};

// === SERVIDORES (Insano) ===
const SERVER_SYSTEMS = {
  UBUNTU_SERVER: {
    id: 'ubuntu_server',
    name: 'Ubuntu Server',
    category: 'server',
    icon: '🟠',
    color: '#e95420',
    description: 'Estabilidade acima de tudo',
    advantages: ['Performance constante', '+50% vida', 'Inimigos previsíveis'],
    disadvantages: ['-30% crítico'],
    flavorText: '"Nunca desligado desde 2016."',
    effects: {
      maxHealthMultiplier: 1.5,
      enemyPredictability: 1.5,
      critChance: -0.3,
      critDamage: 0.7,
    },
  },
  WINDOWS_SERVER: {
    id: 'windows_server',
    name: 'Windows Server',
    category: 'server',
    icon: '🏢',
    color: '#0078d4',
    description: 'Poder corporativo em escala',
    advantages: ['+40% dano a hordas', 'Melhor scaling'],
    disadvantages: ['Alto consumo de stamina'],
    flavorText: '"Por favor não reinicie agora."',
    effects: {
      hordeDamageMultiplier: 1.4,
      waveScaling: 1.3,
      staminaDrain: 1.5,
    },
  },
  DEBIAN: {
    id: 'debian',
    name: 'Debian',
    category: 'server',
    icon: '🌀',
    color: '#a80030',
    description: 'Estável como uma rocha',
    advantages: ['+30% defesa', 'Imune a debuffs', 'Regen de escudo'],
    disadvantages: ['Poucos apps', 'Menos dano'],
    flavorText: '"Estável desde antes de você nascer."',
    effects: {
      defenseMultiplier: 1.3,
      debuffImmunity: true,
      shieldRegen: 2.0,
      damageMultiplier: 0.85,
      appVariety: 0.3,
    },
  },
  REDHAT: {
    id: 'redhat',
    name: 'Red Hat Enterprise',
    category: 'server',
    icon: '🎩',
    color: '#ee0000',
    description: 'Suporte empresarial de elite',
    advantages: ['Revive 1x', '+20% todas stats', 'XP dobrado'],
    disadvantages: ['Apps 3x mais caros'],
    flavorText: '"Quando cair, ligue para o suporte."',
    effects: {
      reviveCount: 1,
      allStatsBonus: 1.2,
      xpMultiplier: 2.0,
      appCost: 3.0,
      appVariety: 0.5,
    },
  },
};

// Exporta todos os sistemas
export const OPERATING_SYSTEMS = {
  ...CONSOLE_SYSTEMS,
  ...MOBILE_SYSTEMS,
  ...DESKTOP_SYSTEMS,
  ...SERVER_SYSTEMS,
};

// Categorias de sistemas
export const OS_CATEGORIES = {
  console: {
    id: 'console',
    name: 'Console de Joguinhos',
    emoji: '🎮',
    description: 'Fácil - Para quem quer se divertir',
    systems: Object.values(CONSOLE_SYSTEMS),
  },
  mobile: {
    id: 'mobile',
    name: 'Celular',
    emoji: '📱',
    description: 'Médio - Desafio moderado',
    systems: Object.values(MOBILE_SYSTEMS),
  },
  desktop: {
    id: 'desktop',
    name: 'Computador',
    emoji: '💻',
    description: 'Difícil - Para quem gosta de desafio',
    systems: Object.values(DESKTOP_SYSTEMS),
  },
  server: {
    id: 'server',
    name: 'Servidor',
    emoji: '🖥️',
    description: 'Insano - Apenas para os dedicados',
    systems: Object.values(SERVER_SYSTEMS),
  },
};

// Helper: pega SO por ID
export const getOSById = (id) => {
  return Object.values(OPERATING_SYSTEMS).find((os) => os.id === id);
};

// Helper: pega SOs por categoria
export const getOSByCategory = (category) => {
  return Object.values(OPERATING_SYSTEMS).filter((os) => os.category === category);
};
