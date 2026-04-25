import React, { useState } from 'react';
import { Home, Compass, Library, Heart, Search, Settings, Music, Plus, Tv, Sparkles, Wand2, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Sidebar = ({ playlists = [], createPlaylist }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [showNameInput, setShowNameInput] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);

  const menuItems = [
    { icon: <Home size={22} />, label: 'Home', path: '/', color: '#00f7ff', shadow: 'rgba(0, 247, 255, 0.5)' },
    { icon: <Compass size={22} />, label: 'Browse', path: '/browse', color: '#9d00ff', shadow: 'rgba(157, 0, 255, 0.5)' },
    { icon: <Tv size={22} />, label: 'Cartoon', path: '/cartoons', color: '#ff00c1', shadow: 'rgba(255, 0, 193, 0.5)' },
    { icon: <Library size={22} />, label: 'Library', path: '/library', color: '#00d4ff', shadow: 'rgba(0, 212, 255, 0.5)' },
    { icon: <Search size={22} />, label: 'Search', path: '/search', color: '#fffb00', shadow: 'rgba(255, 251, 0, 0.5)' },
    { icon: <Sparkles size={22} />, label: 'AI Mood', path: '/ai-mood', color: '#00ff88', shadow: 'rgba(0, 255, 136, 0.5)' },
    { icon: <Wand2 size={22} />, label: 'AI Creator', path: '/ai-creator', color: '#ff4d4d', shadow: 'rgba(255, 77, 77, 0.5)' },
  ];

  const handleCreatePlaylist = () => {
    if (!token) {
      showToast('Please log in to create and manage playlists', 'info', 4000);
      return;
    }
    setPlaylistName('');
    setShowNameInput(true);
  };

  const handleConfirmCreate = async () => {
    const name = playlistName.trim();
    if (!name) return;
    setCreating(true);
    try {
      await createPlaylist(name);
      showToast(`Playlist "${name}" created!`, 'success');
      setShowNameInput(false);
    } catch (err) {
      showToast('Failed to create playlist.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const SidebarItem = ({ item, isActive }) => (
    <li style={{ marginBottom: '12px', position: 'relative' }}>
      <Link
        to={item.path}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '14px 22px',
          borderRadius: '24px',
          textDecoration: 'none',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isActive 
            ? `linear-gradient(90deg, ${item.color}22 0%, transparent 100%)` 
            : 'rgba(255, 255, 255, 0.04)',
          border: `1px solid ${isActive ? item.color + '66' : 'rgba(255, 255, 255, 0.08)'}`,
          boxShadow: isActive ? `0 10px 35px -10px ${item.shadow}` : 'none'
        }}
        className="sidebar-item-premium group"
      >
        <motion.div 
          whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
          animate={isActive ? { 
            boxShadow: [`0 0 15px ${item.color}66`, `0 0 35px ${item.color}aa`, `0 0 15px ${item.color}66`],
            y: [0, -3, 0]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: isActive 
              ? `linear-gradient(135deg, ${item.color}, #ffffff)` 
              : `linear-gradient(135deg, ${item.color}33, rgba(255, 255, 255, 0.05))`,
            border: `1px solid ${isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)'}`,
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'hologram-shimmer 3s infinite linear'
          }} />
          
          <span style={{ 
            color: isActive ? '#03030f' : item.color,
            zIndex: 1,
            filter: isActive ? 'none' : `drop-shadow(0 0 10px ${item.color}aa)`,
            display: 'flex',
            alignItems: 'center'
          }}>
            {item.icon}
          </span>
        </motion.div>

        <div style={{ flex: 1 }}>
          <span style={{ 
            fontSize: '1.1rem', 
            fontWeight: '900',
            letterSpacing: '0.8px',
            color: 'white',
            transition: 'all 0.3s ease',
            textShadow: isActive ? `0 0 20px ${item.color}aa` : 'none',
            opacity: isActive ? 1 : 0.75
          }}>
            {item.label}
          </span>
        </div>

        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: item.color,
              boxShadow: `0 0 20px ${item.color}`
            }}
          />
        )}
      </Link>
    </li>
  );

  const PlaylistCard = ({ item, isActive }) => (
    <li style={{ marginBottom: '12px', position: 'relative' }}>
      <Link
        to={item.path}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '12px 14px',
          borderRadius: '20px',
          textDecoration: 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isActive 
            ? 'rgba(255, 0, 193, 0.25)' 
            : 'rgba(255, 255, 255, 0.03)',
          border: isActive 
            ? '1px solid rgba(255, 0, 193, 0.5)' 
            : '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: isActive ? '0 10px 30px rgba(255, 0, 193, 0.2)' : 'none',
          overflow: 'hidden',
          position: 'relative'
        }}
        className="playlist-card-premium group"
      >
        {isActive && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0, 0.9, 0],
                  scale: [0.5, 1.4, 0.5],
                  x: [Math.random() * 250, Math.random() * 250],
                  y: [Math.random() * 80, Math.random() * 80],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  position: 'absolute',
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: ['#ff00c1', '#9d00ff', '#00f7ff', '#fffb00'][i % 4],
                  boxShadow: `0 0 10px ${['#ff00c1', '#9d00ff', '#00f7ff', '#fffb00'][i % 4]}`,
                }}
              />
            ))}
          </div>
        )}

        <div style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '14px', 
          background: 'linear-gradient(135deg, #ff00c1, #9d00ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(255, 0, 193, 0.5)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1
        }}>
          <span style={{ color: 'white', display: 'flex', alignItems: 'center', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' }}>
            {item.icon}
          </span>
        </div>

        <div style={{ overflow: 'hidden', flex: 1, position: 'relative', zIndex: 1 }}>
          <p style={{ 
            color: 'white', 
            fontWeight: '900', 
            fontSize: '1rem', 
            marginBottom: '2px',
            whiteSpace: 'nowrap'
          }}>
            {item.label}
          </p>
          <p style={{ 
            color: 'rgba(255,255,255,0.6)', 
            fontSize: '0.7rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '800'
          }}>
            {item.subtitle || 'Your Collection'}
          </p>
        </div>

        <ChevronRight size={16} color="rgba(255,255,255,0.4)" style={{ marginLeft: 'auto', position: 'relative', zIndex: 1 }} />
      </Link>
    </li>
  );

  return (
    <div className="glass-panel sidebar" style={{
      width: '320px',
      margin: '24px',
      height: 'calc(100vh - 48px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '35px 20px',
      position: 'relative',
      zIndex: 10,
      background: 'linear-gradient(135deg, rgba(8, 8, 28, 0.6), rgba(157, 0, 255, 0.15))',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '35px',
      boxShadow: '0 30px 70px rgba(0, 0, 0, 0.6), 0 0 30px rgba(157, 0, 255, 0.1)',
      backdropFilter: 'blur(25px)'
    }}>
      <div style={{ marginBottom: '45px', paddingLeft: '16px' }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          letterSpacing: '12px',
          fontFamily: 'Orbitron',
          fontWeight: '900',
          background: 'linear-gradient(to right, #00f7ff, #9d00ff, #ff00c1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 15px rgba(0, 247, 255, 0.4))'
        }}>
          PITTU
        </h2>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
        <div style={{ marginBottom: '40px' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '4px', marginBottom: '20px', paddingLeft: '20px', textTransform: 'uppercase' }}>Library</p>
          <ul style={{ listStyle: 'none' }}>
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.label} 
                item={item} 
                isActive={location.pathname === item.path || (item.path === '/' && location.pathname === '/browse')} 
              />
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingLeft: '20px', paddingRight: '10px' }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase' }}>Playlists</p>
            <button 
              onClick={handleCreatePlaylist}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }}
              className="hover:text-white hover:scale-125"
            >
              <Plus size={22} />
            </button>
          </div>

          <AnimatePresence>
            {showNameInput && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                style={{ padding: '0 10px', marginBottom: '20px' }}
              >
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255, 0, 193, 0.5)', borderRadius: '15px', padding: '12px' }}>
                  <input
                    autoFocus
                    placeholder="Collection Name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmCreate();
                      if (e.key === 'Escape') setShowNameInput(false);
                    }}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '0.9rem', width: '100%', fontWeight: '600' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ul style={{ listStyle: 'none' }}>
            <PlaylistCard 
              item={{ icon: <Heart size={22} />, label: 'Liked Songs', subtitle: 'Favorite Tracks', path: '/favorites' }}
              isActive={location.pathname === '/favorites'}
            />
            {playlists.map((p) => (
              <PlaylistCard 
                key={p._id}
                item={{ icon: <Music size={22} />, label: p.name, subtitle: 'Your Collection', path: `/playlist/${p._id}` }}
                isActive={location.pathname === `/playlist/${p._id}`}
              />
            ))}
          </ul>
        </div>
      </nav>

      <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <SidebarItem 
          item={{ icon: <Settings size={22} />, label: 'Settings', path: '/settings', color: '#ffffff', shadow: 'rgba(255,255,255,0.3)' }}
          isActive={location.pathname === '/settings'}
        />
      </div>
    </div>
  );
};

export default Sidebar;
