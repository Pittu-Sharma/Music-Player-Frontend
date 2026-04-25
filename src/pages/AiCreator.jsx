import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, Music, Wand2 } from 'lucide-react';

const AiCreator = () => {
  const [formData, setFormData] = useState({
    theme: '',
    voice: '',
    genre: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = React.useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.theme || !formData.voice || !formData.genre) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/ai/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate song');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again or check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }

    if (!result) return;

    // If we already have the audio generated, just play it
    if (audioUrl) {
      setIsPlaying(true);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      audioRef.current.onended = () => setIsPlaying(false);
      return;
    }

    // Generate real AI audio
    setIsGeneratingAudio(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: formData.theme,
          voice: formData.voice,
          genre: formData.genre,
          lyrics: result.lyrics
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to generate real AI audio');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      setIsPlaying(true);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => setIsPlaying(false);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="neon-text"
            style={{ fontSize: '3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}
          >
            <Wand2 size={40} color="var(--accent-cyan)" />
            AI Song Creator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}
          >
            Generate a complete song concept, title, and lyrics instantly using AI.
          </motion.p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <motion.form 
          onSubmit={handleCreate}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel"
          style={{
            padding: '30px',
            borderRadius: '20px',
            flex: '1',
            minWidth: '350px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Song Theme / Topic</label>
            <input
              type="text"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              placeholder="e.g., A journey through space, lost love..."
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontFamily: 'Outfit'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Voice Type / Style</label>
            <input
              type="text"
              name="voice"
              value={formData.voice}
              onChange={handleChange}
              placeholder="e.g., Deep male raspy, ethereal female..."
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontFamily: 'Outfit'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="e.g., Synthwave, Acoustic Indie, Cyberpunk..."
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontFamily: 'Outfit'
              }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="glow-btn"
            disabled={loading}
            style={{ 
              marginTop: '10px',
              padding: '15px', 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center', 
              gap: '10px',
              fontSize: '1.1rem',
              width: '100%'
            }}
          >
            {loading ? <Loader className="spin" /> : <Music />}
            {loading ? 'Producing...' : 'Generate Song'}
          </button>
        </motion.form>

        <div style={{ flex: '2', minWidth: '400px' }}>
          {error && (
            <div style={{ color: '#ff4444', background: 'rgba(255, 68, 68, 0.1)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel"
              style={{
                padding: '40px',
                borderRadius: '20px',
                background: 'rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 className="neon-text" style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{result.title}</h2>
                  <p style={{ color: 'var(--accent-purple)', fontSize: '1.2rem' }}>By {result.artist}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={handlePlaySong}
                      className="glow-btn"
                      disabled={isGeneratingAudio}
                      style={{ 
                        padding: '15px 30px', 
                        background: isPlaying ? 'var(--accent-pink)' : 'transparent',
                        borderColor: isPlaying ? 'var(--accent-pink)' : 'var(--accent-cyan)',
                        color: isPlaying ? 'white' : 'var(--accent-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      {isGeneratingAudio ? <Loader className="spin" size={20} /> : (isPlaying ? <Music /> : <Wand2 />)}
                      {isGeneratingAudio ? 'GENERATING AUDIO...' : (isPlaying ? 'PLAY AI COMPOSITION' : 'PRODUCE AI MUSIC')}
                    </button>
                    
                    {!isGeneratingAudio && result && (
                      <a 
                        href={`https://suno.com/create`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glow-btn"
                        style={{ 
                          padding: '15px 25px', 
                          borderColor: 'var(--accent-purple)',
                          color: 'var(--accent-purple)',
                          background: 'rgba(168, 85, 247, 0.1)',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <Music size={18} />
                        GENERATE STUDIO SONG (OPENS IN SUNO)
                      </a>
                    )}
                  </div>
                  
                  {!isGeneratingAudio && result && (
                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-secondary)', 
                      margin: '0',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      borderLeft: '3px solid var(--accent-purple)'
                    }}>
                      <strong>💡 Pro Tip:</strong> For real Bollywood singing with clear Hindi lyrics, click the "Studio Song" button. You will be redirected to Suno with your generated concept.
                    </p>
                  )}
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                  "{result.description}"
                </p>
              </div>

              <div>
                <h3 style={{ marginBottom: '15px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Lyrics Preview
                </h3>
                <div style={{ 
                  fontFamily: 'Outfit', 
                  color: 'white', 
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}>
                  {result.lyrics.split('\n').map((line, idx) => {
                    return (
                      <p 
                        key={idx}
                        style={{ 
                          marginBottom: '5px',
                          opacity: line.startsWith('[') ? 0.5 : 1,
                        }}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiCreator;
