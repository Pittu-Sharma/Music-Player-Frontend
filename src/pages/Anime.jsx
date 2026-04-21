import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Star, Loader2, Zap } from 'lucide-react';
import ReactPlayer from 'react-player';

// Helper to generate a high-fidelity Signature Edition SVG poster
const getPosterDataURI = (title, color1, color2, iconType) => {
  const icons = {
    katana: '<path d="M100 400 L300 100 M280 120 L320 80" stroke="rgba(255,255,255,0.8)" stroke-width="8" stroke-linecap="round" /><path d="M120 380 L90 410" stroke="#888" stroke-width="12" stroke-linecap="round" />',
    book: '<rect x="140" y="180" width="120" height="160" rx="4" fill="rgba(255,255,255,0.8)" /><path d="M140 210 L260 210 M140 240 L260 240 M140 270 L260 270" stroke="rgba(0,0,0,0.2)" stroke-width="2" /><text x="200" y="320" text-anchor="middle" font-size="20" font-weight="bold" fill="red">DN</text>',
    dragon: '<path d="M150 250 Q200 150 250 250 T350 250" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="10" /><circle cx="200" cy="220" r="15" fill="rgba(255,255,255,0.9)" />',
    skull: '<circle cx="200" cy="220" r="40" fill="rgba(255,255,255,0.8)" /><circle cx="185" cy="215" r="8" fill="#000" /><circle cx="215" cy="215" r="8" fill="#000" /><path d="M180 250 L220 250 M190 240 L210 240 L210 260 L190 260 Z" fill="#000" /><path d="M160 180 L240 260 M240 180 L160 260" stroke="rgba(255,255,255,0.4)" stroke-width="6" />',
    bolt: '<path d="M210 160 L180 230 L210 230 L190 300 L230 210 L195 210 Z" fill="rgba(255,255,255,0.8)" />',
    flame: '<path d="M200 150 Q160 250 200 320 Q240 250 200 150" fill="rgba(255,255,255,0.8)" /><path d="M200 200 Q180 260 200 300 Q220 260 200 200" fill="rgba(255,255,255,0.4)" />',
    spiral: '<path d="M200 240 A40 40 0 1 1 200 160 A40 40 0 1 1 200 240 Z M200 220 A20 20 0 1 0 200 180 A20 20 0 1 0 200 220 Z" fill="rgba(255,255,255,0.8)" />'
  };

  const svg = `
    <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="400" height="500" fill="url(#grad)" />
      <rect width="400" height="500" fill="rgba(0,0,0,0.2)" />
      
      <g filter="url(#glow)">
        ${icons[iconType] || icons.bolt}
      </g>
      <rect x="0" y="320" width="400" height="180" fill="rgba(0,0,0,0.4)" />

      <text x="50%" y="390" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="32" font-weight="900" fill="white" style="text-transform:uppercase;letter-spacing:2px">
        ${title}
      </text>
      <text x="50%" y="430" text-anchor="middle" font-family="Outfit, sans-serif" font-size="14" fill="rgba(255,255,255,0.7)" style="letter-spacing:8px;text-transform:uppercase">
        ANIME SERIES
      </text>
      <rect x="150" y="460" width="100" height="3" fill="var(--accent-cyan)" rx="1.5" style="filter: drop-shadow(0 0 5px var(--accent-cyan))" />
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const ANIME_LIST = [
  {
    id: 'naruto',
    title: 'Naruto Shippuden',
    thumbnail: getPosterDataURI('Naruto', '#FF4E50', '#F9D423', 'spiral'),
    description: 'Naruto Uzumaki, a hyperactive and knuckle-headed ninja, lives in Konohagakure, the Hidden Leaf village. ',
    year: '2007',
    rating: '9.5'
  },
  {
    id: 'death-note',
    title: 'Death Note',
    thumbnail: getPosterDataURI('Death Note', '#232526', '#414345', 'book'),
    description: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written in it.',
    year: '2006',
    rating: '9.8'
  },
  {
    id: 'jjk',
    title: 'Jujutsu Kaisen',
    thumbnail: getPosterDataURI('JJK', '#0f0c29', '#302b63', 'katana'),
    description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and thus exorcise himself.',
    year: '2020',
    rating: '9.6'
  },
  {
    id: 'one-piece',
    title: 'One Piece',
    thumbnail: getPosterDataURI('One Piece', '#00c6ff', '#0072ff', 'skull'),
    description: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
    year: '1999',
    rating: '9.7'
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    thumbnail: getPosterDataURI('Demon Slayer', '#ed213a', '#93291e', 'katana'),
    description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.',
    year: '2019',
    rating: '9.4'
  },
  {
    id: 'aot',
    title: 'Attack on Titan',
    thumbnail: getPosterDataURI('AOT', '#636363', '#a2abac', 'katana'),
    description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    year: '2013',
    rating: '9.5'
  },
  {
    id: 'dbz',
    title: 'Dragon Ball Z',
    thumbnail: getPosterDataURI('Dragon Ball Z', '#f83600', '#f9d423', 'dragon'),
    description: 'With the help of the powerful Dragonballs, a team of fighters led by the saiyan warrior Goku defend the planet earth from extraterrestrial enemies.',
    year: '1989',
    rating: '9.6'
  },
  {
    id: 'mha',
    title: 'My Hero Academia',
    thumbnail: getPosterDataURI('MHA', '#11998e', '#38ef7d', 'bolt'),
    description: 'A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.',
    year: '2016',
    rating: '9.0'
  },
  {
    id: 'solo-leveling',
    title: 'Solo Leveling',
    thumbnail: getPosterDataURI('Solo Lev', '#000428', '#004e92', 'bolt'),
    description: 'The weakest hunter of all mankind begins his journey to become the absolute strongest.',
    year: '2024',
    rating: '9.8'
  }
];

const ShowCard = ({ show, onSelect }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.02 }}
    onClick={() => onSelect(show)}
    style={{
      borderRadius: '24px',
      overflow: 'hidden',
      cursor: 'pointer',
      background: 'rgba(20, 20, 35, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}
  >
    <div style={{ position: 'relative', aspectRatio: '4/5' }}>
      <img src={show.thumbnail} alt={show.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        background: 'rgba(157, 0, 255, 0.9)',
        color: 'white',
        padding: '5px 12px',
        borderRadius: '10px',
        fontSize: '0.7rem',
        fontWeight: '900',
        letterSpacing: '1px'
      }}>
        ULTRA HD
      </div>
    </div>
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white', fontWeight: 'bold' }}>{show.title}</h4>
      <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{show.year}</p>
    </div>
  </motion.div>
);


const VideoModal = ({ show, episodes, loading, onClose, activeEpisode, onEpisodeSelect, resolvingStream, streamData, playerError, setPlayerError }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '40px'
    }}
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 30 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '1400px',
        height: '85vh',
        borderRadius: '40px',
        overflow: 'hidden',
        background: '#0a0a0f',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        maxHeight: '100%'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
          {(loading || resolvingStream) ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div className="loader-orbit"></div>
              <span style={{ color: 'white', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem', marginTop: '20px' }}>
                {resolvingStream ? 'Bypassing Security Manifest...' : 'Analyzing Neural Grid...'}
              </span>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {playerError ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ff4e50', gap: '15px', textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '3rem' }}>⚠️</div>
                  <h3 style={{ margin: 0, letterSpacing: '2px' }}>TRANSMISSION INTERRUPTED</h3>
                  <p style={{ opacity: 0.7, maxWidth: '400px' }}>{playerError}</p>
                  <button 
                    onClick={() => { setPlayerError(null); onEpisodeSelect(activeEpisode); }}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    RETRY LINK
                  </button>
                </div>
              ) : !streamData ? (
                <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'rgba(255,255,255,0.3)' }}>
                  NO SIGNAL DETECTED
                </div>
              ) : (
                <ReactPlayer
                  key={activeEpisode?.consumetId || activeEpisode?.id}
                  url={streamData?.headers?.Referer ? `http://localhost:5000/api/music/proxy-anime?url=${encodeURIComponent(streamData.url)}&referer=${encodeURIComponent(streamData.headers.Referer)}` : streamData?.url}
                  controls
                  width="100%"
                  height="100%"
                  playing
                  onError={(e) => setPlayerError('The neural link was severed by the provider. This mirror might be down.')}
                  config={{
                    file: {
                      forceHLS: streamData?.isM3U8 || streamData?.url?.includes('.m3u8'),
                    }
                  }}
                />
              )}
            </div>
          )}
        </div>
        <div style={{ padding: '40px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <span style={{ background: 'var(--accent-purple)', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
               EPISODE {activeEpisode?.number || activeEpisode?.id}
             </span>
             <h2 style={{ fontSize: '2.5rem', color: 'white', margin: 0 }}>{activeEpisode?.title || show.title}</h2>
          </div>
          <div style={{ display: 'flex', gap: '20px', margin: '20px 0 30px 0' }}>
            <span style={{ color: '#00f7ff', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
              <Star size={20} fill="#00f7ff" /> {show.rating}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>Studio Series • {show.year}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', fontSize: '1.1rem', maxWidth: '900px' }}>{show.description}</p>
        </div>
      </div>

      <div style={{ 
        borderLeft: '1px solid rgba(255,255,255,0.1)', 
        background: 'rgba(255,255,255,0.01)', 
        display: 'flex', 
        flexDirection: 'column',
        height: '85vh', // Force consistency with the grid height
        overflow: 'hidden' 
      }}>
        <div style={{ padding: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ margin: 0, color: 'var(--accent-cyan)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Episode Catalog</h3>
        </div>
        <div className="episode-scroll-container" style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0 // Crucial for flex scrolling in some browsers
        }}>
          {episodes.map((ep, idx) => {
            const isPlaying = activeEpisode?.number === ep.number;
            return (
              <motion.div
                key={ep.id + idx}
                whileHover={{ x: 10, background: 'rgba(255,255,255,0.05)' }}
                onClick={() => onEpisodeSelect(ep)}
                style={{
                  padding: '15px 20px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  background: isPlaying ? 'rgba(157, 0, 255, 0.1)' : 'rgba(255, 255, 255, 0)',
                  border: isPlaying ? '1px solid rgba(157, 0, 255, 0.2)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: isPlaying ? 'white' : 'rgba(255,255,255,0.8)' }}>
                    {ep.number}. {ep.title || `Episode ${ep.number}`}
                  </h4>
                  {isPlaying && <div style={{ width: '8px', height: '8px', background: 'var(--accent-cyan)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-cyan)' }}></div>}
                </div>
                {ep.isFiller && <span style={{ fontSize: '0.7rem', color: '#ff4e50', textTransform: 'uppercase', letterSpacing: '1px' }}>Filler</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const Anime = () => {
  const [activeShow, setActiveShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolvingStream, setResolvingStream] = useState(false);
  const [playerError, setPlayerError] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (activeShow) {
      const fetchEpisodes = async () => {
        setLoading(true);
        setEpisodes([]);
        setStreamData(null);
        try {
          const res = await axios.get(`http://localhost:5000/api/music/anime-episodes`, {
            params: { query: activeShow.title }
          });
          const eps = res.data.data;
          const meta = res.data.meta;
          
          if (meta) {
            setActiveShow(prev => ({ ...prev, ...meta }));
          }
          setEpisodes(eps);
          if (eps.length > 0) {
            handleEpisodeSelect(eps[0]);
          }
        } catch (err) {
          console.error('Fetch episodes failed', err);
        } finally {
          setLoading(false);
        }
      };
      fetchEpisodes();
    }
  }, [activeShow]);

  const handleEpisodeSelect = async (episode) => {
    setResolvingStream(true);
    setActiveEpisode(episode);
    setStreamData(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/music/resolve-anime`, {
        params: { animeTitle: activeShow.title, episodeNumber: episode.number || episode.id }
      });
      setStreamData(res.data);
    } catch (err) {
      console.error('Resolve stream failed', err);
    } finally {
      setResolvingStream(false);
    }
  };

  const filtered = ANIME_LIST.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ padding: '0 40px 100px 40px' }}>
      <header style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 className="neon-text" style={{ fontSize: '4rem', marginBottom: '20px' }}>Anime Galaxy</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '50px' }}>Infinite sagas, legendary warriors, one destination.</p>
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <SearchIcon style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-purple)' }} />
          <input
            type="text"
            placeholder="Search anime..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '20px 20px 20px 70px',
              color: 'white',
              fontSize: '1.1rem',
              outline: 'none'
            }}
          />
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '40px' }}>
        {filtered.map(anime => <ShowCard key={anime.id} show={anime} onSelect={setActiveShow} />)}
      </div>

      <AnimatePresence>
        {activeShow && (
          <VideoModal 
            show={activeShow} 
            episodes={episodes} 
            loading={loading} 
            resolvingStream={resolvingStream}
            streamData={streamData}
            playerError={playerError}
            setPlayerError={setPlayerError}
            activeEpisode={activeEpisode} 
            onEpisodeSelect={handleEpisodeSelect} 
            onClose={() => setActiveShow(null)} 
          />
        )}
      </AnimatePresence>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .episode-scroll-container::-webkit-scrollbar {
          width: 6px;
        }
        .episode-scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .episode-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(157, 0, 255, 0.6);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .episode-scroll-container::-webkit-scrollbar-thumb:hover {
          background: var(--accent-cyan);
        }
      `}</style>
    </div>
  );
};

export default Anime;
