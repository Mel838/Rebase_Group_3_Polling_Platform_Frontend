import { useEffect, useState } from 'react';
import api from '../services/api';

const useAuth = () => {
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/auth/session');
        setHost(res.data.data.host);
      } catch (err) {
        setHost(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { host, loading };
};

export default useAuth;
