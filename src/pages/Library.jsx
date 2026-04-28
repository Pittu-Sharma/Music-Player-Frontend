import React from 'react';
import { User, Music, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import SongCard from '../components/SongCard';

const Library = ({ favorites, onPlay, currentTrack, isPlaying, toggleFavorite, isFavorite, playlists, addToPlaylist }) => {
  return (
    <div className="library-page">
      <div className="glass-panel" style={{
        padding: '40px',
        borderRadius: '24px',
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
        background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.1) 0%, rgba(0, 247, 255, 0.1) 100%)'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'var(--glass)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid var(--accent-cyan)',
          boxShadow: 'var(--glow-cyan)'
        }}>
          <User size={48} color="var(--accent-cyan)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Your Personalized Music Library</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back, Explorer. You have {favorites.length} tracks in your personal orbit.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Music size={24} color="var(--accent-purple)" />
          Recent Liked Tracks
        </h2>
        {favorites.length > 4 && (
          <Link to="/favorites" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.9rem' }}>
            View All
          </Link>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="track-grid responsive-grid" style={{}}>
          {favorites.slice(0, 8).map((track) => (
            <SongCard
              key={track.id}
              track={track}
              onPlay={(t) => onPlay(t, favorites.slice(0, 8))}
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
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>You haven't liked any tracks yet. Try exploring the Browse tab!</p>
        </div>
      )}
    </div>
  );
};

export default Library;
