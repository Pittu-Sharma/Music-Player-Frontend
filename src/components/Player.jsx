import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Repeat, Shuffle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Player = ({ track, isPlaying, setIsPlaying, onNext, onPrev }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [fullStreamUrl, setFullStreamUrl] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [streamReady, setStreamReady] = useState(false);

  // Control play/pause based on isPlaying state, but only after stream is ready
  useEffect(() => {
    if (audioRef.current && track && streamReady) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, track, streamReady]);

  // When a new track is selected, resolve the full stream (don't play the preview)
  useEffect(() => {
    if (track) {
      setFullStreamUrl(null);
      setIsResolving(true);
      setStreamReady(false);

      // Pause any current playback immediately
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Use AbortController to cancel stale requests when clicking songs rapidly
      const abortController = new AbortController();
      
      const resolveTrack = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/music/resolve`, {
            params: {
              artist: track.artist.name,
              title: track.title
            },
            signal: abortController.signal,
            timeout: 15000
          });
          
          if (response.data.url && !abortController.signal.aborted) {
            setFullStreamUrl(response.data.url);
          } else if (!abortController.signal.aborted) {
            // No full stream found, fall back to preview for the full-song path
            setFullStreamUrl(track.preview);
          }
        } catch (error) {
          // Resolution failed, fall back to preview as last resort
          if (!abortController.signal.aborted) {
            setFullStreamUrl(track.preview);
          }
        } finally {
          if (!abortController.signal.aborted) {
            setIsResolving(false);
          }
        }
      };

      resolveTrack();
      return () => abortController.abort();
    }
  }, [track?.id]);

  // Once we have a stream URL (full or fallback), set it on the audio element and play
  useEffect(() => {
    if (fullStreamUrl && audioRef.current) {
      audioRef.current.src = fullStreamUrl;
      audioRef.current.currentTime = 0;
      setStreamReady(true);
      
      if (isPlaying) {
        audioRef.current.play().catch(e => {});
      }
    }
  }, [fullStreamUrl]);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setCurrentTime(current);
    setDuration(dur || 0);
    setProgress((current / dur) * 100 || 0);
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(newProgress);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!track) return null;

  return (
    <motion.div 
      initial={{ y: 150 }}
      animate={{ y: 0 }}
      className="player-bar glass-panel"
      style={{
        background: 'rgba(5, 5, 20, 0.75)',
        backdropFilter: 'blur(40px)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 20px 80px rgba(0,0,0,0.8)'
      }}
    >
      <audio 
        ref={audioRef}
        src={fullStreamUrl || ''}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={onNext || (() => setIsPlaying(false))}
      />

      {/* Resolution Indicator */}
      <AnimatePresence>
        {isResolving && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 247, 255, 0.1)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(0, 247, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Loader2 size={12} className="animate-spin" />
            Resolving High Fidelity Stream...
          </motion.div>
        )}
      </AnimatePresence>


      {/* Track Info */}
      <div className="track-info" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <motion.div 
            animate={{ 
              scale: isPlaying ? [1, 1.15, 1] : 1,
              opacity: isPlaying ? [0.2, 0.4, 0.2] : 0.2
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset: '-10px',
              background: 'var(--accent-cyan)',
              filter: 'blur(15px)',
              borderRadius: '50%',
              zIndex: -1
            }}
          />
          <img 
            src={track.album.cover_medium} 
            alt={track.title} 
            style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--glass-border)' }}
          />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <h4 className="neon-text" style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px', textShadow: 'none' }}>
            {track.title}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {track.artist.name}
          </p>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="controls-wrapper" style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Shuffle size={18} color="var(--text-secondary)" cursor="pointer" className="hover-glow" />
          <SkipBack size={26} color="white" cursor="pointer" onClick={onPrev} />
          
          <motion.div 
            whileHover={{ scale: 1.1, boxShadow: '0 0 25px var(--accent-cyan)' }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            style={{
              background: 'var(--accent-cyan)',
              borderRadius: '50%',
              width: '54px',
              height: '54px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#000',
              boxShadow: isPlaying ? '0 0 20px rgba(0, 247, 255, 0.4)' : 'none'
            }}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" style={{ marginLeft: '4px' }} />}
          </motion.div>

          <SkipForward size={26} color="white" cursor="pointer" onClick={onNext} />
          <Repeat size={18} color="var(--text-secondary)" cursor="pointer" className="hover-glow" />
        </div>

        <div style={{ width: '100%', maxWidth: '650px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '35px' }}>{formatTime(currentTime)}</span>
          <div style={{ position: 'relative', flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress}
              onChange={handleProgressChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                zIndex: 10
              }}
            />
            <motion.div 
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))',
                borderRadius: '10px',
                boxShadow: '0 0 10px var(--accent-cyan)'
              }} 
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '35px' }}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Details */}
      <div className="volume-control" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', minWidth: '150px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div onClick={() => setIsMuted(!isMuted)} style={{ cursor: 'pointer' }}>
            {isMuted || volume === 0 ? <VolumeX size={20} color="var(--accent-pink)" /> : <Volume2 size={20} color="var(--accent-cyan)" />}
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="volume-slider"
            style={{ width: '100px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
          />
        </div>
        <Maximize2 size={18} color="var(--text-secondary)" cursor="pointer" className="hover-glow" />
      </div>
    </motion.div>
  );
};

export default Player;
