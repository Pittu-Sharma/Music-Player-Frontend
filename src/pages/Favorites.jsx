import React from 'react';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SongCard from '../components/SongCard';

const Favorites = ({ favorites, onPlay, currentTrack, isPlaying, toggleFavorite, isFavorite, playlists, addToPlaylist }) => {
  return (
    <div className="favorites-page">
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Heart fill="var(--accent-cyan)" color="var(--accent-cyan)" />
        Your Favorite Music !
      </h2>

      {favorites.length > 0 ? (
        <div className="track-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          {favorites.map((track) => (
            <SongCard
              key={track.id}
              track={track}
              onPlay={(t) => onPlay(t, favorites)}
              isPlaying={isPlaying}
              isCurrent={currentTrack?.id === track.id}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite(track.id)}
              playlists={playlists}
              addToPlaylist={addToPlaylist}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
          <Heart size={64} opacity={0.2} style={{ marginBottom: '16px' }} />
          <p>Your library is empty. Discover new tracks in the Browse section!</p>
          <Link to="/" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'inline-block', marginTop: '16px' }}>
            Explore Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
