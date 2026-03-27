import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Dummy API call for login
const dummyLoginAPI = (email, password, role) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Demo credentials
      const validCredentials = {
        'owner@spotlo.com': { password: 'owner123', role: 'owner', name: 'Raj Kumar' },
        'customer@spotlo.com': { password: 'customer123', role: 'customer', name: 'John Doe' }
      };
      
      if (validCredentials[email] && validCredentials[email].password === password && validCredentials[email].role === role) {
        resolve({
          success: true,
          token: `mock-jwt-token-${Date.now()}-${role}`,
          user: {
            id: role === 'owner' ? 'owner_001' : 'cust_001',
            name: validCredentials[email].name,
            email: email,
            role: role
          }
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800);
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const storedToken = localStorage.getItem('spotlo_token');
    const storedUser = localStorage.getItem('spotlo_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await dummyLoginAPI(email, password, role);
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('spotlo_token', response.token);
        localStorage.setItem('spotlo_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('spotlo_token');
    localStorage.removeItem('spotlo_user');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
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