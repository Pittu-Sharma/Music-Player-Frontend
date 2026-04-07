import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Music } from 'lucide-react';
import { motion } from 'framer-motion';
import SongCard from '../components/SongCard';

const Browse = ({ onPlay, currentTrack, isPlaying, toggleFavorite, isFavorite }) => {
  const [tracks, setTracks] = useState([]);
  const [activeGenre, setActiveGenre] = useState('bollywood');
  const [loading, setLoading] = useState(false);

  const genres = [
    { id: 'bollywood', name: 'Bollywood Hits' },
    { id: 'hollywood', name: 'International' },
    { id: 'korean', name: 'K-Pop' },
    { id: 'japanese', name: 'J-Pop' },
  ];

  const [cache, setCache] = useState({ bollywood: null, hollywood: null, korean: null, japanese: null });

  useEffect(() => {
    if (cache[activeGenre]) {
      setTracks(cache[activeGenre]);
    } else {
      fetchTracks(activeGenre);
    }
  }, [activeGenre]);

  const fetchTracks = async (genre) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/music/genre/${genre}`);
      const fetchedTracks = response.data.data || [];
      setTracks(fetchedTracks);
      setCache(prev => ({ ...prev, [genre]: fetchedTracks }));
    } catch (error) {
      console.error('Error fetching tracks:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="browse-page">
      {/* Featured Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel hero-section"
        style={{
          width: '100%',
          height: '280px',
          borderRadius: '30px',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: '0 60px',
          background: 'linear-gradient(135deg, rgba(8, 8, 28, 0.4), rgba(157, 0, 255, 0.1))',
          border: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
          <h1 className="neon-text" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Explore Music!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.6' }}>
            Discover the most immersive songs across the multiverse. Hand-picked for your auditory journey.
          </p>
          <button className="glow-btn">Experience Now</button>
        </div>

        {/* Decorative elements for Hero */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{
            position: 'absolute',
            right: '-10%',
            top: '-20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)',
            opacity: 0.1,
            filter: 'blur(60px)'
          }}
        />
      </motion.div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setActiveGenre(genre.id)}
            className="glow-btn"
            style={{
              background: activeGenre === genre.id ? 'var(--accent-cyan)' : 'transparent',
              color: activeGenre === genre.id ? 'var(--bg)' : 'var(--accent-cyan)',
              border: activeGenre === genre.id ? 'none' : '1px solid var(--accent-cyan)',
              padding: '10px 24px',
              fontFamily: 'Orbitron',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeGenre === genre.id ? 'var(--glow-cyan)' : 'none',
              whiteSpace: 'nowrap'
            }}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Music size={40} color="var(--accent-cyan)" />
          </motion.div>
        </div>
      ) : (
        <div className="track-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          {tracks.map((track) => (
            <SongCard
              key={track.id}
              track={track}
              onPlay={onPlay}
              isPlaying={isPlaying}
              isCurrent={currentTrack?.id === track.id}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite(track.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Browse;
