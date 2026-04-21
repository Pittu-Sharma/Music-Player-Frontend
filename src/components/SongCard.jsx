import React, { useState, useRef } from 'react';
import { Play, Pause, Heart, Music, Plus, Check, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const SongCard = ({ track, onPlay, isPlaying, isCurrent, toggleFavorite, isFavorite, playlists = [], addToPlaylist }) => {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [addedStatus, setAddedStatus] = useState({}); // { playlistId: true }
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewAudioRef = useRef(null);
  const { showToast } = useToast();

  const handlePlayFullSong = (e) => {
    // Stop any active preview first
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      setIsPreviewPlaying(false);
    }
    onPlay(track);
  };

  const handlePreviewPlay = (e) => {
    e.stopPropagation();
    
    if (isPreviewPlaying) {
      // Stop preview
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.currentTime = 0;
      }
      setIsPreviewPlaying(false);
      return;
    }

    // Play preview
    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(track.preview);
      previewAudioRef.current.volume = 0.6;
      previewAudioRef.current.onended = () => setIsPreviewPlaying(false);
    } else {
      previewAudioRef.current.src = track.preview;
      previewAudioRef.current.currentTime = 0;
    }
    
    previewAudioRef.current.play().catch(() => {});
    setIsPreviewPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -12, 
        boxShadow: isCurrent 
          ? '0 20px 40px rgba(0, 247, 255, 0.4)' 
          : '0 20px 40px rgba(157, 0, 255, 0.25)',
        borderColor: isCurrent ? 'var(--accent-cyan)' : 'var(--accent-purple)'
      }}
      className="glass-panel song-card"
      style={{
        padding: '16px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isCurrent ? '2px solid var(--accent-cyan)' : '1px solid var(--glass-border)',
        overflow: 'hidden'
      }}
    >
      {/* Background Glow */}
      <AnimatePresence>
        {(isCurrent || isFavorite) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: isCurrent ? 'var(--accent-cyan)' : 'var(--accent-pink)',
              filter: 'blur(30px)',
              zIndex: 0
            }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', zIndex: 1 }}>
        <img 
          src={track.album.cover_medium} 
          alt={track.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isCurrent ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.8s ease' }}
        />
        
        {/* Play Full Song Overlay */}
        <motion.div 
          onClick={handlePlayFullSong}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(4px)',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            {isPlaying && isCurrent ? (
              <Pause size={32} fill="white" color="white" />
            ) : (
              <Play size={32} fill="white" color="white" style={{ marginLeft: '4px' }} />
            )}
          </div>
        </motion.div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(track);
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
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
            zIndex: 10
          }}
        >
          <Heart 
            size={16} 
            fill={isFavorite ? "var(--accent-pink)" : "transparent"} 
            color={isFavorite ? "var(--accent-pink)" : "white"} 
            style={{ transition: 'all 0.3s ease' }}
          />
        </button>

        {/* Add to Playlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPlaylists(!showPlaylists);
          }}
          style={{
            position: 'absolute',
            top: '48px',
            right: '10px',
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
            color: 'white'
          }}
        >
          <Plus size={16} />
        </button>

        {/* Preview Button */}
        <motion.button
          onClick={handlePreviewPlay}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          animate={isPreviewPlaying ? {
            boxShadow: [
              '0 0 8px rgba(157, 0, 255, 0.4)',
              '0 0 20px rgba(157, 0, 255, 0.8)',
              '0 0 8px rgba(157, 0, 255, 0.4)'
            ]
          } : {}}
          transition={isPreviewPlaying ? { duration: 1.5, repeat: Infinity } : {}}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: isPreviewPlaying
              ? 'linear-gradient(135deg, rgba(157, 0, 255, 0.9), rgba(255, 0, 193, 0.9))'
              : 'rgba(0,0,0,0.6)',
            border: isPreviewPlaying
              ? '1px solid rgba(157, 0, 255, 0.6)'
              : '1px solid rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
            color: 'white',
            fontSize: '0.65rem',
            fontFamily: 'Orbitron, sans-serif',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}
        >
          <Headphones size={13} />
          {isPreviewPlaying ? 'Stop' : 'Preview'}
        </motion.button>

        {/* Playlist Dropdown */}
        <AnimatePresence>
          {showPlaylists && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              style={{
                position: 'absolute',
                top: '90px',
                right: '10px',
                background: 'rgba(20, 20, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '8px',
                border: '1px solid var(--glass-border)',
                zIndex: 100,
                width: '160px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Add to playlist
              </p>
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {playlists.length > 0 ? (
                  playlists.map(p => (
                    <button
                      key={p._id}
                      onClick={async () => {
                        const success = await addToPlaylist(p._id, track);
                        if (success) {
                          setAddedStatus(prev => ({ ...prev, [p._id]: true }));
                          showToast(`Added to playlist "${p.name}"`, 'success');
                          setTimeout(() => {
                            setAddedStatus(prev => ({ ...prev, [p._id]: false }));
                            setShowPlaylists(false);
                          }, 1500);
                        } else {
                          showToast(`Failed to add or already in playlist`, 'error');
                        }
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s'
                      }}
                      className="playlist-button"
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                      {addedStatus[p._id] ? <Check size={14} color="var(--accent-cyan)" /> : <Plus size={14} opacity={0.5} />}
                    </button>
                  ))
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '8px' }}>No playlists yet.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Playing Indicator */}
        {isCurrent && isPlaying && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            gap: '3px',
            alignItems: 'flex-end',
            height: '15px'
          }}>
            {[0.5, 1, 0.7, 0.9].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }}
                transition={{ duration: 0.5 + i*0.1, repeat: Infinity }}
                style={{ width: '3px', background: 'var(--accent-cyan)', borderRadius: '1px' }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 className={isCurrent ? "neon-text" : ""} style={{ 
          fontSize: '0.95rem', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          marginBottom: '6px',
          color: isCurrent ? 'var(--accent-cyan)' : 'white'
        }}>
          {track.title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Music size={12} /> {track.artist.name}
        </p>
      </div>
    </motion.div>
  );
};

export default SongCard;
