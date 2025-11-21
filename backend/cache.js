// Redis Caching Layer for Performance Optimization
const redis = require('redis');

let redisClient = null;

/**
 * Initialize Redis cache connection
 */
const initCache = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = redis.createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
      }
    });
    
    redisClient.on('error', (err) => console.error('Redis error:', err));
    redisClient.on('connect', () => console.log('✓ Redis connected'));
    
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('✗ Redis connection failed:', error.message);
    console.log('Operating without cache');
    return null;
  }
};

/**
 * Cache key generator
 */
const getCacheKey = (prefix, params) => {
  const paramString = typeof params === 'object' ? JSON.stringify(params) : params;
  return `${prefix}:${paramString}`;
};

/**
 * Get value from cache
 */
const getCache = async (key) => {
  if (!redisClient) return null;
  
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

/**
 * Set value in cache with expiration
 */
const setCache = async (key, value, ttlSeconds = 3600) => {
  if (!redisClient) return false;
  
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

/**
 * Delete cache key
 */
const deleteCache = async (key) => {
  if (!redisClient) return false;
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

/**
 * Clear cache by pattern
 */
const clearCachePattern = async (pattern) => {
  if (!redisClient) return false;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

/**
 * Cache middleware for Express
 */
const cacheMiddleware = (ttl = 3600) => {
  return async (req, res, next) => {
    const cacheKey = getCacheKey('route', req.originalUrl);
    
    // Check cache
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`Cache hit: ${req.originalUrl}`);
      return res.json(cached);
    }
    
    // Store original res.json
    const originalJson = res.json.bind(res);
    
    // Override res.json to cache response
    res.json = async (data) => {
      await setCache(cacheKey, data, ttl);
      return originalJson(data);
    };
    
    next();
  };
};

/**
 * Cache statistics
 */
const getCacheStats = async () => {
  if (!redisClient) {
    return { connected: false, message: 'Redis not available' };
  }
  
  try {
    const info = await redisClient.info('stats');
    const dbSize = await redisClient.dbSize();
    
    return {
      connected: true,
      dbSize,
      info
    };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  initCache,
  getCache,
  setCache,
  deleteCache,
  clearCachePattern,
  cacheMiddleware,
  getCacheKey,
  getCacheStats,
  getRedisClient: () => redisClient
};
