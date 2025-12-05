/**
 * Sistema de Armas baseadas em Ferramentas de Segurança Digital
 * Cada arma tem mecânicas únicas e sinergias com diferentes Sistemas Operacionais
 */

// Tiers de evolução das armas
export const WEAPON_TIERS = {
  BASIC: { id: 1, name: 'Básico', color: '#9ca3af', multiplier: 1.0 },
  ADVANCED: { id: 2, name: 'Avançado', color: '#22c55e', multiplier: 1.5 },
  EXPERT: { id: 3, name: 'Expert', color: '#3b82f6', multiplier: 2.0 },
  ULTIMATE: { id: 4, name: 'Ultimate', color: '#a855f7', multiplier: 3.0 },
};

// Tipos de armas disponíveis
export const WEAPON_TYPES = {
  // Arma inicial padrão
  DIGITAL_SWORD: {
    id: 'digital_sword',
    name: 'Espada Digital',
    icon: '⚔️',
    description: 'Arma padrão. Uma lâmina de código que corta ameaças.',
    category: 'melee',
    baseStats: {
      damage: 25,
      attackSpeed: 1.0,
      range: 60,
      critChance: 0.1,
      critMultiplier: 2.0,
    },
    mechanics: {
      type: 'rotating',
      piercing: false,
      projectileCount: 0,
    },
    special: null,
    flavorText: 'A primeira linha de defesa de todo sysadmin.',
  },

  // 1. Antivírus - Wave Cleaner
  ANTIVIRUS: {
    id: 'antivirus',
    name: 'Antivírus',
    icon: '🛡️',
    description: 'Executa varreduras que atravessam múltiplos inimigos.',
    category: 'scan',
    baseStats: {
      damage: 20,
      attackSpeed: 0.8,
      range: 200,
      critChance: 0.15,
      critMultiplier: 2.5,
    },
    mechanics: {
      type: 'wave',
      piercing: true,
      projectileCount: 1,
      waveWidth: 80,
      waveSpeed: 400,
    },
    special: {
      name: 'Scan Completo',
      description: 'Elimina instantaneamente todos os inimigos fracos na tela',
      cooldown: 30000, // 30 segundos
      effect: 'killWeakEnemies',
      threshold: 0.3, // Mata inimigos com menos de 30% da vida
    },
    upgrades: [
      { id: 'wider_scan', name: 'Varredura Ampla', effect: { waveWidth: '+40%' }, tier: 2 },
      { id: 'faster_scan', name: 'Varredura Rápida', effect: { attackSpeed: '+25%' }, tier: 2 },
      {
        id: 'reduced_cooldown',
        name: 'Cooldown Otimizado',
        effect: { specialCooldown: '-30%' },
        tier: 3,
      },
      {
        id: 'vulnerability_detect',
        name: 'Detecção de Vulnerabilidade',
        effect: { critChance: '+20%' },
        tier: 3,
      },
      {
        id: 'deep_scan',
        name: 'Scan Profundo',
        effect: { pierceCount: '+2', damage: '+15%' },
        tier: 4,
      },
    ],
    synergies: {
      windows: { damage: 1.3, effect: 'Chance de travar inimigo por 0.5s' },
      linux: { attackSpeed: 1.25, effect: 'Varredura 25% mais rápida' },
      macos: { stability: 1.0, effect: 'Varredura extremamente estável' },
      ios: { stability: 1.0, effect: 'Varredura otimizada' },
      android: { chaos: 0.1, effect: 'Varredura pode ter tamanho aleatório' },
      server: { range: 1.5, effect: 'Alcance massivo' },
    },
    flavorText: 'Detectar. Isolar. Eliminar.',
  },

  // 2. Firewall - Barreira Defensiva
  FIREWALL: {
    id: 'firewall',
    name: 'Firewall',
    icon: '🔥',
    description: 'Cria barreiras de fogo que bloqueiam e queimam inimigos.',
    category: 'defensive',
    baseStats: {
      damage: 15, // Dano por segundo
      attackSpeed: 0.5,
      range: 100,
      critChance: 0.05,
      critMultiplier: 1.5,
    },
    mechanics: {
      type: 'barrier',
      piercing: false,
      projectileCount: 0,
      barrierDuration: 5000, // 5 segundos
      barrierWidth: 120,
      barrierHeight: 20,
      damagePerSecond: true,
    },
    special: {
      name: 'Onda de Calor',
      description: 'Cria uma explosão de fogo que repele todos os inimigos',
      cooldown: 20000,
      effect: 'knockbackAll',
      radius: 150,
    },
    upgrades: [
      {
        id: 'longer_barrier',
        name: 'Barreira Persistente',
        effect: { barrierDuration: '+50%' },
        tier: 2,
      },
      { id: 'hotter_flame', name: 'Chamas Intensas', effect: { damage: '+40%' }, tier: 2 },
      { id: 'larger_barrier', name: 'Barreira Gigante', effect: { barrierWidth: '+60%' }, tier: 3 },
      { id: 'reflect', name: 'Reflexão', effect: { reflectProjectiles: true }, tier: 3 },
      {
        id: 'inferno_wall',
        name: 'Muralha Infernal',
        effect: { doubleBarrier: true, damage: '+25%' },
        tier: 4,
      },
    ],
    synergies: {
      windows: { barrierWidth: 1.2, effect: 'Barreiras maiores' },
      linux: { damage: 1.2, effect: 'Dano consistente' },
      macos: { visual: 'enhanced', effect: 'Barreira estética (menor área, mais brilho)' },
      android: { stability: 0.8, effect: 'Barreira instável (pode falhar)' },
      server: { barrierWidth: 1.5, cost: 1.3, effect: 'Barreiras gigantes mas custosas' },
      debian: { barrierDuration: 1.4, effect: 'Barreiras duram mais' },
      rhel: { damage: 1.35, effect: 'Dano enterprise' },
    },
    flavorText: 'Nenhuma conexão não autorizada passará.',
  },

  // 3. Antimalware - Dano Contínuo / Purificação
  ANTIMALWARE: {
    id: 'antimalware',
    name: 'Antimalware',
    icon: '☢️',
    description: 'Aplica corrupção que explode após alguns segundos.',
    category: 'dot',
    baseStats: {
      damage: 10, // Dano inicial
      attackSpeed: 1.2,
      range: 80,
      critChance: 0.2,
      critMultiplier: 3.0, // Crítico aumenta explosão
    },
    mechanics: {
      type: 'debuff',
      piercing: false,
      projectileCount: 0,
      debuffDuration: 3000, // 3 segundos até explodir
      explosionDamage: 50,
      explosionRadius: 40,
    },
    special: {
      name: 'Purificação Total',
      description: 'Todos os debuffs ativos explodem instantaneamente com dano dobrado',
      cooldown: 25000,
      effect: 'detonateAll',
      damageMultiplier: 2.0,
    },
    upgrades: [
      {
        id: 'bigger_explosion',
        name: 'Explosão Ampla',
        effect: { explosionRadius: '+50%' },
        tier: 2,
      },
      {
        id: 'faster_corruption',
        name: 'Corrupção Acelerada',
        effect: { debuffDuration: '-30%' },
        tier: 2,
      },
      { id: 'chain_reaction', name: 'Reação em Cadeia', effect: { spreadToNearby: true }, tier: 3 },
      {
        id: 'critical_explosion',
        name: 'Explosão Crítica',
        effect: { critMultiplier: '+100%' },
        tier: 3,
      },
      {
        id: 'pandemic',
        name: 'Pandemia Digital',
        effect: { spreadChance: 0.5, stacks: true },
        tier: 4,
      },
    ],
    synergies: {
      windows: { explosionDamage: 1.2, effect: 'Explosões maiores' },
      linux: { debuffDuration: 0.8, effect: 'Corrupção mais rápida' },
      macos: { explosionDamage: 1.4, effect: 'Dano explosivo elevado' },
      android: { spreadChance: 0.3, effect: 'Propagação caótica' },
      ios: { critChance: 1.2, effect: 'Críticos mais frequentes' },
      server: { stacks: 3, effect: 'Múltiplos debuffs no mesmo alvo' },
    },
    flavorText: 'A purificação é inevitável.',
  },

  // 4. IDS/IPS - Arma Reativa
  IDS: {
    id: 'ids',
    name: 'IDS/IPS',
    icon: '👁️',
    description: 'Sistema de detecção que ativa contra-ataques automáticos.',
    category: 'reactive',
    baseStats: {
      damage: 35,
      attackSpeed: 0,
      range: 50,
      critChance: 0.25,
      critMultiplier: 2.0,
    },
    mechanics: {
      type: 'reactive',
      piercing: false,
      projectileCount: 0,
      detectionRadius: 80,
      counterAttackDamage: 40,
      dodgeDistance: 100,
      reactionDelay: 200, // ms
    },
    special: {
      name: 'Modo Alerta Máximo',
      description: 'Por 10 segundos, todos os ataques são detectados e contra-atacados',
      cooldown: 35000,
      effect: 'perfectDetection',
      duration: 10000,
    },
    upgrades: [
      {
        id: 'faster_detection',
        name: 'Detecção Rápida',
        effect: { reactionDelay: '-40%' },
        tier: 2,
      },
      {
        id: 'stun_counter',
        name: 'Contra-Ataque Atordoante',
        effect: { stunOnCounter: true },
        tier: 2,
      },
      {
        id: 'larger_detection',
        name: 'Área de Detecção',
        effect: { detectionRadius: '+50%' },
        tier: 3,
      },
      { id: 'double_counter', name: 'Contra-Ataque Duplo', effect: { counterHits: 2 }, tier: 3 },
      {
        id: 'instant_response',
        name: 'Resposta Instantânea',
        effect: { reactionDelay: 0, damage: '+30%' },
        tier: 4,
      },
    ],
    synergies: {
      windows: { failChance: 0.15, effect: 'Às vezes não ativa (15%)' },
      linux: { reactionDelay: 0.5, effect: 'Detecção extremamente precisa' },
      macos: { stability: 1.0, effect: 'Sempre funciona perfeitamente' },
      android: { chaos: 0.2, effect: 'Pode ativar sem necessidade' },
      server: {
        reactionDelay: 0,
        cooldownMultiplier: 1.3,
        effect: 'Instantâneo mas cooldown maior',
      },
      ubuntu: { counterAttackDamage: 1.3, effect: 'Contra-ataques mais fortes' },
    },
    flavorText: 'Cada ação tem uma reação igual e oposta.',
  },

  // 5. VPN - Mobilidade/Furtividade
  VPN: {
    id: 'vpn',
    name: 'VPN',
    icon: '🔒',
    description: 'Permite invisibilidade temporária e teleporte.',
    category: 'stealth',
    baseStats: {
      damage: 15,
      attackSpeed: 0.6,
      range: 0,
      critChance: 0.3,
      critMultiplier: 2.5,
    },
    mechanics: {
      type: 'stealth',
      piercing: false,
      projectileCount: 0,
      invisibilityDuration: 3000,
      teleportDistance: 150,
      healWhileInvisible: 2, // HP por segundo
      cloneCount: 0,
    },
    special: {
      name: 'Túnel Seguro',
      description: 'Teleporta para qualquer lugar do mapa e fica invisível por 5 segundos',
      cooldown: 30000,
      effect: 'safeTeleport',
      duration: 5000,
    },
    upgrades: [
      {
        id: 'longer_stealth',
        name: 'Criptografia Estendida',
        effect: { invisibilityDuration: '+60%' },
        tier: 2,
      },
      {
        id: 'further_teleport',
        name: 'Túnel Longo',
        effect: { teleportDistance: '+50%' },
        tier: 2,
      },
      {
        id: 'damaging_clones',
        name: 'Clones Ofensivos',
        effect: { cloneCount: 2, cloneDamage: true },
        tier: 3,
      },
      { id: 'phase_through', name: 'Passagem Etérea', effect: { phaseThrough: true }, tier: 3 },
      {
        id: 'quantum_tunnel',
        name: 'Túnel Quântico',
        effect: { instantTeleport: true, cloneCount: 4 },
        tier: 4,
      },
    ],
    synergies: {
      windows: { teleportDistance: 1.1, effect: 'Teleporte levemente maior' },
      linux: { precision: 1.0, effect: 'Teleporte milimétrico' },
      macos: { invisibilityDuration: 1.2, effect: 'Invisibilidade estável' },
      android: { chaos: 0.2, effect: 'Teleporte pode falhar (20%)' },
      ios: { stability: 1.0, effect: 'Invisibilidade perfeitamente estável' },
      server: { teleportDistance: 2.0, effect: 'Teleporte gigantesco' },
    },
    flavorText: 'Você não pode atacar o que não pode ver.',
  },

  // 6. Anti-Spam - Alta Taxa de Fogo
  ANTISPAM: {
    id: 'antispam',
    name: 'Anti-Spam',
    icon: '📧',
    description: 'Dispara projéteis rápidos e fracos em grande quantidade.',
    category: 'projectile',
    baseStats: {
      damage: 5,
      attackSpeed: 5.0, // Muito rápido
      range: 180,
      critChance: 0.05,
      critMultiplier: 1.5,
    },
    mechanics: {
      type: 'projectile',
      piercing: false,
      projectileCount: 3,
      projectileSpeed: 500,
      spread: 15, // graus
      autoFire: true,
    },
    special: {
      name: 'Filtro Agressivo',
      description: 'Dispara uma rajada massiva de 50 projéteis em todas as direções',
      cooldown: 15000,
      effect: 'massiveBurst',
      projectileCount: 50,
    },
    upgrades: [
      {
        id: 'more_projectiles',
        name: 'Mais Projéteis',
        effect: { projectileCount: '+2' },
        tier: 2,
      },
      { id: 'faster_fire', name: 'Taxa de Fogo+', effect: { attackSpeed: '+30%' }, tier: 2 },
      { id: 'volume_crit', name: 'Crítico em Volume', effect: { critChance: '+15%' }, tier: 3 },
      { id: 'homing', name: 'Projéteis Guiados', effect: { homing: true }, tier: 3 },
      {
        id: 'spam_storm',
        name: 'Tempestade de Spam',
        effect: { projectileCount: '+5', piercing: true },
        tier: 4,
      },
    ],
    synergies: {
      windows: { projectileSpeed: 1.3, effect: 'Projéteis mais rápidos' },
      linux: { accuracy: 1.2, effect: 'Maior precisão' },
      macos: { damage: 1.2, effect: 'Projéteis mais fortes' },
      android: { chaos: 0.3, effect: 'Variação aleatória de dano' },
      ios: { consistency: 1.0, effect: 'Dano consistente' },
      server: { projectileCount: 2.0, effect: 'Dobro de projéteis' },
    },
    flavorText: 'Quantidade tem qualidade própria.',
  },
};

// Armas híbridas (evoluções especiais)
export const HYBRID_WEAPONS = {
  CORRUPTED_FIREWALL: {
    id: 'corrupted_firewall',
    name: 'Firewall Corrompido',
    icon: '🔥☢️',
    description: 'Fusão de Firewall + Antimalware. Barreiras que aplicam corrupção.',
    baseWeapons: ['firewall', 'antimalware'],
    bonusStats: { damage: 1.3, explosionRadius: 1.2 },
    specialEffect: 'Barreiras aplicam debuff de corrupção',
  },
  SCANNING_FIREWALL: {
    id: 'scanning_firewall',
    name: 'Firewall Scanner',
    icon: '🔥🛡️',
    description: 'Fusão de Firewall + Antivírus. Barreiras que disparam varreduras.',
    baseWeapons: ['firewall', 'antivirus'],
    bonusStats: { range: 1.4, waveWidth: 1.2 },
    specialEffect: 'Barreiras disparam ondas de varredura',
  },
  REACTIVE_VPN: {
    id: 'reactive_vpn',
    name: 'VPN Reativa',
    icon: '🔒👁️',
    description: 'Fusão de VPN + IDS. Teleporte automático quando detecta ameaça.',
    baseWeapons: ['vpn', 'ids'],
    bonusStats: { teleportDistance: 1.3, counterAttackDamage: 1.2 },
    specialEffect: 'Teleporta automaticamente ao detectar ataque',
  },
  SPAM_SCANNER: {
    id: 'spam_scanner',
    name: 'Scanner de Spam',
    icon: '📧🛡️',
    description: 'Fusão de Anti-Spam + Antivírus. Projéteis que atravessam inimigos.',
    baseWeapons: ['antispam', 'antivirus'],
    bonusStats: { projectileCount: 1.5, piercing: true },
    specialEffect: 'Todos os projéteis atravessam inimigos',
  },
  MALWARE_SPAM: {
    id: 'malware_spam',
    name: 'Spam Corrompido',
    icon: '📧☢️',
    description: 'Fusão de Anti-Spam + Antimalware. Projéteis aplicam corrupção.',
    baseWeapons: ['antispam', 'antimalware'],
    bonusStats: { attackSpeed: 1.2, explosionDamage: 0.5 },
    specialEffect: 'Cada projétil aplica mini-corrupção',
  },
};

// Upgrades universais (aplicáveis a qualquer arma)
export const UNIVERSAL_UPGRADES = {
  DAMAGE_BOOST: {
    id: 'damage_boost',
    name: 'Boost de Dano',
    icon: '⚡',
    description: '+15% de dano base',
    effect: { damage: 1.15 },
    rarity: 'common',
    maxStacks: 5,
  },
  ATTACK_SPEED: {
    id: 'attack_speed',
    name: 'Overclock',
    icon: '⏱️',
    description: '+10% de velocidade de ataque',
    effect: { attackSpeed: 1.1 },
    rarity: 'common',
    maxStacks: 5,
  },
  CRIT_CHANCE: {
    id: 'crit_chance',
    name: 'Análise de Vulnerabilidade',
    icon: '🎯',
    description: '+5% de chance de crítico',
    effect: { critChance: 0.05 },
    rarity: 'uncommon',
    maxStacks: 10,
  },
  CRIT_DAMAGE: {
    id: 'crit_damage',
    name: 'Exploit Crítico',
    icon: '💥',
    description: '+25% de dano crítico',
    effect: { critMultiplier: 0.25 },
    rarity: 'uncommon',
    maxStacks: 5,
  },
  RANGE_BOOST: {
    id: 'range_boost',
    name: 'Alcance Extendido',
    icon: '📡',
    description: '+20% de alcance',
    effect: { range: 1.2 },
    rarity: 'common',
    maxStacks: 3,
  },
  COOLDOWN_REDUCTION: {
    id: 'cooldown_reduction',
    name: 'Otimização de Cache',
    icon: '🔄',
    description: '-10% de cooldown da habilidade especial',
    effect: { specialCooldown: 0.9 },
    rarity: 'rare',
    maxStacks: 5,
  },
  LIFESTEAL: {
    id: 'lifesteal',
    name: 'Absorção de Dados',
    icon: '💚',
    description: 'Recupera 3% do dano causado como vida',
    effect: { lifesteal: 0.03 },
    rarity: 'rare',
    maxStacks: 5,
  },
  PIERCE: {
    id: 'pierce',
    name: 'Penetração',
    icon: '🗡️',
    description: 'Ataques atravessam +1 inimigo',
    effect: { pierceCount: 1 },
    rarity: 'epic',
    maxStacks: 3,
  },
};

// Função para calcular stats finais de uma arma com upgrades e sinergias
export function calculateWeaponStats(weapon, tier, upgrades = [], osId = null, installedApps = []) {
  const baseStats = { ...weapon.baseStats };
  const tierMultiplier = WEAPON_TIERS[tier]?.multiplier || 1.0;

  // Aplicar multiplicador de tier
  Object.keys(baseStats).forEach((stat) => {
    if (typeof baseStats[stat] === 'number') {
      baseStats[stat] *= tierMultiplier;
    }
  });

  // Aplicar upgrades
  upgrades.forEach((upgrade) => {
    if (upgrade.effect) {
      Object.entries(upgrade.effect).forEach(([key, value]) => {
        if (typeof value === 'number') {
          if (value > 1 || value < 0) {
            // Multiplicador
            baseStats[key] = (baseStats[key] || 1) * value;
          } else if (key.includes('Chance')) {
            // Adição para chances
            baseStats[key] = (baseStats[key] || 0) + value;
          }
        } else if (typeof value === 'boolean') {
          baseStats[key] = value;
        } else if (typeof value === 'string' && value.startsWith('+')) {
          const numValue = parseFloat(value.replace('%', '')) / 100;
          baseStats[key] = (baseStats[key] || 0) * (1 + numValue);
        } else if (typeof value === 'string' && value.startsWith('-')) {
          const numValue = parseFloat(value.replace('%', '')) / 100;
          baseStats[key] = (baseStats[key] || 0) * (1 - Math.abs(numValue));
        }
      });
    }
  });

  // Aplicar sinergias do SO
  if (osId && weapon.synergies) {
    const osSynergy = weapon.synergies[osId.toLowerCase()];
    if (osSynergy) {
      Object.entries(osSynergy).forEach(([key, value]) => {
        if (typeof value === 'number' && key !== 'chaos' && key !== 'failChance') {
          baseStats[key] = (baseStats[key] || 1) * value;
        }
      });
      baseStats.synergyEffect = osSynergy.effect;
    }
  }

  // Aplicar bônus de apps instalados
  installedApps.forEach((app) => {
    if (app.effects) {
      Object.entries(app.effects).forEach(([key, value]) => {
        if (key.includes('damage') || key.includes('Damage')) {
          baseStats.damage = (baseStats.damage || 0) * (1 + value);
        }
        if (key.includes('attackSpeed') || key.includes('AttackSpeed')) {
          baseStats.attackSpeed = (baseStats.attackSpeed || 0) * (1 + value);
        }
        if (key.includes('crit')) {
          baseStats.critChance = (baseStats.critChance || 0) + value;
        }
      });
    }
  });

  return baseStats;
}

// Função para verificar se pode criar arma híbrida
export function canCreateHybrid(weapon1Id, weapon2Id) {
  return Object.values(HYBRID_WEAPONS).find(
    (hybrid) => hybrid.baseWeapons.includes(weapon1Id) && hybrid.baseWeapons.includes(weapon2Id)
  );
}

// Função para obter armas disponíveis para seleção entre waves
export function getAvailableWeapons(currentWeapon, waveNumber, luck = 1.0) {
  const allWeapons = Object.values(WEAPON_TYPES);
  const available = [];

  // Sempre pode melhorar a arma atual (upgrade de tier)
  if (currentWeapon) {
    available.push({
      type: 'upgrade',
      weapon: currentWeapon,
      description: 'Evoluir arma atual',
    });
  }

  // Chance de nova arma aumenta com waves
  const newWeaponChance = Math.min(0.3 + waveNumber * 0.05, 0.8);

  if (Math.random() * luck < newWeaponChance) {
    // Seleciona 2-3 armas aleatórias
    const shuffled = allWeapons
      .filter((w) => w.id !== currentWeapon?.id)
      .sort(() => Math.random() - 0.5);

    const count = Math.min(2 + Math.floor(waveNumber / 3), 3);
    shuffled.slice(0, count).forEach((weapon) => {
      available.push({
        type: 'new',
        weapon,
        description: 'Nova arma',
      });
    });
  }

  // Chance de arma híbrida em waves avançadas
  if (waveNumber >= 4 && currentWeapon) {
    Object.values(HYBRID_WEAPONS).forEach((hybrid) => {
      if (hybrid.baseWeapons.includes(currentWeapon.id)) {
        if (Math.random() * luck < 0.15) {
          available.push({
            type: 'hybrid',
            weapon: hybrid,
            description: 'Fusão de armas',
          });
        }
      }
    });
  }

  return available;
}

// Função para obter upgrades disponíveis para uma arma
export function getAvailableUpgrades(weapon, currentTier, waveNumber, luck = 1.0) {
  const upgrades = [];

  // Upgrades universais
  Object.values(UNIVERSAL_UPGRADES).forEach((upgrade) => {
    const rarityChance = {
      common: 0.6,
      uncommon: 0.35,
      rare: 0.15,
      epic: 0.05,
    };

    if (Math.random() * luck < (rarityChance[upgrade.rarity] || 0.3)) {
      upgrades.push({ ...upgrade, source: 'universal' });
    }
  });

  // Upgrades específicos da arma
  if (weapon.upgrades) {
    weapon.upgrades.forEach((upgrade) => {
      if (upgrade.tier <= currentTier + 1) {
        if (Math.random() * luck < 0.4) {
          upgrades.push({ ...upgrade, source: 'weapon' });
        }
      }
    });
  }

  // Limita a 3-4 opções
  return upgrades
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(3 + Math.floor(waveNumber / 2), 4));
}

// Modificações de crítico por tipo de arma
export const WEAPON_CRIT_EFFECTS = {
  antivirus: {
    name: 'Scan Mortal',
    effect: 'Crítico aumenta chance de eliminar instantaneamente',
    multiplier: 1.5,
  },
  firewall: {
    name: 'Onda de Calor Crítica',
    effect: 'Crítico cria onda de knockback',
    multiplier: 1.3,
  },
  antimalware: {
    name: 'Explosão Catastrófica',
    effect: 'Crítico aumenta explosão em 200%',
    multiplier: 3.0,
  },
  ids: {
    name: 'Contra-Ataque Extra',
    effect: 'Crítico ativa contra-ataque adicional',
    multiplier: 2.0,
  },
  vpn: {
    name: 'Duplicação Quântica',
    effect: 'Crítico duplica clones',
    multiplier: 1.5,
  },
  antispam: {
    name: 'Rajada Tripla',
    effect: 'Crítico dispara rajada tripla',
    multiplier: 1.2,
  },
};

// Modificações de crítico por SO
export const OS_CRIT_MODIFIERS = {
  ios: { stability: 1.0, description: 'Crítico extremamente estável' },
  windows: { damage: 1.3, variance: 0.3, description: 'Crítico forte mas instável' },
  linux: { consistency: 1.0, bonus: 0.05, description: 'Crítico constante (+5% chance)' },
  macos: { damage: 1.2, stability: 1.0, description: 'Crítico elegante e preciso' },
  android: {
    chaos: 0.4,
    damage: 1.4,
    description: 'Crítico caótico (pode ser muito forte ou fraco)',
  },
  server: { scaling: true, description: 'Crítico escala com número de inimigos' },
  ubuntu: { consistency: 1.0, bonus: 0.03, description: 'Crítico confiável' },
  debian: { stability: 1.0, description: 'Crítico estável' },
  rhel: { damage: 1.25, description: 'Crítico enterprise' },
  playstation: { damage: 1.15, description: 'Crítico otimizado' },
  xbox: { variance: 0.2, damage: 1.2, description: 'Crítico variável' },
  nintendo: { fun: true, description: 'Crítico divertido (efeitos visuais extras)' },
};
