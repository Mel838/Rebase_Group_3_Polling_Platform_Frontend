import { useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await api.post('/auth/logout');
      } catch (err) {
        console.error('Logout failed', err);
      } finally {
        navigate('/login');
      }
    };

    logout();
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
