const Redis = require('ioredis');

let redisClient = null;
let isRedisConnected = false;

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

if (process.env.REDIS_URL || process.env.NODE_ENV === 'production') {
    try {
        redisClient = new Redis(REDIS_URL, {
            maxRetriesPerRequest: 1,
            showFriendlyErrorStack: true,
            retryStrategy(times) {
                if (times > 3) {
                    console.log('⚠️ Redis: Connection retries exhausted. Fallback cache deactivated.');
                    return null; // Stop retrying
                }
                return Math.min(times * 1000, 3000); // Wait 1s, 2s, 3s
            }
        });

        redisClient.on('connect', () => {
            console.log('✅ Connected to Redis cache');
            isRedisConnected = true;
        });

        redisClient.on('error', (err) => {
            console.log('⚠️ Redis Connection Error:', err.message);
            isRedisConnected = false;
        });
    } catch (e) {
        console.log('⚠️ Redis Client Initialization Failed:', e.message);
    }
}

// Caching middleware helper
const cacheMiddleware = (durationSec = 300) => {
    return async (req, res, next) => {
        if (!isRedisConnected || !redisClient) {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;
        try {
            const cachedData = await redisClient.get(key);
            if (cachedData) {
                console.log(`⚡ Cache Hit for key: ${key}`);
                return res.json(JSON.parse(cachedData));
            }
            
            // Intercept res.json to save the response in Redis before sending
            res.originalJson = res.json;
            res.json = (body) => {
                redisClient.setex(key, durationSec, JSON.stringify(body))
                    .catch(err => console.log('Redis save error:', err.message));
                res.originalJson(body);
            };
            next();
        } catch (error) {
            console.log('Cache Middleware Error:', error.message);
            next();
        }
    };
};

// Clear cache helper (clears all keys starting with cache:properties)
const clearCache = async (pattern = 'cache:*') => {
    if (!isRedisConnected || !redisClient) return;
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(...keys);
            console.log(`🧹 Cleared Redis Cache for keys: ${keys.join(', ')}`);
        }
    } catch (error) {
        console.log('Redis Cache Clear Error:', error.message);
    }
};

module.exports = { redisClient, cacheMiddleware, clearCache, isRedisConnected: () => isRedisConnected };
