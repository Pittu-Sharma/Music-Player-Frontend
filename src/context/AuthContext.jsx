import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pittu_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('pittu_token', token);
      // For a real app, you might want to fetch the user profile here
      // const savedUser = JSON.parse(localStorage.getItem('pittu_user'));
      // if (savedUser) setUser(savedUser);
    } else {
      localStorage.removeItem('pittu_token');
      localStorage.removeItem('pittu_user');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('pittu_user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      if (!error.response) {
        return { success: false, message: 'Cannot connect to server. Make sure the backend is running.' };
      }
      return { success: false, message: error.response.data?.message || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('pittu_user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      if (!error.response) {
        return { success: false, message: 'Cannot connect to server. Make sure the backend is running.' };
      }
      return { success: false, message: error.response.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
