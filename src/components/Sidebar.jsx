import React from 'react';
import { Home, Compass, Library, Heart, Search, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Compass size={20} />, label: 'Browse', path: '/browse' },
    { icon: <Library size={20} />, label: 'Library', path: '/library' },
    { icon: <Search size={20} />, label: 'Search', path: '/search' },
    { icon: <Heart size={20} />, label: 'Favorites', path: '/favorites' },
  ];

  return (
    <div className="glass-panel sidebar" style={{
      width: '280px',
      margin: '24px',
      height: 'calc(100vh - 48px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 24px',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ marginBottom: '50px', paddingLeft: '12px' }}>
        <h2 className="neon-text" style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)', letterSpacing: '4px' }}>
          PITTU
        </h2>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/browse');
            return (
              <li key={item.label} style={{ marginBottom: '12px', position: 'relative' }}>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    style={{
                      position: 'absolute',
                      left: '-24px',
                      width: '4px',
                      height: '100%',
                      background: 'var(--accent-cyan)',
                      boxShadow: 'var(--glow-cyan)',
                      borderRadius: '0 4px 4px 0'
                    }}
                  />
                )}
                <Link 
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isActive ? 'rgba(0, 247, 255, 0.08)' : 'transparent',
                    fontWeight: isActive ? '600' : '400'
                  }}
                  className="sidebar-link"
                >
                  <span style={{ color: isActive ? 'var(--accent-cyan)' : 'inherit' }}>{item.icon}</span>
                  <span style={{ fontSize: '1rem' }}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          paddingLeft: '15px'
        }}>
          <Settings size={18} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
