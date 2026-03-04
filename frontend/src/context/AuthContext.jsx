import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a user in localStorage on mount
    const storedUser = localStorage.getItem('magneto_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('magneto_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, error: 'Respuesta inválida del servidor' };
    } catch (error) {
      console.error('Error on login:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error de conexión con el servidor' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('magneto_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
