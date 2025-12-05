import React, { useState } from 'react';
import { OS_CATEGORIES } from '../constants/operatingSystems';

/**
 * Componente de seleção de Sistema Operacional
 * Exibe todas as categorias e seus sistemas
 */
export const SystemSelect = ({ onSelect, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredOS, setHoveredOS] = useState(null);

  const categories = Object.values(OS_CATEGORIES);

  // Se nenhuma categoria selecionada, mostra categorias
  if (!selectedCategory) {
    return (
      <div className="system-select-overlay">
        <div className="system-select-container">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Voltar
            </button>
          )}

          <div className="system-select-header">
            <h1 className="system-title">Escolha sua Plataforma</h1>
            <p className="system-subtitle">Cada plataforma oferece desafios únicos</p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-card category-${cat.id}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <div className="category-emoji">{cat.emoji}</div>
                <h2 className="category-name">{cat.name}</h2>
                <p className="category-desc">{cat.description}</p>
                <div className="category-systems">
                  {cat.systems.map((os) => (
                    <span key={os.id} className="mini-os-icon" title={os.name}>
                      {os.icon}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mostra sistemas da categoria selecionada
  return (
    <div className="system-select-overlay">
      <div className="system-select-container">
        <button className="back-button" onClick={() => setSelectedCategory(null)}>
          ← Voltar
        </button>

        <div className="system-select-header">
          <span className="category-badge">
            {selectedCategory.emoji} {selectedCategory.name}
          </span>
          <h1 className="system-title">Escolha seu Sistema</h1>
          <p className="system-subtitle">Cada escolha define seu estilo de jogo</p>
        </div>

        <div className="os-cards-grid">
          {selectedCategory.systems.map((os) => (
            <div
              key={os.id}
              className={`os-card ${hoveredOS === os.id ? 'hovered' : ''}`}
              style={{ '--os-color': os.color }}
              onMouseEnter={() => setHoveredOS(os.id)}
              onMouseLeave={() => setHoveredOS(null)}
              onClick={() => onSelect(os)}
            >
              <div className="os-card-header">
                <span className="os-icon">{os.icon}</span>
                <h2 className="os-name">{os.name}</h2>
              </div>

              <p className="os-description">{os.description}</p>

              <div className="os-section advantages">
                <h3>✅ Vantagens</h3>
                <ul>
                  {os.advantages.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>

              <div className="os-section disadvantages">
                <h3>❌ Desvantagens</h3>
                <ul>
                  {os.disadvantages.map((dis, idx) => (
                    <li key={idx}>{dis}</li>
                  ))}
                </ul>
              </div>

              <p className="os-flavor">{os.flavorText}</p>

              <button className="os-select-btn">Instalar {os.name}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
