import api from './api';

class AuthService {
  async register(userData) {
    try {
      // Transform frontend data to backend format - EXACTLY as API expects
      const payload = {
        username: userData.username,   
        password: userData.password,    
        role: userData.role === 'owner' ? 'SHOP_OWNER' : 'CUSTOMER',
        name: userData.name,            
      };
      
      console.log('Register payload:', payload); // Debug log
      
      const response = await api.post('/auth/password/register', payload);
      console.log('Register response:', response.data);
      
      return response;
    } catch (error) {
      console.error('Register error:', error.response?.data);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const payload = {
        username: credentials.username,
        password: credentials.password,
      };
      
      console.log('Login payload:', payload);
      
      const response = await api.post('/auth/password/login', payload);
      console.log('Login response:', response.data);
      
      if (!response.data.access_token || !response.data.refresh_token) {
        throw new Error('Invalid response format from server');
      }
      
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      const user = this.decodeToken(response.data.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, ...response.data };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await api.post('/auth/password/refresh', {
        refresh_token: refreshToken,
      });
      
      const { access_token, refresh_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      
      return { access_token, refresh_token };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) return false;
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }
}

export default new AuthService();