import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Important: Start with true

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get user from localStorage first
        const storedUser = authService.getCurrentUser();
        const token = localStorage.getItem('access_token');
        
        if (token && storedUser) {
          // Check if token is expired
          if (authService.isAuthenticated()) {
            setUser(storedUser);
          } else {
            // Token expired, try to refresh
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              try {
                const response = await authService.refreshToken(refreshToken);
                if (response.access_token) {
                  const decodedUser = authService.decodeToken(response.access_token);
                  setUser(decodedUser);
                  localStorage.setItem('user', JSON.stringify(decodedUser));
                }
              } catch (refreshError) {
                console.error('Refresh failed:', refreshError);
                authService.logout();
              }
            } else {
              authService.logout();
            }
          }
        } else {
          // No tokens found, ensure clean state
          authService.logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setLoading(false); // Very important: Set loading to false ONLY after everything is done
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password, role) => {
    try {
      console.log({ username, password, role }, "Login credentials received in AuthContext"); // Debug log
      const response = await authService.login({ username, password,role });
      console.log('Login successful, response:', response);
      // const expectedRole = role === 'CUSTOMER' ? 'CUSTOMER' : 'SHOP_OWNER';
      // if (response.user.role !== expectedRole) {
      //   authService.logout();
      //   throw new Error(`Invalid role. Please login as ${role}`);
      // }
      
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Register error:', error);
      // Error message is already extracted in authService
      const errorMessage = error.message || "Registration failed";
      return { success: false, error: errorMessage };
    }
  };

  const verifyEmail = async (verifyData) => {
    try {
      const response = await authService.verifyEmail(verifyData);
      return { success: true };
    } catch (error) {
      console.error('Verify error:', error);
      // Error message is already extracted in authService
      const errorMessage = error.message || "Verification failed";
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('access_token') && !!user;
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyEmail,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};