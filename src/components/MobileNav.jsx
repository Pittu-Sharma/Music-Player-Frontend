import React from 'react';
import { Home, Compass, Library, Search, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: <Home size={20} />, path: '/', label: 'Home' },
    { icon: <Compass size={20} />, path: '/browse', label: 'Browse' },
    { icon: <Search size={20} />, path: '/search', label: 'Search' },
    { icon: <Library size={20} />, path: '/library', label: 'Library' },
    { icon: <Sparkles size={20} />, path: '/ai-mood', label: 'AI' },
  ];

  return (
    <div className="glass-panel mobile-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/browse');
        return (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                transition: 'color 0.3s'
              }}
            >
              <div style={{
                padding: '8px',
                borderRadius: '12px',
                background: isActive ? 'rgba(0, 247, 255, 0.1)' : 'transparent',
                boxShadow: isActive ? '0 0 15px rgba(0, 247, 255, 0.2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.icon}
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileNav;
