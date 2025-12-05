import React, { useState } from 'react';
import { WEAPON_TYPES, WEAPON_TIERS, HYBRID_WEAPONS } from '../constants/weapons';

/**
 * Componente de seleção de armas entre waves
 * Permite trocar arma, evoluir tier ou aplicar upgrades
 */
export const WeaponSelect = ({
  currentWeapon,
  currentTier,
  weaponOptions,
  upgradeOptions,
  selectedOS,
  waveNumber,
  onSelectWeapon,
  onSelectUpgrade,
  onSkip,
  isLevelUp = false,
  pendingLevelUps = 0,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [viewMode, setViewMode] = useState(isLevelUp ? 'upgrades' : 'weapons'); // 'weapons' ou 'upgrades'

  // Obter cor do tier
  const tierInfo = WEAPON_TIERS[currentTier] || WEAPON_TIERS.BASIC;

  // Verificar sinergia com SO atual
  const getSynergyInfo = (weapon) => {
    if (!selectedOS || !weapon.synergies) return null;
    const synergy = weapon.synergies[selectedOS.id?.toLowerCase()];
    return synergy;
  };

  // Determinar se a opção é recomendada
  const isRecommended = (option) => {
    if (!selectedOS) return false;
    const synergy = getSynergyInfo(option.weapon || option);
    if (!synergy) return false;
    // Recomendado se tem bônus e não tem penalidade significativa
    const hasBonus = Object.values(synergy).some((v) => typeof v === 'number' && v > 1);
    const hasPenalty = synergy.failChance > 0.1 || synergy.chaos > 0.2;
    return hasBonus && !hasPenalty;
  };

  const handleConfirm = () => {
    if (!selectedOption) return;

    if (viewMode === 'weapons') {
      onSelectWeapon(selectedOption);
    } else {
      onSelectUpgrade(selectedOption);
    }
  };

  return (
    <div className="weapon-select-overlay">
      <div className="weapon-select-container">
        <div className="weapon-select-header">
          <div className="wave-complete-badge">
            <span className="wave-icon">{isLevelUp ? '⬆️' : '🎉'}</span>
            <h1>
              {isLevelUp
                ? `Level Up! (${pendingLevelUps} restantes)`
                : `Wave ${waveNumber} Completa!`}
            </h1>
          </div>

          <div className="current-weapon-display">
            <span className="current-weapon-icon">{currentWeapon.icon}</span>
            <div className="current-weapon-info">
              <h3>{currentWeapon.name}</h3>
              <span className="tier-badge" style={{ backgroundColor: tierInfo.color }}>
                {tierInfo.name}
              </span>
            </div>
          </div>

          <p className="weapon-select-subtitle">Escolha uma melhoria para continuar</p>
        </div>

        {/* Tabs - Esconde a tab de armas no level up */}
        {!isLevelUp && (
          <div className="weapon-tabs">
            <button
              className={`weapon-tab ${viewMode === 'weapons' ? 'active' : ''}`}
              onClick={() => setViewMode('weapons')}
            >
              ⚔️ Armas ({weaponOptions?.length || 0})
            </button>
            <button
              className={`weapon-tab ${viewMode === 'upgrades' ? 'active' : ''}`}
              onClick={() => setViewMode('upgrades')}
            >
              ⬆️ Upgrades ({upgradeOptions?.length || 0})
            </button>
          </div>
        )}

        {/* Conteúdo baseado na tab */}
        {viewMode === 'weapons' && (
          <div className="weapon-options-grid">
            {weaponOptions?.map((option, index) => {
              const weapon = option.weapon;
              const synergy = getSynergyInfo(weapon);
              const recommended = isRecommended(option);

              return (
                <div
                  key={weapon.id || index}
                  className={`weapon-option-card ${selectedOption === option ? 'selected' : ''} ${
                    option.type === 'upgrade' ? 'upgrade-tier' : ''
                  } ${option.type === 'hybrid' ? 'hybrid' : ''} ${recommended ? 'recommended' : ''}`}
                  onClick={() => setSelectedOption(option)}
                >
                  {recommended && <div className="recommended-badge">✨ Recomendado</div>}

                  {option.type === 'hybrid' && <div className="hybrid-badge">🔀 Fusão</div>}

                  <div className="weapon-option-header">
                    <span className="weapon-option-icon">{weapon.icon}</span>
                    <div>
                      <h3 className="weapon-option-name">{weapon.name}</h3>
                      <span className="weapon-option-type">
                        {option.type === 'upgrade'
                          ? '📈 Evolução'
                          : option.type === 'hybrid'
                            ? '🔀 Híbrida'
                            : '🆕 Nova'}
                      </span>
                    </div>
                  </div>

                  <p className="weapon-option-desc">{weapon.description}</p>

                  {/* Stats da arma */}
                  {weapon.baseStats && (
                    <div className="weapon-stats">
                      <div className="weapon-stat">
                        <span className="stat-icon">⚔️</span>
                        <span className="stat-value">{weapon.baseStats.damage}</span>
                        <span className="stat-label">Dano</span>
                      </div>
                      <div className="weapon-stat">
                        <span className="stat-icon">⚡</span>
                        <span className="stat-value">{weapon.baseStats.attackSpeed}x</span>
                        <span className="stat-label">Velocidade</span>
                      </div>
                      <div className="weapon-stat">
                        <span className="stat-icon">🎯</span>
                        <span className="stat-value">
                          {Math.round(weapon.baseStats.critChance * 100)}%
                        </span>
                        <span className="stat-label">Crítico</span>
                      </div>
                    </div>
                  )}

                  {/* Habilidade especial */}
                  {weapon.special && (
                    <div className="weapon-special">
                      <h4>⭐ {weapon.special.name}</h4>
                      <p>{weapon.special.description}</p>
                    </div>
                  )}

                  {/* Sinergia com SO */}
                  {synergy && (
                    <div
                      className={`weapon-synergy ${synergy.failChance || synergy.chaos ? 'warning' : 'bonus'}`}
                    >
                      <span className="synergy-icon">{selectedOS?.icon}</span>
                      <span className="synergy-text">{synergy.effect}</span>
                    </div>
                  )}

                  {/* Flavor text */}
                  <p className="weapon-flavor">{weapon.flavorText}</p>
                </div>
              );
            })}

            {(!weaponOptions || weaponOptions.length === 0) && (
              <div className="no-options">
                <p>Nenhuma arma disponível nesta wave.</p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'upgrades' && (
          <div className="upgrade-options-grid">
            {upgradeOptions?.map((upgrade, index) => (
              <div
                key={upgrade.id || index}
                className={`upgrade-option-card ${selectedOption === upgrade ? 'selected' : ''} rarity-${upgrade.rarity || 'common'}`}
                onClick={() => setSelectedOption(upgrade)}
              >
                <div className="upgrade-option-header">
                  <span className="upgrade-option-icon">{upgrade.icon || '⬆️'}</span>
                  <h3 className="upgrade-option-name">{upgrade.name}</h3>
                </div>

                <p className="upgrade-option-desc">{upgrade.description}</p>

                {/* Efeitos do upgrade */}
                <div className="upgrade-effects">
                  {upgrade.effect &&
                    Object.entries(upgrade.effect).map(([key, value]) => (
                      <div key={key} className="upgrade-effect">
                        <span className="effect-key">{formatEffectKey(key)}</span>
                        <span
                          className={`effect-value ${value > 0 || value > 1 ? 'positive' : 'negative'}`}
                        >
                          {formatEffectValue(key, value)}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Raridade */}
                <div className={`upgrade-rarity rarity-${upgrade.rarity || 'common'}`}>
                  {upgrade.rarity?.toUpperCase() || 'COMUM'}
                </div>

                {/* Stacks */}
                {upgrade.maxStacks > 1 && (
                  <div className="upgrade-stacks">Pode acumular até {upgrade.maxStacks}x</div>
                )}
              </div>
            ))}

            {(!upgradeOptions || upgradeOptions.length === 0) && (
              <div className="no-options">
                <p>Nenhum upgrade disponível nesta wave.</p>
              </div>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="weapon-select-actions">
          <button className="weapon-confirm-btn" onClick={handleConfirm} disabled={!selectedOption}>
            {selectedOption
              ? viewMode === 'weapons'
                ? `Equipar ${selectedOption.weapon?.name || 'Arma'}`
                : `Aplicar ${selectedOption.name || 'Upgrade'}`
              : 'Selecione uma opção'}
          </button>

          <button className="weapon-skip-btn" onClick={onSkip}>
            Pular Melhoria →
          </button>
        </div>
      </div>
    </div>
  );
};

// Funções auxiliares para formatar efeitos
function formatEffectKey(key) {
  const keyMap = {
    damage: 'Dano',
    attackSpeed: 'Velocidade',
    range: 'Alcance',
    critChance: 'Chance Crítico',
    critMultiplier: 'Dano Crítico',
    waveWidth: 'Largura da Onda',
    barrierDuration: 'Duração da Barreira',
    barrierWidth: 'Largura da Barreira',
    explosionRadius: 'Raio de Explosão',
    explosionDamage: 'Dano de Explosão',
    debuffDuration: 'Duração do Debuff',
    projectileCount: 'Projéteis',
    projectileSpeed: 'Velocidade de Projétil',
    specialCooldown: 'Cooldown Especial',
    lifesteal: 'Roubo de Vida',
    pierceCount: 'Perfuração',
    teleportDistance: 'Distância de Teleporte',
    invisibilityDuration: 'Duração de Invisibilidade',
    detectionRadius: 'Raio de Detecção',
    counterAttackDamage: 'Dano de Contra-Ataque',
    reactionDelay: 'Tempo de Reação',
  };
  return keyMap[key] || key;
}

function formatEffectValue(key, value) {
  if (typeof value === 'boolean') {
    return value ? '✓' : '✗';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (key.includes('Chance') || key === 'lifesteal') {
    return `+${Math.round(value * 100)}%`;
  }
  if (value > 1) {
    return `×${value.toFixed(2)}`;
  }
  if (value < 1 && value > 0) {
    return `-${Math.round((1 - value) * 100)}%`;
  }
  if (value < 0) {
    return `${value}`;
  }
  return `+${value}`;
}

export default WeaponSelect;
