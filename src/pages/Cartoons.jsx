import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Play, Info, Star, Clock, Loader2, ChevronRight } from 'lucide-react';

// Local Assets for reliability
import tomAndJerryThumb from '../assets/cartoons/tom_and_jerry.png';
import oggyThumb from '../assets/cartoons/oggy.png';
import ben10Thumb from '../assets/cartoons/ben10.png';
import doraemonThumb from '../assets/cartoons/doraemon.png';
import mrBeanThumb from '../assets/cartoons/mr_bean.png';
import shinChanThumb from '../assets/cartoons/shin_chan.jpg';
import motuPatluThumb from '../assets/cartoons/motu_patlu.jpg';
import ninjaHattoriThumb from '../assets/cartoons/ninja_hattori.jpg';
import pakdamPakadaiThumb from '../assets/cartoons/pakdam_pakadai.jpg';
import chhotaBheemThumb from '../assets/cartoons/chhota_bheem.jpg';
import rollNo21Thumb from '../assets/cartoons/roll_no_21.jpg';
import peppaPigThumb from '../assets/cartoons/peppa_pig.jpg';
import shaunTheSheepThumb from '../assets/cartoons/shaun_the_sheep.jpg';
import grizzyThumb from '../assets/cartoons/grizzy.jpg';

// Helper to generate a high-fidelity Signature Edition SVG poster
const getPosterDataURI = (title, color1, color2, iconType) => {
  const icons = {
    shuriken: '<path d="M200 150 L220 200 L270 200 L230 230 L250 280 L200 250 L150 280 L170 230 L130 200 L180 200 Z" fill="rgba(255,255,255,0.8)" />',
    samosa: '<path d="M200 180 L240 250 L160 250 Z" fill="rgba(255,255,255,0.8)" /><circle cx="200" cy="225" r="10" fill="rgba(0,0,0,0.2)" />',
    mace: '<rect x="195" y="240" width="10" height="60" fill="rgba(255,255,255,0.6)" /><circle cx="200" cy="210" r="35" fill="rgba(255,255,255,0.8)" /><path d="M180 210 L220 210 M200 190 L200 230" stroke="rgba(0,0,0,0.2)" stroke-width="4"/>',
    flute: '<rect x="150" y="220" width="100" height="12" rx="6" fill="rgba(255,255,255,0.8)" /><circle cx="170" cy="226" r="3" fill="rgba(0,0,0,0.3)" /><circle cx="190" cy="226" r="3" fill="rgba(0,0,0,0.3)" /><circle cx="210" cy="226" r="3" fill="rgba(0,0,0,0.3)" />',
    pig: '<circle cx="200" cy="220" r="40" fill="rgba(255,255,255,0.8)" /><circle cx="185" cy="210" r="5" fill="#000" /><circle cx="215" cy="210" r="5" fill="#000" /><ellipse cx="200" cy="235" rx="15" ry="10" fill="rgba(255,255,255,1)" stroke="rgba(255,0,0,0.2)" />',
    bolt: '<path d="M210 160 L180 230 L210 230 L190 300 L230 210 L195 210 Z" fill="rgba(255,255,255,0.8)" />',
    sheep: '<circle cx="200" cy="220" r="45" fill="rgba(255,255,255,0.8)" /><circle cx="180" cy="220" r="15" fill="rgba(255,255,255,0.9)" /><circle cx="220" cy="220" r="15" fill="rgba(255,255,255,0.9)" /><path d="M185 220 Q200 230 215 220" stroke="#000" fill="none" />',
    bear: '<circle cx="200" cy="220" r="40" fill="rgba(255,255,255,0.8)" /><circle cx="175" cy="195" r="12" fill="rgba(255,255,255,0.8)" /><circle cx="225" cy="195" r="12" fill="rgba(255,255,255,0.8)" /><circle cx="190" cy="215" r="4" fill="#000" /><circle cx="210" cy="215" r="4" fill="#000" />',
    crayon: '<rect x="190" y="180" width="20" height="80" rx="4" fill="rgba(255,255,255,0.8)" /><path d="M190 180 L200 160 L210 180 Z" fill="rgba(255,255,255,1)" />'
  };

  const svg = `
    <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="400" height="500" fill="url(#grad)" />
      <rect width="400" height="500" fill="rgba(0,0,0,0.1)" />
      
      <g filter="url(#glow)">
        ${icons[iconType] || icons.bolt}
      </g>

      <text x="50%" y="380" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="28" font-weight="900" fill="white" style="text-transform:uppercase;letter-spacing:2px">
        ${title}
      </text>
      <text x="50%" y="415" text-anchor="middle" font-family="Outfit, sans-serif" font-size="12" fill="rgba(255,255,255,0.7)" style="letter-spacing:6px;text-transform:uppercase">
        Signature Series
      </text>
      <rect x="150" y="450" width="100" height="2" fill="white" rx="1" opacity="0.3" />
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const CARTOONS = [
  {
    id: 'oO8V-N64eZg',
    title: 'Tom and Jerry',
    thumbnail: tomAndJerryThumb,
    description: 'The legendary cat and mouse duo in their classic chase adventures.',
    year: '1940s',
    rating: '9.8'
  },
  {
    id: 'k6itL_H6v_0',
    title: 'Oggy and the Cockroaches',
    thumbnail: oggyThumb,
    description: 'Oggy is a blue cat who just wants to live in peace, but three cockroaches have other plans.',
    year: '1998',
    rating: '9.2'
  },
  {
    id: 'pf81znCwXLU',
    title: 'Ben 10',
    thumbnail: ben10Thumb,
    description: 'Ben Tennyson finds a mysterious alien watch that allows him to transform into 10 different aliens.',
    year: '2005',
    rating: '9.5'
  },
  {
    id: 'B3mSreB0c8o',
    title: 'Doraemon',
    thumbnail: doraemonThumb,
    description: 'A robotic cat from the future travels back in time to aid a young boy named Nobita.',
    year: '1979',
    rating: '9.6'
  },
  {
    id: 'O6_U9vT5fRE',
    title: 'Shin Chan',
    thumbnail: getPosterDataURI('Shin Chan', '#FF4B2B', '#FF416C', 'crayon'),
    description: 'Follow the life of Shinnosuke "Shin" Nohara, a young boy with a unique perspective on life.',
    year: '1992',
    rating: '9.4'
  },
  {
    id: 'oOnLg-X8yYI',
    title: 'Mr Bean Cartoon',
    thumbnail: mrBeanThumb,
    description: 'The animated adventures of the awkward but lovable Mr. Bean.',
    year: '2002',
    rating: '9.3'
  },
  {
    id: '6vYV2GndZcE',
    title: 'Motu Patlu',
    thumbnail: getPosterDataURI('Motu Patlu', '#f83600', '#f9d423', 'samosa'),
    description: 'Two friends living in Furfuri Nagar get into hilarious situations.',
    year: '2012',
    rating: '9.0'
  },
  {
    id: 't0n097oWX8w',
    title: 'Ninja Hattori',
    thumbnail: getPosterDataURI('Ninja Hattori', '#000428', '#004e92', 'shuriken'),
    description: 'A ninja comes from the Iga mountains to help a young boy named Kenichi.',
    year: '1981',
    rating: '9.4'
  },
  {
    id: 'k6itL_H6v_0',
    title: 'Pakdam Pakadai',
    thumbnail: getPosterDataURI('Pakdam Pakadai', '#1D2B64', '#F8CDDA', 'bolt'),
    description: 'Doggy Don is a friendly dog, but he is constantly annoyed by three cockroaches.',
    year: '2013',
    rating: '8.8'
  },
  {
    id: '6V97E7M-j_Y',
    title: 'Chhota Bheem',
    thumbnail: getPosterDataURI('Chhota Bheem', '#FF5F6D', '#FFC371', 'mace'),
    description: 'Bheem is an extremely strong boy who lives in the village of Dholakpur.',
    year: '2008',
    rating: '9.1'
  },
  {
    id: 'H4_v9I_qU_I',
    title: 'Roll No 21',
    thumbnail: getPosterDataURI('Roll No 21', '#11998e', '#38ef7d', 'flute'),
    description: 'Kris, a reincarnation of Lord Krishna, battles Kanishk, the reincarnation of Kansa.',
    year: '2010',
    rating: '8.9'
  },
  {
    id: '9l7Oun66W8s',
    title: 'Peppa Pig',
    thumbnail: getPosterDataURI('Peppa Pig', '#FFD1FF', '#FAE1FF', 'pig'),
    description: 'Peppa is a lovable, cheeky little piggy who lives with her little brother George, Mummy Pig and Daddy Pig.',
    year: '2004',
    rating: '8.5'
  },
  {
    id: 'oOnLg-X8yYI',
    title: 'Shaun the Sheep',
    thumbnail: getPosterDataURI('Shaun the Sheep', '#485563', '#29323c', 'sheep'),
    description: 'Shaun, a remarkably clever sheep, leads his flock into countless adventures at Mossy Bottom Farm.',
    year: '2007',
    rating: '9.3'
  },
  {
    id: 'uO2MbeI9VwM',
    title: 'Grizzy and the Lemmings',
    thumbnail: getPosterDataURI('Grizzy', '#6a3093', '#a044ff', 'bear'),
    description: 'A bear named Grizzy has to deal with a group of troublesome lemmings in a forest ranger house.',
    year: '2016',
    rating: '9.2'
  }
];

const ShowCard = ({ show, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={() => onSelect(show)}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: 'rgba(20, 20, 30, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
        <img 
          src={imgError ? getPosterDataURI(show.title, '#1e1e2e', '#2a2a40') : show.thumbnail} 
          alt={show.title} 
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(0, 247, 255, 0.8)',
          backdropFilter: 'blur(5px)',
          color: '#000',
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '0.65rem',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          boxShadow: '0 4px 15px rgba(0, 247, 255, 0.3)'
        }}>
          100 EPISODES
        </div>
      </div>
      <div style={{ padding: '15px', textAlign: 'center' }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '0.95rem', 
          color: 'white', 
          fontWeight: '600',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {show.title}
        </h4>
      </div>
    </motion.div>
  );
};

const VideoModal = ({ show, episodes, loading, onClose, activeEpisode, onEpisodeSelect }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.95)',
      backdropFilter: 'blur(15px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '1400px',
        height: '90vh',
        position: 'relative',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)',
        display: 'grid',
        gridTemplateColumns: '1fr 400px'
      }}
    >
      {/* Player Area */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
          {loading ? (
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${show.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <Loader2 className="animate-spin" size={48} color="var(--accent-cyan)" />
              <p style={{ marginTop: '20px', color: 'white', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                Initializing Toon Galaxy...
              </p>
            </div>
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeEpisode?.id}?autoplay=1&rel=0`}
              title={activeEpisode?.title || show.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
        <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: 'white' }}>
            {activeEpisode?.title || show.title}
          </h2>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <span style={{ color: 'gold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={20} fill="gold" /> {show.rating}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>Release: {show.year}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {show.description}
          </p>
        </div>
      </div>

      {/* Episode List Area */}
      <div style={{ 
        borderLeft: '1px solid var(--glass-border)', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
            Episodes
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
          {loading ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', color: 'var(--text-secondary)' }}>
              <Loader2 className="animate-spin" size={32} color="var(--accent-cyan)" />
              <span>Fetching released episodes...</span>
            </div>
          ) : episodes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {episodes.map((ep, idx) => {
                const isPlaying = activeEpisode?.id === ep.id || (!activeEpisode && idx === 0);
                return (
                  <motion.div
                    key={ep.id}
                    whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
                    onClick={() => onEpisodeSelect(ep)}
                    style={{
                      padding: '12px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '12px',
                      background: isPlaying ? 'rgba(0, 247, 255, 0.08)' : 'transparent',
                      border: isPlaying ? '1px solid rgba(0, 247, 255, 0.2)' : '1px solid transparent',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ width: '100px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={ep.thumbnail || `https://img.youtube.com/vi/${ep.id}/mqdefault.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '0.85rem', 
                        color: isPlaying ? 'var(--accent-cyan)' : 'white',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {ep.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Ep {idx + 1}</span>
                        {isPlaying && <div style={{ width: '4px', height: '4px', background: 'var(--accent-cyan)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-cyan)' }} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <p>No episodes found or backend unreachable.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>Make sure your server is running on port 5000.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const Cartoons = () => {
  const [activeShow, setActiveShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (activeShow) {
      const fetchEpisodes = async () => {
        setLoadingEpisodes(true);
        setEpisodes([]);
        setActiveEpisode(null);
        try {
          const res = await axios.get(`http://localhost:5000/api/music/cartoon-episodes`, {
            params: { query: activeShow.title },
            timeout: 20000 // Increased timeout for yt-dlp
          });
          if (res.data && res.data.data && res.data.data.length > 0) {
            setEpisodes(res.data.data);
            setActiveEpisode(res.data.data[0]);
          } else {
            // Fallback: If API returns empty, use the main show ID as the fallback episode
            setEpisodes([{ id: activeShow.id, title: activeShow.title, thumbnail: activeShow.thumbnail }]);
            setActiveEpisode({ id: activeShow.id, title: activeShow.title });
          }
        } catch (err) {
          console.error('Error fetching episodes:', err);
          // Fallback on error
          setEpisodes([{ id: activeShow.id, title: activeShow.title, thumbnail: activeShow.thumbnail }]);
          setActiveEpisode({ id: activeShow.id, title: activeShow.title });
        } finally {
          setLoadingEpisodes(false);
        }
      };
      fetchEpisodes();
    }
  }, [activeShow]);

  const filteredCartoons = CARTOONS.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cartoons-container" style={{ padding: '0 20px 100px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '900',
          background: 'linear-gradient(to right, #00f7ff, #0099ff, #9d00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '15px',
          letterSpacing: '-1px'
        }}>
          Cartoon Universe
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px' }}>
          Your favorite animated shows, all in one place.
        </p>

        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <SearchIcon style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--accent-cyan)'
          }} size={20} />
          <input
            type="text"
            placeholder="Search shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '18px 20px 18px 60px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}
            className="cartoon-search-input"
          />
        </div>
      </header>

      <div className="responsive-grid" style={{
        padding: '20px'
      }}>
        {filteredCartoons.map((cartoon) => (
          <ShowCard 
            key={cartoon.id} 
            show={cartoon} 
            onSelect={setActiveShow} 
          />
        ))}
      </div>

      <AnimatePresence>
        {activeShow && (
          <VideoModal 
            show={activeShow} 
            episodes={episodes}
            loading={loadingEpisodes}
            activeEpisode={activeEpisode}
            onEpisodeSelect={setActiveEpisode}
            onClose={() => {
              setActiveShow(null);
              setEpisodes([]);
            }} 
          />
        )}
      </AnimatePresence>

      <style>{`
        .cartoon-search-input:focus {
          border-color: var(--accent-cyan);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 20px rgba(0, 247, 255, 0.15);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Cartoons;
