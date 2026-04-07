import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search as SearchIcon, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import SongCard from '../components/SongCard';

const Search = ({ query, onPlay, currentTrack, isPlaying, toggleFavorite, isFavorite }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      const delaySearch = setTimeout(() => {
        handleSearch(query);
      }, 500); // 500ms debounce for live search

      return () => clearTimeout(delaySearch);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = async (q) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/music/search?q=${encodeURIComponent(q)}`);
      setResults(response.data.data || []);
    } catch (error) {
      console.error('Error in search:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-results">
      <h2 style={{ marginBottom: '24px' }}>
        {query ? `Results for "${query}"` : "Discover Your Favorite Music"}
      </h2>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Music size={40} color="var(--accent-cyan)" />
          </motion.div>
        </div>
      ) : results.length > 0 ? (
        <div className="track-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          {results.map((track) => (
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
      ) : query && !loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
          <SearchIcon size={64} opacity={0.2} style={{ marginBottom: '16px' }} />
          <p>We couldn't find any tracks matching your search.</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
          <SearchIcon size={64} opacity={0.2} style={{ marginBottom: '16px' }} />
          <p>Start typing above to search the galaxy for music.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
