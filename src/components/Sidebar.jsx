import React, { useState } from 'react';
import { Home, Compass, Library, Heart, Search, Settings, Music, Plus, Tv, Zap, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Sidebar = ({ playlists = [], createPlaylist }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();

  // Inline playlist name modal state
  const [showNameInput, setShowNameInput] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);

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
      setPlaylistName('');
    } catch (err) {
      showToast('Failed to create playlist. Try again.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirmCreate();
    if (e.key === 'Escape') setShowNameInput(false);
  };

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Compass size={20} />, label: 'Browse', path: '/browse' },
    { icon: <Tv size={20} />, label: 'Cartoon', path: '/cartoons' },
    { icon: <Zap size={20} />, label: 'Anime', path: '/anime' },
    { icon: <Library size={20} />, label: 'Library', path: '/library' },
    { icon: <Search size={20} />, label: 'Search', path: '/search' },
  ];

  const playlistItems = [
    { icon: <Heart size={18} />, label: 'Liked Songs', path: '/favorites', color: '#ff4b91' },
    ...playlists.map(p => ({
      icon: <Music size={18} />,
      label: p.name,
      path: `/playlist/${p._id}`,
      color: 'var(--accent-cyan)'
    }))
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

      <nav style={{ flex: 1, overflowY: 'auto' }}>
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
                      inset: 0,
                      background: 'linear-gradient(90deg, rgba(157, 0, 255, 0.2), rgba(255, 0, 193, 0.15))',
                      boxShadow: '0 0 20px rgba(157, 0, 255, 0.3)',
                      borderRadius: '12px',
                      zIndex: -1,
                      border: '1px solid rgba(157, 0, 255, 0.3)'
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
                    background: 'transparent',
                    fontWeight: isActive ? '600' : '400',
                    position: 'relative',
                    zIndex: 1
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

        {/* Playlists Section */}
        <div style={{ marginTop: '40px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '0 16px'
          }}>
            <h3 style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--text-secondary)',
              fontWeight: '600'
            }}>
              Your Playlists
            </h3>
            <button
              onClick={handleCreatePlaylist}
              title="Create playlist"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              className="hover-glow"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Inline create playlist input */}
          <AnimatePresence>
            {showNameInput && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ overflow: 'hidden', padding: '0 4px' }}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 16px rgba(0, 212, 255, 0.1)',
                }}>
                  <Music size={14} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Playlist name…"
                    value={playlistName}
                    onChange={e => setPlaylistName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={60}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'white',
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '0.87rem',
                      flex: 1,
                      minWidth: 0,
                    }}
                  />
                  <button
                    onClick={handleConfirmCreate}
                    disabled={!playlistName.trim() || creating}
                    style={{
                      background: playlistName.trim() ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      color: playlistName.trim() ? '#000' : 'rgba(255,255,255,0.3)',
                      cursor: playlistName.trim() ? 'pointer' : 'default',
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    {creating ? '…' : 'Create'}
                  </button>
                  <button
                    onClick={() => setShowNameInput(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      padding: '2px',
                      fontSize: '0.8rem',
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >✕</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ul style={{ listStyle: 'none' }}>
            {playlistItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.label} style={{ marginBottom: '8px' }}>
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      textDecoration: 'none',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      fontSize: '0.95rem'
                    }}
                    className="sidebar-link"
                  >
                    <span style={{
                      color: isActive ? item.color : 'inherit',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Not logged in nudge */}
          {!token && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                margin: '16px 4px 0',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(0, 212, 255, 0.06)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/login')}
            >
              <LogIn size={15} color="var(--accent-cyan)" />
              <span style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4',
                fontFamily: 'Outfit, sans-serif',
              }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>Login</span> to create &amp; manage playlists
              </span>
            </motion.div>
          )}
        </div>
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
