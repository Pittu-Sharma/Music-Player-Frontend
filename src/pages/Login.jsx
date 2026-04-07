import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Music } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel" 
        style={{
          padding: '40px',
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="auth-header" style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent-cyan)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 15px auto',
            boxShadow: 'var(--glow-cyan)'
          }}>
            <LogIn size={30} color="var(--bg)" />
          </div>
          <h2 className="neon-text">Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter to Your Music-Player</p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && <p style={{ color: 'var(--accent-pink)', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}
          
          <div className="input-group" style={{ position: 'relative' }}>
            <Mail size={18} color="var(--accent-cyan)" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="email" 
              placeholder="Enter Your Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-field"
              style={{
                width: '100%',
                padding: '12px 15px 12px 45px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                color: 'white',
                outline: 'none',
                fontFamily: 'Outfit'
              }}
            />
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <Lock size={18} color="var(--accent-cyan)" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              placeholder="Enter Your Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-field"
              style={{
                width: '100%',
                padding: '12px 15px 12px 45px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                color: 'white',
                outline: 'none',
                fontFamily: 'Outfit'
              }}
            />
          </div>

          <button type="submit" className="glow-btn" style={{ width: '100%', marginTop: '10px' }}>
            Login
          </button>
        </form>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Click here? <Link to="/signup" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Signup</Link>
        </p>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          width: '50px',
          height: '50px',
          background: 'var(--accent-cyan)',
          filter: 'blur(40px)',
          opacity: 0.3
        }} />
      </motion.div>
    </div>
  );
};

export default Login;
