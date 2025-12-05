import React from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';

export const GameArena = ({
  containerRef,
  playerRef,
  knifeRef,
  enemiesRef,
  moneyRef,
  gameActive,
  playerSize,
  knifeWidth,
  knifeHeight,
  datacenterSize,
  enemies,
  moneyDrops,
  gameState,
  // Props do sistema de armas
  weaponInfo,
  projectiles = [],
  barriers = [],
  activeEffects = [],
}) => {
  // Renderiza arma baseada no tipo
  const renderWeapon = () => {
    if (!weaponInfo?.weapon) {
      // Arma padrão (faca giratória)
      return (
        <div
          ref={knifeRef}
          className="entity knife"
          style={{
            width: knifeWidth,
            height: knifeHeight,
            opacity: gameActive ? 1 : 0,
          }}
        />
      );
    }

    const { weapon, tier } = weaponInfo;
    const tierColor = tier?.color || '#a78bfa';

    switch (weapon.mechanics?.type) {
      case 'rotating':
        // Espada digital - usa visual de lâmina (sem emoji)
        return (
          <div
            ref={knifeRef}
            className={`entity knife weapon-${weapon.id}`}
            style={{
              width: knifeWidth,
              height: knifeHeight,
              opacity: gameActive ? 1 : 0,
              '--knife-color': tierColor,
            }}
          />
        );

      case 'wave':
        // Antivírus - rotativa com ícone
        return (
          <div
            ref={knifeRef}
            className={`entity weapon weapon-${weapon.id}`}
            style={{
              width: knifeWidth,
              height: knifeHeight,
              opacity: gameActive ? 1 : 0,
              '--weapon-color': tierColor,
              '--weapon-glow': '#22c55e',
            }}
          >
            <span className="weapon-icon">{weapon.icon}</span>
          </div>
        );

      case 'barrier':
        // Firewall - mostra indicador de barreira
        return (
          <div
            ref={knifeRef}
            className={`entity weapon weapon-firewall`}
            style={{
              width: knifeWidth * 1.5,
              height: knifeHeight * 1.5,
              opacity: gameActive ? 1 : 0,
              '--weapon-color': '#ef4444',
            }}
          >
            <span className="weapon-icon">🔥</span>
          </div>
        );

      case 'debuff':
        // Antimalware - pulsa
        return (
          <div
            ref={knifeRef}
            className={`entity weapon weapon-antimalware`}
            style={{
              width: knifeWidth,
              height: knifeHeight,
              opacity: gameActive ? 1 : 0,
              '--weapon-color': '#a855f7',
            }}
          >
            <span className="weapon-icon">☢️</span>
          </div>
        );

      case 'reactive':
        // IDS - olho que observa
        return (
          <div
            ref={knifeRef}
            className={`entity weapon weapon-ids`}
            style={{
              width: knifeWidth * 1.2,
              height: knifeHeight * 1.2,
              opacity: gameActive ? 1 : 0,
              '--weapon-color': '#3b82f6',
            }}
          >
            <span className="weapon-icon">👁️</span>
          </div>
        );

      case 'stealth':
        // VPN - cadeado
        return (
          <div
            ref={knifeRef}
            className={`entity weapon weapon-vpn ${activeEffects.includes('stealth') ? 'stealthed' : ''}`}
            style={{
              width: knifeWidth,
              height: knifeHeight,
              opacity: gameActive ? (activeEffects.includes('stealth') ? 0.3 : 1) : 0,
              '--weapon-color': '#10b981',
            }}
          >
            <span className="weapon-icon">🔒</span>
          </div>
        );

      case 'projectile':
        // Anti-Spam - dispara projéteis
        return (
          <div
            ref={knifeRef}
            className={`entity weapon weapon-antispam`}
            style={{
              width: knifeWidth,
              height: knifeHeight,
              opacity: gameActive ? 1 : 0,
              '--weapon-color': '#f59e0b',
            }}
          >
            <span className="weapon-icon">📧</span>
          </div>
        );

      default:
        return (
          <div
            ref={knifeRef}
            className="entity knife"
            style={{
              width: knifeWidth,
              height: knifeHeight,
              opacity: gameActive ? 1 : 0,
            }}
          />
        );
    }
  };

  return (
    <div className="game-arena-container" ref={containerRef}>
      {/* Data Center (Servidor) */}
      <div
        className="entity data-center"
        style={{
          width: datacenterSize,
          height: datacenterSize,
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate(${gameState.current.datacenter.x}px, ${gameState.current.datacenter.y}px)`,
        }}
      />

      {/* Jogador */}
      <div
        ref={playerRef}
        className={`entity player ${activeEffects.includes('stealth') ? 'stealthed' : ''}`}
        style={{
          width: playerSize,
          height: playerSize,
          opacity: activeEffects.includes('stealth') ? 0.3 : 1,
        }}
      />

      {/* Arma do Jogador */}
      {renderWeapon()}

      {/* Projéteis (Anti-Spam, Antivírus waves) */}
      {gameActive &&
        projectiles.map((proj) => (
          <div
            key={proj.id}
            className={`entity projectile projectile-${proj.type}`}
            style={{
              width: proj.type === 'wave' ? proj.width : 8,
              height: proj.type === 'wave' ? 4 : 8,
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${proj.x}px, ${proj.y}px) rotate(${proj.angle}rad)`,
            }}
          />
        ))}

      {/* Barreiras (Firewall) */}
      {gameActive &&
        barriers.map((barrier) => (
          <div
            key={barrier.id}
            className="entity barrier firewall-barrier"
            style={{
              width: barrier.width,
              height: barrier.height,
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${barrier.x}px, ${barrier.y}px) rotate(${barrier.angle}rad)`,
              opacity: Math.max(0.3, 1 - (Date.now() - barrier.createdAt) / barrier.duration),
            }}
          />
        ))}

      {/* Inimigos */}
      {gameActive &&
        enemies.map((enemy, index) => {
          // Usa maxHealth individual ou padrão
          const maxHealth = enemy.maxHealth || GAME_CONFIG.ENEMY.MAX_HEALTH;
          return (
            <div key={enemy.id}>
              {/* Barra de vida (só aparece se vida < máxima) */}
              {enemy.health < maxHealth && (
                <div
                  className="enemy-health-bar"
                  style={{
                    position: 'absolute',
                    left: enemy.x,
                    top: enemy.y - 8,
                    width: enemy.size,
                    height: 4,
                    backgroundColor: '#222',
                    border: '1px solid #666',
                    borderRadius: '2px',
                  }}
                >
                  <div
                    className="enemy-health-fill"
                    style={{
                      height: '100%',
                      width: `${(enemy.health / maxHealth) * 100}%`,
                      backgroundColor: '#ef4444',
                      borderRadius: '1px',
                    }}
                  />
                </div>
              )}

              {/* Inimigo */}
              <div
                ref={(el) => {
                  // Garante que o array de refs não fique com buracos
                  if (enemiesRef.current) {
                    enemiesRef.current[index] = el;
                  }
                }}
                className="entity enemy"
                style={{
                  width: enemy.size,
                  height: enemy.size,
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transform: `translate(${enemy.x}px, ${enemy.y}px)`,
                }}
              />
            </div>
          );
        })}

      {/* Moedas */}
      {gameActive &&
        moneyDrops.map((money, index) => (
          <div
            key={money.id}
            ref={(el) => {
              if (moneyRef.current) {
                moneyRef.current[index] = el;
              }
            }}
            className="entity money"
            style={{
              width: 12,
              height: 12,
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${money.x}px, ${money.y}px)`,
            }}
          />
        ))}
    </div>
  );
};
