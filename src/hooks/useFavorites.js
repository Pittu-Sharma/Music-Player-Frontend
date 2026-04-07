import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useFavorites = () => {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pittu_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch from backend if logged in
  useEffect(() => {
    const fetchBackendFavorites = async () => {
      if (token) {
        try {
          const { data } = await axios.get('http://localhost:5000/api/favorites', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFavorites(data.favorites); // Backend returns full objects now
        } catch (error) {
          console.error('Error fetching favorites from backend:', error.message);
        }
      }
    };
    fetchBackendFavorites();
  }, [token]);

  useEffect(() => {
    localStorage.setItem('pittu_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = async (track) => {
    const isFav = favorites.some(f => String(f.id) === String(track.id));
    
    // Optimistic UI update
    if (isFav) {
      setFavorites(favorites.filter(f => String(f.id) !== String(track.id)));
    } else {
      setFavorites([...favorites, track]);
    }

    // Backend sync if logged in
    if (token) {
      try {
        await axios.post('http://localhost:5000/api/favorites/toggle', 
          { track },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error syncing favorite with backend:', error.message);
      }
    }
  };

  const isFavorite = (trackId) => {
    return favorites.some(f => f.id === trackId || String(f.id) === String(trackId));
  };

  return { favorites, isFavorite, toggleFavorite };
};

export default useFavorites;
