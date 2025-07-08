class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultDuration = 5 * 60 * 1000; // 5 minutes
  }

  async get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  async set(key, data, duration = this.defaultDuration) {
    const expiresAt = Date.now() + duration;
    
    this.cache.set(key, {
      data,
      expiresAt
    });

    return true;
  }

  async delete(key) {
    return this.cache.delete(key);
  }

  async clear() {
    this.cache.clear();
    return true;
  }

  async has(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Check if item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        expiredEntries++;
        this.cache.delete(key);
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: validEntries + expiredEntries,
      validEntries,
      expiredEntries,
      cacheSize: this.cache.size
    };
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }
}

const cacheService = new CacheService();

// Set up periodic cleanup
setInterval(() => {
  cacheService.cleanup();
}, 60 * 1000); // Clean up every minute

module.exports = { cacheService }; 