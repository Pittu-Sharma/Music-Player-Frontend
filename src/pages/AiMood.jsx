import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader, Sparkles, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import SongCard from '../components/SongCard';

const AiMood = ({ onPlay, currentTrack, isPlaying, toggleFavorite, isFavorite, playlists, addToPlaylist }) => {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 12;

  const moodCards = [
    { label: 'Happy', emoji: '😊', subtitle: 'Feel good energy', value: 'I want some happy and upbeat Bollywood songs', color: 'linear-gradient(135deg, #fce38a 0%, #f38181 100%)' },
    { label: 'Sad', emoji: '😢', subtitle: 'Soulful melodies', value: 'I am feeling low, need some soulful sad tracks', color: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)' },
    { label: 'Heartbreak', emoji: '💔', subtitle: 'Emotional release', value: 'Heartbroken, play some deep emotional music', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { label: 'Motivated', emoji: '🚀', subtitle: 'Power & Energy', value: 'Feeling energetic and ready to conquer the world', color: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' },
    { label: 'Late Night', emoji: '🌙', subtitle: 'Quiet chill vibes', value: 'Chill late night vibes with soft melodies', color: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
    { label: 'Focus', emoji: '🧠', subtitle: 'Concentrate better', value: 'Instrumental music for focus and concentration', color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
    { label: 'Relax', emoji: '🧘', subtitle: 'Calm your mind', value: 'Relaxing ambient and soft acoustic music', color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }
  ];

  const handleMoodMatch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetMood = (typeof e === 'string' ? e : mood).trim();
    if (!targetMood) return;

    const normalized = targetMood.toLowerCase();
    let cleanMood = 'trending bollywood hits'; // Default fallback

    // Keyword Extraction & Mapping
    if (normalized.includes('happy') || normalized.includes('upbeat')) {
      cleanMood = 'happy bollywood songs';
    } else if (normalized.includes('sad') || normalized.includes('soulful') || normalized.includes('low')) {
      cleanMood = 'sad bollywood songs';
    } else if (normalized.includes('heartbroken') || normalized.includes('heartbreak') || normalized.includes('emotional')) {
      cleanMood = 'heartbreak bollywood songs';
    } else if (normalized.includes('motivated') || normalized.includes('energy') || normalized.includes('conquer')) {
      cleanMood = 'motivational bollywood songs';
    } else if (normalized.includes('chill') || normalized.includes('night')) {
      cleanMood = 'chill late night bollywood';
    } else if (normalized.includes('focus') || normalized.includes('concentrate')) {
      cleanMood = 'bollywood focus instrumental';
    } else if (normalized.includes('relax') || normalized.includes('calm')) {
      cleanMood = 'relaxing bollywood ambient';
    } else if (targetMood.trim().length < 30) {
      // If it's a manual short input, use it directly
      cleanMood = targetMood.trim();
    }

    console.log('[AI Mood] Cleaned mood query:', cleanMood);

    setLoading(true);
    setError(null);
    setResults(null);
    setCurrentPage(1);

    try {
      const response = await fetch(`http://localhost:5000/api/ai/mood?mood=${encodeURIComponent(cleanMood)}`);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      console.log('[AI Mood] API Response:', data);
      
      if (!data.songs || data.songs.length === 0) {
        console.warn('[AI Mood] No songs found in response, trying trending fallback');
        // Final frontend fallback if API returns empty
        const trendingResponse = await fetch(`http://localhost:5000/api/ai/mood?mood=${encodeURIComponent('top trending bollywood songs')}`);
        const trendingData = await trendingResponse.json();
        setResults(trendingData);
      } else {
        console.log(`[AI Mood] Successfully loaded ${data.songs.length} songs`);
        setResults(data);
      }
    } catch (err) {
      console.error('[AI Mood] Fetch error:', err);
      setError('The AI is currently resting. Please try again in a moment!');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (val) => {
    console.log('[AI Mood] Card clicked:', val);
    setMood(val);
    handleMoodMatch(val);
  };

  // Pagination Logic
  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = results?.songs.slice(indexOfFirstSong, indexOfLastSong) || [];
  const totalPages = results ? Math.ceil(results.songs.length / songsPerPage) : 0;

  const paginate = (pageNumber) => {
    console.log('[AI Mood] Navigating to page:', pageNumber);
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="page-container" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Animated Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-gradient" />
        <div className="mesh-spot" style={{ top: '20%', left: '10%', background: 'var(--accent-cyan)' }} />
        <div className="mesh-spot" style={{ bottom: '20%', right: '10%', background: 'var(--accent-purple)' }} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '10px' }}
          >
            <Sparkles size={60} color="var(--accent-cyan)" className="pulse-glow" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="neon-text"
            style={{ fontSize: '4rem', marginBottom: '15px', fontWeight: '900', letterSpacing: '-2px' }}
          >
            VIBE CHECK
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-secondary)', fontSize: '1.4rem', fontWeight: '300' }}
          >
            Select a frequency or whisper your feelings to the machine.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel"
          style={{
            padding: '40px',
            borderRadius: '40px',
            maxWidth: '1000px',
            margin: '0 auto 40px auto',
            background: 'rgba(10, 10, 30, 0.6)',
            boxShadow: '0 0 50px rgba(0, 247, 255, 0.1)',
            border: '1px solid rgba(0, 247, 255, 0.2)'
          }}
        >
          <form onSubmit={handleMoodMatch} style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="How are you feeling today? 😊"
                className="futuristic-input"
                style={{
                  width: '100%',
                  padding: '25px 35px',
                  borderRadius: '25px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1.3rem',
                  fontFamily: 'Outfit',
                  outline: 'none',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              <div className="input-glow" />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px var(--accent-cyan)' }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="glow-btn animated-gradient-btn"
              disabled={loading}
              style={{ 
                padding: '0 50px', 
                borderRadius: '25px',
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                fontSize: '1.3rem',
                fontWeight: 'bold'
              }}
            >
              {loading ? <Loader className="spin" /> : <Music />}
              {loading ? 'CALIBRATING...' : 'FIND MY VIBE'}
            </motion.button>
          </form>
        </motion.div>

        {/* Mood Card Carousel */}
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '25px', 
          padding: '20px 10px 40px 10px',
          marginBottom: '20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }} className="no-scrollbar">
          {moodCards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, x: 100, rotateY: 45 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ 
                scale: 1.1, 
                y: -15, 
                rotateZ: 2,
                boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 20px ${card.color.split(',')[1].split(' ')[1]}` 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.value)}
              className="glass-panel futuristic-card"
              style={{
                minWidth: '260px',
                padding: '35px',
                borderRadius: '30px',
                cursor: 'pointer',
                textAlign: 'center',
                background: mood === card.value ? card.color : 'rgba(255, 255, 255, 0.03)',
                borderColor: mood === card.value ? 'white' : 'rgba(255, 255, 255, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Inner Glow Effect */}
              {mood === card.value && <div className="card-inner-glow" />}
              
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                style={{ fontSize: '3.5rem', display: 'block', marginBottom: '20px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
              >
                {card.emoji}
              </motion.span>
              
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: '0', color: 'white', fontWeight: 'bold' }}>{card.label}</h3>
                <p style={{ fontSize: '0.9rem', color: mood === card.value ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)', marginTop: '8px' }}>
                  {card.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '50px' }}
          >
            <div className="loader-orbit" style={{ margin: '0 auto 20px auto' }} />
            <h3 className="neon-text" style={{ fontSize: '1.5rem' }}>🎧 Finding the perfect vibe for you...</h3>
          </motion.div>
        )}

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Analysis Section */}
            <div className="glass-panel" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              padding: '25px',
              borderRadius: '20px',
              marginBottom: '40px',
              background: 'rgba(0, 255, 255, 0.05)',
              border: '1px solid rgba(0, 247, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>Your Mood</p>
                <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={results.query}>
                  {results.emoji} {results.query.length > 30 ? results.query.substring(0, 30) + '...' : results.query}
                </h3>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>Suggested Genre</p>
                <h3 style={{ color: 'var(--accent-cyan)', margin: 0, fontSize: '1.1rem' }}>{results.genre}</h3>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>Energy Level</p>
                <h3 style={{ color: 'var(--accent-purple)', margin: 0, fontSize: '1.1rem' }}>{results.energy}</h3>
              </div>
            </div>
            
            <div className="track-grid responsive-grid" style={{
              marginBottom: '40px'
            }}>
              {currentSongs.map((song, idx) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <SongCard
                    track={song}
                    onPlay={() => onPlay(song, results.songs)}
                    isCurrent={currentTrack?.id === song.id}
                    isPlaying={isPlaying}
                    isFavorite={isFavorite(song.id)}
                    toggleFavorite={() => toggleFavorite(song)}
                    playlists={playlists}
                    addToPlaylist={(playlistId) => addToPlaylist(playlistId, song)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '20px', 
                paddingBottom: '60px' 
              }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                  className="glass-panel"
                  style={{
                    padding: '12px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : 'var(--accent-cyan)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChevronLeft size={24} />
                </motion.button>

                <div style={{ 
                  color: 'var(--text-secondary)', 
                  fontFamily: 'Orbitron', 
                  fontSize: '0.9rem',
                  letterSpacing: '2px',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  PAGE <span style={{ color: 'var(--accent-cyan)' }}>{currentPage}</span> OF {totalPages}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                  className="glass-panel"
                  style={{
                    padding: '12px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : 'var(--accent-cyan)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AiMood;
