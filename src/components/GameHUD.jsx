import React from 'react';

export const GameHUD = ({
  score,
  health,
  datacenterHealth,
  maxHealth,
  maxDatacenterHealth,
  money,
  level,
  xpDisplay,
  gameActive,
  onPause,
  currentWave,
  waveTimer,
  waveNumber,
  selectedOS,
  installedApps = [],
  weaponInfo,
  onUseSpecial,
}) => {
  // Formata o timer em MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcula cooldown restante como porcentagem
  const getSpecialCooldownPercent = () => {
    if (!weaponInfo?.special) return 0;
    const { cooldownRemaining, cooldownTotal } = weaponInfo.special;
    if (cooldownTotal === 0) return 0;
    return Math.round((cooldownRemaining / cooldownTotal) * 100);
  };

  return (
    <div className="game-hud">
      {/* Indicador de Onda - Topo */}
      {gameActive && currentWave && (
        <div className="wave-indicator">
          <div className="wave-info">
            <span className="wave-number">ONDA {waveNumber}</span>
            <span className="wave-name">{currentWave.name}</span>
            <span className="wave-year">{currentWave.year}</span>
          </div>
          <div className="wave-timer">
            <span className="timer-icon">⏱️</span>
            <span className="timer-value">{formatTime(waveTimer)}</span>
          </div>
        </div>
      )}

      {/* Barra compacta estilo roguelike */}
      <div className="hud-bar">
        {/* Sistema Operacional */}
        {selectedOS && (
          <>
            <div className="hud-stat os-badge" title={selectedOS.name}>
              <span className="stat-icon">{selectedOS.icon}</span>
              <span className="stat-label os-name">{selectedOS.name}</span>
            </div>
            <div className="hud-separator">|</div>
          </>
        )}

        {/* Arma Atual */}
        {weaponInfo && (
          <>
            <div
              className="hud-stat weapon-display"
              title={`${weaponInfo.weapon.name} (${weaponInfo.tier?.name})`}
              style={{ '--tier-color': weaponInfo.tier?.color }}
            >
              <span className="weapon-icon">{weaponInfo.weapon.icon}</span>
              <div className="weapon-info-compact">
                <span className="weapon-name">{weaponInfo.weapon.name}</span>
                <span className="weapon-tier" style={{ color: weaponInfo.tier?.color }}>
                  {weaponInfo.tier?.name}
                </span>
              </div>
            </div>

            {/* Habilidade Especial */}
            {weaponInfo.special && (
              <button
                className={`special-ability-btn ${weaponInfo.special.isReady ? 'ready' : 'cooldown'}`}
                onClick={onUseSpecial}
                disabled={!weaponInfo.special.isReady}
                title={`${weaponInfo.special.name}: ${weaponInfo.special.description}`}
              >
                <span className="special-icon">⭐</span>
                {!weaponInfo.special.isReady && (
                  <div
                    className="cooldown-overlay"
                    style={{ height: `${getSpecialCooldownPercent()}%` }}
                  />
                )}
                <span className="special-key">Q</span>
              </button>
            )}

            <div className="hud-separator">|</div>
          </>
        )}

        {/* HP do Player */}
        <div className="hud-stat">
          <span className="stat-icon">❤️</span>
          <div className="stat-bar health-bar">
            <div
              className="stat-fill health-fill"
              style={{ width: `${(health / maxHealth) * 100}%` }}
            />
          </div>
          <span className="stat-text">{Math.floor(health)}</span>
        </div>

        {/* Servidor */}
        <div className="hud-stat">
          <span className="stat-icon">🖥️</span>
          <div className="stat-bar server-bar">
            <div
              className="stat-fill server-fill"
              style={{ width: `${(datacenterHealth / maxDatacenterHealth) * 100}%` }}
            />
          </div>
          <span className="stat-text">{Math.floor(datacenterHealth)}</span>
        </div>

        {/* Separador */}
        <div className="hud-separator">|</div>

        {/* Nível */}
        <div className="hud-stat level">
          <span className="stat-icon">⭐</span>
          <span className="stat-label">Lv.{level}</span>
          <div className="stat-bar xp-bar">
            <div className="stat-fill xp-fill" style={{ width: `${xpDisplay?.progress || 0}%` }} />
          </div>
        </div>

        {/* Score */}
        <div className="hud-stat score">
          <span className="stat-icon">📚</span>
          <span className="stat-value">{score}</span>
        </div>

        {/* Money */}
        <div className="hud-stat money-hud">
          <span className="stat-icon">💰</span>
          <span className="stat-value gold">{money}</span>
        </div>

        {/* Upgrades de arma */}
        {weaponInfo?.upgrades?.length > 0 && (
          <>
            <div className="hud-separator">|</div>
            <div
              className="hud-stat upgrades"
              title={`${weaponInfo.upgrades.length} upgrades ativos`}
            >
              <span className="stat-icon">⬆️</span>
              <span className="stat-value">{weaponInfo.upgrades.length}</span>
            </div>
          </>
        )}

        {/* Apps instalados */}
        {installedApps.length > 0 && (
          <>
            <div className="hud-separator">|</div>
            <div className="hud-stat apps" title={`${installedApps.length} apps instalados`}>
              <span className="stat-icon">📱</span>
              <span className="stat-value">{installedApps.length}</span>
            </div>
          </>
        )}

        {/* Botão Pausa */}
        {gameActive && (
          <button onClick={onPause} className="hud-pause-btn" title="Pausar (P)">
            ⏸
          </button>
        )}
      </div>

      {/* Efeito de Sinergia */}
      {weaponInfo?.synergyEffect && gameActive && (
        <div className="synergy-indicator">
          <span className="synergy-icon">{selectedOS?.icon}</span>
          <span className="synergy-text">{weaponInfo.synergyEffect}</span>
        </div>
      )}
    </div>
  );
};
