import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Browse from './pages/Browse';
import Player from './components/Player';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Library from './pages/Library';
import Login from './pages/Login';
import Signup from './pages/Signup';
import useFavorites from './hooks/useFavorites';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProfileButton = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <button 
        className="glow-btn" 
        onClick={() => navigate('/login')}
        style={{ fontSize: '0.7rem', padding: '8px 16px' }}
      >
        Login
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.username}</span>
      <button 
        className="glow-btn" 
        onClick={logout}
        style={{ fontSize: '0.7rem', padding: '8px 16px', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}
      >
        Logout
      </button>
    </div>
  );
};

const NebulaBackground = () => (
  <div className="nebula-wrapper">
    <div className="nebula" />
  </div>
);

const App = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() && location.pathname !== '/search') {
      navigate('/search');
    }
  };

  const commonProps = {
    onPlay: playTrack,
    currentTrack,
    isPlaying,
    toggleFavorite,
    isFavorite
  };

  return (
    <div className="app-container" style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <NebulaBackground />
      <Sidebar />
      
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 40px 160px 40px',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px',
          position: 'sticky',
          top: 0,
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
          padding: '15px 0'
        }}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="neon-text" 
            style={{ fontSize: '1.6rem', cursor: 'pointer' }} 
            onClick={() => navigate('/')}
          >
            PITTU PLAYER
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="search-bar glass-panel" 
            style={{
              padding: '12px 24px',
              borderRadius: '30px',
              width: '450px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}
          >
            <SearchIcon size={20} color="var(--accent-cyan)" />
            <input 
              type="text" 
              placeholder="Explore the sonic galaxy..." 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                width: '100%',
                outline: 'none',
                fontFamily: 'Outfit',
                fontSize: '1rem'
              }}
            />
          </motion.div>
          <ProfileButton />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Browse {...commonProps} />} />
              <Route path="/browse" element={<Browse {...commonProps} />} />
              <Route path="/search" element={<Search query={searchQuery} {...commonProps} />} />
              <Route path="/favorites" element={<Favorites favorites={favorites} {...commonProps} />} />
              <Route path="/library" element={<Library favorites={favorites} {...commonProps} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Player 
        track={currentTrack} 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying} 
      />
    </div>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
