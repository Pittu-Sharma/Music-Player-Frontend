import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, Loader } from 'lucide-react';

const Login = () => {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      showToast('Logged in successfully! 🎵', 'success', 3500);
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
        {/* Decorative glows */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '80px', height: '80px',
          background: 'var(--accent-cyan)', filter: 'blur(50px)', opacity: 0.2,
        }} />
        <div style={{
          position: 'absolute', bottom: '-20px', left: '-20px',
          width: '60px', height: '60px',
          background: 'var(--accent-purple)', filter: 'blur(40px)', opacity: 0.15,
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.35)',
            }}
          >
            <LogIn size={28} color="white" />
          </motion.div>
          <h2 className="neon-text" style={{
            fontSize: '1.5rem', letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
            Enter your Music-Player
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
          {/* Email */}
          <div style={{ position: 'relative' }}>
            <Mail size={17} color="var(--accent-cyan)" style={{
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
              onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={17} color="var(--accent-cyan)" style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'
            }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
              onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
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
                Logging in…
              </>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          New here?{' '}
          <Link to="/signup" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '600' }}>
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
