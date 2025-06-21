import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await authService.getCurrentUser();
        setCurrentUser(data);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await authService.login(credentials);
      setCurrentUser(data);
      setError(null);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authService.register(userData);
      setError(null);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar usuario');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isAdmin = () => currentUser?.rol === 'ADMIN';
  const isStaff = () => currentUser?.rol === 'STAFF' || currentUser?.rol === 'ADMIN';
  const isAuthenticated = () => !!currentUser;

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
    error,
    isAdmin,
    isStaff,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;