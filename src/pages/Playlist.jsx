import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Music, Play, Trash2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import SongCard from '../components/SongCard';

const Playlist = ({ playlists, onPlay, currentTrack, isPlaying, toggleFavorite, isFavorite, removeFromPlaylist, deletePlaylist }) => {
  const { id } = useParams();
  const playlist = playlists.find(p => String(p._id) === String(id));

  if (!playlist) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>Playlist not found</h2>
        <Link to="/" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'inline-block', marginTop: '16px' }}>
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="playlist-page">
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: '24px', 
        marginBottom: '48px',
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        border: '1px solid var(--glass-border)'
      }}>
        <div style={{ 
          width: '200px', 
          height: '200px', 
          background: 'linear-gradient(45deg, var(--accent-purple), var(--accent-cyan))',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <Music size={80} color="white" />
        </div>
        
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)' }}>
            Playlist
          </span>
          <h1 style={{ fontSize: '3rem', margin: '8px 0', color: 'white' }}>{playlist.name}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{playlist.description || "No description provided."}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="glow-btn"
              style={{ padding: '12px 32px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => playlist.tracks.length > 0 && onPlay(playlist.tracks[0], playlist.tracks)}
            >
              <Play size={20} fill="currentColor" /> Play All
            </button>
            
            <button 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                padding: '12px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => {
                if(window.confirm('Are you sure you want to delete this playlist?')) {
                  deletePlaylist(id);
                }
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {playlist.tracks.length > 0 ? (
        <div className="track-grid responsive-grid" style={{}}>
          {playlist.tracks.map((track) => (
            <div key={track.id} style={{ position: 'relative' }}>
               <SongCard
                track={track}
                onPlay={(t) => onPlay(t, playlist.tracks)}
                isPlaying={isPlaying}
                isCurrent={currentTrack?.id === track.id}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite(track.id)}
              />
              <button 
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  zIndex: 10,
                  color: '#fa5252'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromPlaylist(id, track.id);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
          <p>This playlist is empty. Add some tracks!</p>
        </div>
      )}
    </div>
  );
};

export default Playlist;
