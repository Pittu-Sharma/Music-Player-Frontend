import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Loader } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(username, email, password);
    setLoading(false);
    if (res.success) {
      showToast(`Welcome, ${username}! 🎵`, 'success', 4000);
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-panel"
        style={{
          padding: '44px 40px',
          width: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '80px', height: '80px',
          background: 'var(--accent-purple)', filter: 'blur(50px)', opacity: 0.25,
        }} />
        <div style={{
          position: 'absolute', bottom: '-20px', left: '-20px',
          width: '60px', height: '60px',
          background: 'var(--accent-cyan)', filter: 'blur(40px)', opacity: 0.15,
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 30px rgba(157, 0, 255, 0.4)',
            }}
          >
            <User size={30} color="white" />
          </motion.div>
          <h2 className="neon-text" style={{
            color: 'var(--accent-purple)',
            textShadow: '0 0 12px rgba(157, 0, 255, 0.5)',
            fontSize: '1.5rem', letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            Fill Details
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
            Join Music-Player
          </p>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 75, 75, 0.1)',
                border: '1px solid rgba(255, 75, 75, 0.35)',
                color: '#ff7070',
                fontSize: '0.83rem',
                textAlign: 'center',
                lineHeight: '1.4',
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Username */}
          <div style={{ position: 'relative' }}>
            <User size={17} color="var(--accent-purple)" style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: '100%',
                padding: '13px 14px 13px 44px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(157,0,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {/* Email */}
          <div style={{ position: 'relative' }}>
            <Mail size={17} color="var(--accent-purple)" style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'
            }} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '13px 14px 13px 44px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(157,0,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={17} color="var(--accent-purple)" style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'
            }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              style={{
                width: '100%',
                padding: '13px 14px 13px 44px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(157,0,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="glow-btn"
            style={{
              width: '100%',
              marginTop: '6px',
              border: '1px solid var(--accent-purple)',
              color: loading ? 'rgba(157,0,255,0.5)' : 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                >
                  <Loader size={16} />
                </motion.div>
                Creating…
              </>
            ) : (
              'Create Identity'
            )}
          </motion.button>
        </form>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Already have a Legacy?{' '}
          <Link to="/login" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '600' }}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
