import React from 'react';
import { Play, Pause, Heart, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SongCard = ({ track, onPlay, isPlaying, isCurrent, toggleFavorite, isFavorite }) => {
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
        
        {/* Play Overlay */}
        <motion.div 
          onClick={() => onPlay(track)}
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

        {/* Playing Indicator */}
        {isCurrent && isPlaying && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
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
