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

        if (token) {
          // Token exists; verify or refresh
          if (!authService.isAuthenticated()) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              try {
                const response = await authService.refreshToken(refreshToken);
                if (!response.access_token) {
                  throw new Error('No access token after refresh');
                }
              } catch (refreshError) {
                console.error('Refresh failed:', refreshError);
                authService.logout();
                setLoading(false);
                return;
              }
            } else {
              authService.logout();
              setLoading(false);
              return;
            }
          }

          // Load profile from backend to ensure fresh role/user_id
          const profileResult = await authService.getProfile();
          if (profileResult.success) {
            const profileData = profileResult.data;
            const normalizedUser = {
              ...profileData,
              role: profileData.role === 'SHOP_OWNER' ? 'owner' : profileData.role?.toLowerCase(),
              name: profileData.username || profileData.name || '',
            };
            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          } else {
            // If profile fails, fallback to stored user for now
            if (storedUser) {
              const fallbackUser = {
                ...storedUser,
                role: storedUser.role === 'SHOP_OWNER' ? 'owner' : storedUser.role?.toLowerCase(),
                name: storedUser.username || storedUser.name || '',
              };
              setUser(fallbackUser);
              localStorage.setItem('user', JSON.stringify(fallbackUser));
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
      console.log({ username, password, role }, "Login credentials received in AuthContext");
      const response = await authService.login({ username, password, role });
      console.log('Login successful, response:', response);

      // Fetch authoritative profile from backend
      const profileResult = await authService.getProfile();
      if (!profileResult.success) {
        throw new Error(profileResult.error || 'Unable to load profile after login');
      }

      const profileData = profileResult.data;
      const normalizedUser = {
        ...profileData,
        role: profileData.role === 'SHOP_OWNER' ? 'owner' : profileData.role?.toLowerCase(),
        name: profileData.username || profileData.name || '',
      };
      setUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
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