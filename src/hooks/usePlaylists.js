import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const usePlaylists = () => {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = async () => {
    // JWT tokens are always long. This avoids calls with "null", "undefined", or empty strings.
    if (!token || typeof token !== 'string' || token.length < 20) return;
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/playlists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data && data.playlists) {
        setPlaylists(data.playlists);
      }
    } catch (error) {
      // Only log error if it's not a 401
      if (error.response?.status !== 401) {
        console.error('Error fetching playlists:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [token]);

  const createPlaylist = async (name, description = '') => {
    if (!token) return null;
    try {
      const { data } = await axios.post('http://localhost:5000/api/playlists', 
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlaylists([...playlists, data.playlist]);
      return { success: true, playlist: data.playlist };
    } catch (error) {
      console.error('Error creating playlist:', error.message);
      return { success: false, error: error.message };
    }
  };

  const addToPlaylist = async (playlistId, track) => {
    if (!token) return false;
    try {
      await axios.post(`http://localhost:5000/api/playlists/${playlistId}/add`, 
        { track },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setPlaylists(playlists.map(p => {
        if (String(p._id) === String(playlistId)) {
          return { ...p, tracks: [...p.tracks, track] };
        }
        return p;
      }));
      return true;
    } catch (error) {
      console.error('Error adding track to playlist:', error.message);
      return false;
    }
  };

  const removeFromPlaylist = async (playlistId, trackId) => {
    if (!token) return false;
    try {
      await axios.delete(`http://localhost:5000/api/playlists/${playlistId}/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      setPlaylists(playlists.map(p => {
        if (String(p._id) === String(playlistId)) {
          return { ...p, tracks: p.tracks.filter(t => String(t.id) !== String(trackId)) };
        }
        return p;
      }));
      return true;
    } catch (error) {
      console.error('Error removing track from playlist:', error.message);
      return false;
    }
  };

  const deletePlaylist = async (playlistId) => {
    if (!token) return false;
    try {
      await axios.delete(`http://localhost:5000/api/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(playlists.filter(p => String(p._id) !== String(playlistId)));
      return true;
    } catch (error) {
      console.error('Error deleting playlist:', error.message);
      return false;
    }
  };

  return { 
    playlists, 
    loading, 
    createPlaylist, 
    addToPlaylist, 
    removeFromPlaylist, 
    deletePlaylist,
    refreshPlaylists: fetchPlaylists 
  };
};

export default usePlaylists;
