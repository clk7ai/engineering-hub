import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ activeCategory, setActiveCategory }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All', icon: '📰' },
    { id: 'innovation', label: 'Innovation', icon: '💡' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'culture', label: 'Culture', icon: '🎭' },
    { id: 'health', label: 'Health', icon: '⚕️' },
    { id: 'transportation', label: 'Transportation', icon: '🚗' },
    { id: 'military', label: 'Military', icon: '⚔️' },
    { id: 'energy', label: 'Energy', icon: '⚡' },
  ];

  const features = [
    { id: 'videos', label: 'Videos', icon: '🎬' },
    { id: 'research', label: 'Research', icon: '📊' },
    { id: 'interviews', label: 'Interviews', icon: '🎙️' },
    { id: 'newsletter', label: 'Newsletter', icon: '📧' },
    { id: 'premium', label: 'IE+ Premium', icon: '⭐' },
  ];

  return (
    <nav className="navigation-wrapper">
      <div className="nav-container">
        <div className="nav-header">
          <h1 className="nav-logo">Engineering Hub</h1>
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
        
        <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="categories-menu">
            <h3 className="menu-title">Categories</h3>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`nav-link ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
              >
                <span className="icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="features-menu">
            <h3 className="menu-title">Explore</h3>
            {features.map(feat => (
              <button
                key={feat.id}
                className={`nav-link feature ${activeCategory === feat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(feat.id);
                  setMobileMenuOpen(false);
                }}
              >
                <span className="icon">{feat.icon}</span>
                <span>{feat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
