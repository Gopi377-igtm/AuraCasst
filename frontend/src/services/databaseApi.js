/**
 * AuraCast: MongoDB Database & JWT Authentication API Service
 * Handles registration, login, JWT token persistence, favorites, and mood reflections.
 * Automatically adapts between localhost, Render, and Vercel deployments.
 */

// Dynamically resolve backend endpoint
const getBaseUrl = () => {
  // If explicitly provided via Vite environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  // When frontend is hosted on Vercel, direct requests to Render backend
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://auracasst.onrender.com';
  }

  // Same origin (localhost dev proxy or Render serving frontend)
  return '';
};

const BASE_URL = getBaseUrl();

export const DatabaseAPI = {
  // --- TOKEN UTILITIES ---
  getToken() {
    return localStorage.getItem('auracast_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('auracast_token', token);
    } else {
      localStorage.removeItem('auracast_token');
    }
  },

  getAuthHeaders() {
    const token = this.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  },

  // --- AUTHENTICATION (JWT) ---
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  /**
   * Login with email and password
   */
  async login({ email, password }) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  /**
   * Fetch current user profile using saved JWT
   */
  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) {
        // Token invalid or expired
        this.setToken(null);
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch (err) {
      console.warn('Failed to verify user token:', err);
      return null;
    }
  },

  /**
   * Logout user and clear stored JWT
   */
  logout() {
    this.setToken(null);
    localStorage.removeItem('auracast_user');
  },

  // --- HEALTH & STATUS ---
  async getHealth() {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (err) {
      return { status: 'offline', database: { connected: false } };
    }
  },

  // --- FAVORITES (MongoDB + Auth) ---
  async getFavorites() {
    try {
      const res = await fetch(`${BASE_URL}/api/favorites`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch favorites');
      return await res.json();
    } catch (err) {
      console.warn('Error fetching favorites:', err);
      return [];
    }
  },

  async addFavorite(favoriteData) {
    const res = await fetch(`${BASE_URL}/api/favorites`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(favoriteData)
    });
    if (!res.ok && res.status !== 409) {
      const err = await res.json();
      throw new Error(err.error || `Failed to add favorite (${res.status})`);
    }
    return await res.json();
  },

  async removeFavorite(id) {
    const res = await fetch(`${BASE_URL}/api/favorites/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to remove favorite');
    return await res.json();
  },

  // --- MOOD JOURNAL (MongoDB + Auth) ---
  async getMoodLogs() {
    try {
      const res = await fetch(`${BASE_URL}/api/mood-logs`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch mood logs');
      return await res.json();
    } catch (err) {
      console.warn('Error fetching mood logs:', err);
      return [];
    }
  },

  async addMoodLog(logData) {
    const res = await fetch(`${BASE_URL}/api/mood-logs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(logData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save mood log');
    }
    return await res.json();
  },

  async removeMoodLog(id) {
    const res = await fetch(`${BASE_URL}/api/mood-logs/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete mood log');
    return await res.json();
  }
};
