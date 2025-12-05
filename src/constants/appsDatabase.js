/**
 * Banco de dados de Aplicativos
 * Organizados por plataforma
 */

// Apps Universais (disponíveis para todos)
export const UNIVERSAL_APPS = [
  {
    id: 'antivirus_basic',
    name: 'Antivírus Básico',
    icon: '🛡️',
    rarity: 'common',
    description: 'Proteção essencial',
    effects: { defenseMultiplier: 1.1 },
    flavorText: '"Melhor que nada."',
  },
  {
    id: 'energy_drink',
    name: 'Energético Digital',
    icon: '⚡',
    rarity: 'common',
    description: '+15% velocidade por 30s',
    effects: { speedBoost: 1.15, speedBoostDuration: 30000 },
    flavorText: '"Taurina virtual incluída."',
  },
  {
    id: 'backup_cloud',
    name: 'Backup na Nuvem',
    icon: '☁️',
    rarity: 'rare',
    description: 'Salva 50% da vida ao morrer (1x)',
    effects: { deathSave: true, deathSaveHealth: 0.5 },
    flavorText: '"Seus dados estão seguros... mais ou menos."',
  },
];

// Apps Android
export const ANDROID_APPS = [
  {
    id: 'apk_duvidoso',
    name: 'APK Duvidoso',
    icon: '📦',
    rarity: 'common',
    description: '+20% velocidade, -15% vida',
    effects: { playerSpeed: 1.2, maxHealthMultiplier: 0.85 },
    flavorText: '"Baixado de um site .ru muito confiável."',
  },
  {
    id: 'limpador_ram',
    name: 'Limpador de RAM',
    icon: '🧹',
    rarity: 'uncommon',
    description: 'Remove debuffs, acelera ataques',
    effects: { removeDebuffs: true, attackSpeedBoost: 1.15 },
    flavorText: '"1GB liberado! (mentira)"',
  },
  {
    id: 'game_booster',
    name: 'Game Booster',
    icon: '🚀',
    rarity: 'rare',
    description: '+25% dano por 20s após wave',
    effects: { damageBoost: 1.25, damageBoostDuration: 20000 },
    flavorText: '"Modo turbo ativado!"',
  },
  {
    id: 'custom_rom',
    name: 'Custom ROM',
    icon: '⚙️',
    rarity: 'epic',
    description: '+10% todas stats, -10% cooldown',
    effects: { allStatsBonus: 1.1, cooldownMultiplier: 0.9 },
    flavorText: '"Garantia? Que garantia?"',
  },
  {
    id: 'tasker',
    name: 'Tasker',
    icon: '🔧',
    rarity: 'legendary',
    description: 'Automatiza buffs aleatórios',
    effects: { autoBuffChance: 0.1, autoBuffStrength: 1.2 },
    flavorText: '"Se X então Y, senão Z..."',
  },
];

// Apps iOS
export const IOS_APPS = [
  {
    id: 'applecare',
    name: 'AppleCare+',
    icon: '🍎',
    rarity: 'uncommon',
    description: 'Regeneração constante',
    effects: { healthRegen: 2.0 },
    flavorText: '"Proteção premium por preço premium."',
  },
  {
    id: 'icloud',
    name: 'iCloud',
    icon: '☁️',
    rarity: 'rare',
    description: '+1 slot de app, -10% velocidade',
    effects: { appSlots: 1, playerSpeed: 0.9 },
    flavorText: '"Seus 5GB acabaram."',
  },
  {
    id: 'shortcuts',
    name: 'Atalhos',
    icon: '⚡',
    rarity: 'rare',
    description: 'Cooldowns -15%',
    effects: { cooldownMultiplier: 0.85 },
    flavorText: '"Automatize sua vida digital."',
  },
  {
    id: 'health_app',
    name: 'App Saúde',
    icon: '❤️',
    rarity: 'epic',
    description: '+25% vida máxima, +regen',
    effects: { maxHealthMultiplier: 1.25, healthRegen: 1.0 },
    flavorText: '"10.000 passos para a vitória."',
  },
];

// Apps Windows
export const WINDOWS_APPS = [
  {
    id: 'antivirus_pesado',
    name: 'Antivírus Pesado',
    icon: '🛡️',
    rarity: 'uncommon',
    description: '+30% defesa, -20% ataque',
    effects: { defenseMultiplier: 1.3, attackSpeed: 0.8 },
    flavorText: '"Escaneando... há 3 horas."',
  },
  {
    id: 'directx_boost',
    name: 'DirectX Boost',
    icon: '🎮',
    rarity: 'rare',
    description: '+30% dano crítico',
    effects: { critDamage: 1.3 },
    flavorText: '"Otimização gráfica para destruição."',
  },
  {
    id: 'windows_update',
    name: 'Windows Update',
    icon: '🔄',
    rarity: 'epic',
    description: '+20% stats, fica parado 2s',
    effects: { allStatsBonus: 1.2, updateStun: 2000 },
    flavorText: '"Não desligue o computador..."',
  },
  {
    id: 'game_bar',
    name: 'Xbox Game Bar',
    icon: '🎯',
    rarity: 'uncommon',
    description: '+10% XP e dano',
    effects: { xpMultiplier: 1.1, damageMultiplier: 1.1 },
    flavorText: '"Win + G para gravar sua derrota."',
  },
];

// Apps Linux
export const LINUX_APPS = [
  {
    id: 'synaptic',
    name: 'Synaptic',
    icon: '📦',
    rarity: 'uncommon',
    description: '+2 apps oferecidos por wave',
    effects: { appChoices: 2 },
    flavorText: '"sudo apt-get install vitoria"',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '💻',
    rarity: 'rare',
    description: 'Buff aleatório poderoso',
    effects: { randomBuff: true, randomBuffStrength: 1.3 },
    flavorText: '"$ ./survive.sh"',
  },
  {
    id: 'htop',
    name: 'htop',
    icon: '📊',
    rarity: 'common',
    description: 'Mostra stats dos inimigos, +5% dano',
    effects: { enemyInfo: true, damageMultiplier: 1.05 },
    flavorText: '"PID 666: Malware (100% CPU)"',
  },
  {
    id: 'vim',
    name: 'Vim',
    icon: '📝',
    rarity: 'legendary',
    description: '+50% dano, controles difíceis',
    effects: { damageMultiplier: 1.5, controlDifficulty: 1.3 },
    flavorText: '":wq para sobreviver"',
  },
];

// Apps Servidor
export const SERVER_APPS = [
  {
    id: 'docker',
    name: 'Docker',
    icon: '🐳',
    rarity: 'epic',
    description: 'Cria 2 clones temporários',
    effects: { cloneCount: 2, cloneDuration: 10000, cloneDamage: 0.5 },
    flavorText: '"Containerização de você mesmo."',
  },
  {
    id: 'firewall',
    name: 'Firewall Empresarial',
    icon: '🔥',
    rarity: 'rare',
    description: '+50% defesa',
    effects: { defenseMultiplier: 1.5 },
    flavorText: '"DENY ALL (exceto problemas)"',
  },
  {
    id: 'monitoring',
    name: 'Monitoramento 24/7',
    icon: '👁️',
    rarity: 'uncommon',
    description: 'Inimigos -20% velocidade',
    effects: { enemySpeed: 0.8 },
    flavorText: '"Grafana shows: você está ferrado."',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: '☸️',
    rarity: 'legendary',
    description: 'Auto-scaling baseado em inimigos',
    effects: { autoScaling: true, scalingFactor: 0.02 },
    flavorText: '"Orquestrando sua sobrevivência."',
  },
  {
    id: 'ssh',
    name: 'SSH Tunnel',
    icon: '🔐',
    rarity: 'uncommon',
    description: 'Teleporte curto a cada 10s',
    effects: { teleportCooldown: 10000, teleportRange: 100 },
    flavorText: '"ssh -L 8080:escape:22"',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    icon: '🌐',
    rarity: 'rare',
    description: 'Projéteis atravessam inimigos',
    effects: { piercing: true, piercingDamageFalloff: 0.8 },
    flavorText: '"Reverse proxy de destruição."',
  },
];

// Apps Console
export const CONSOLE_APPS = [
  {
    id: 'save_state',
    name: 'Save State',
    icon: '💾',
    rarity: 'epic',
    description: 'Volta 5s ao morrer',
    effects: { saveState: true, saveStateWindow: 5000 },
    flavorText: '"Load save slot 1?"',
  },
  {
    id: 'cheat_code',
    name: 'Cheat Code',
    icon: '🎮',
    rarity: 'legendary',
    description: 'Invencível 5s ao iniciar wave',
    effects: { waveStartInvincibility: 5000 },
    flavorText: '"↑↑↓↓←→←→BA START"',
  },
  {
    id: 'turbo_button',
    name: 'Botão Turbo',
    icon: '🔘',
    rarity: 'uncommon',
    description: '+30% velocidade de ataque',
    effects: { attackSpeed: 1.3 },
    flavorText: '"TURBO ativado!"',
  },
  {
    id: 'second_controller',
    name: 'Segundo Controle',
    icon: '🎮',
    rarity: 'rare',
    description: 'Ajudante automático',
    effects: { autoHelper: true, helperDamage: 0.3 },
    flavorText: '"Player 2 has joined!"',
  },
];

// Banco completo por categoria
export const APPS_DATABASE = {
  universal: UNIVERSAL_APPS,
  android: ANDROID_APPS,
  ios: IOS_APPS,
  windows: WINDOWS_APPS,
  linux: LINUX_APPS,
  server: SERVER_APPS,
  console: CONSOLE_APPS,
};

// Mapeamento de categoria do SO para apps
export const OS_APP_MAPPING = {
  // Consoles
  nintendo: ['universal', 'console'],
  xbox: ['universal', 'console'],
  playstation: ['universal', 'console'],
  // Mobile
  android: ['universal', 'android'],
  ios: ['universal', 'ios'],
  // Desktop
  windows: ['universal', 'windows'],
  linux: ['universal', 'linux'],
  macos: ['universal', 'ios'],
  // Server
  ubuntu_server: ['universal', 'server', 'linux'],
  windows_server: ['universal', 'server', 'windows'],
  debian: ['universal', 'server', 'linux'],
  redhat: ['universal', 'server', 'linux'],
};

// Configuração de raridade
export const RARITY_CONFIG = {
  common: { chance: 0.45, color: '#9ca3af', name: 'Comum' },
  uncommon: { chance: 0.3, color: '#22c55e', name: 'Incomum' },
  rare: { chance: 0.15, color: '#3b82f6', name: 'Raro' },
  epic: { chance: 0.08, color: '#a855f7', name: 'Épico' },
  legendary: { chance: 0.02, color: '#f59e0b', name: 'Lendário' },
};

// Helper: pega apps disponíveis para um SO
export const getAvailableApps = (osId) => {
  const categories = OS_APP_MAPPING[osId] || ['universal'];
  let apps = [];

  categories.forEach((cat) => {
    if (APPS_DATABASE[cat]) {
      apps = [...apps, ...APPS_DATABASE[cat]];
    }
  });

  return apps;
};

// Helper: seleciona apps aleatórios
export const selectRandomApps = (availableApps, count = 3, waveNumber = 1) => {
  const waveBonus = Math.min(waveNumber * 0.02, 0.2);

  const weightedApps = availableApps.map((app) => {
    let weight = RARITY_CONFIG[app.rarity]?.chance || 0.1;
    if (['rare', 'epic', 'legendary'].includes(app.rarity)) {
      weight += waveBonus;
    }
    return { app, weight };
  });

  const selected = [];
  const remaining = [...weightedApps];

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (let j = 0; j < remaining.length; j++) {
      random -= remaining[j].weight;
      if (random <= 0) {
        selected.push(remaining[j].app);
        remaining.splice(j, 1);
        break;
      }
    }
  }

  return selected;
};
