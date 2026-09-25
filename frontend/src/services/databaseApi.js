/**
 * AuraCast: MongoDB Database API Service (React Service)
 */

export const DatabaseAPI = {
  /**
   * Get server & MongoDB connection health
   */
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (err) {
      return { status: 'offline', database: { connected: false } };
    }
  },

  /**
   * Get all favorites saved in MongoDB
   */
  async getFavorites() {
    try {
      const res = await fetch('/api/favorites');
      if (!res.ok) throw new Error('Failed to fetch favorites');
      return await res.json();
    } catch (err) {
      console.warn('Error fetching favorites:', err);
      return [];
    }
  },

  /**
   * Add a location to MongoDB favorites
   */
  async addFavorite(favoriteData) {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(favoriteData)
    });
    if (!res.ok && res.status !== 409) {
      throw new Error(`Failed to add favorite (${res.status})`);
    }
    return await res.json();
  },

  /**
   * Remove a favorite by ID
   */
  async removeFavorite(id) {
    const res = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove favorite');
    return await res.json();
  },

  /**
   * Fetch recent mood logs from MongoDB
   */
  async getMoodLogs() {
    try {
      const res = await fetch('/api/mood-logs');
      if (!res.ok) throw new Error('Failed to fetch mood logs');
      return await res.json();
    } catch (err) {
      console.warn('Error fetching mood logs:', err);
      return [];
    }
  },

  /**
   * Save a mood log entry to MongoDB
   */
  async addMoodLog(logData) {
    const res = await fetch('/api/mood-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
    if (!res.ok) throw new Error('Failed to save mood log');
    return await res.json();
  },

  /**
   * Delete a mood log entry by ID
   */
  async removeMoodLog(id) {
    const res = await fetch(`/api/mood-logs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete mood log');
    return await res.json();
  }
};
