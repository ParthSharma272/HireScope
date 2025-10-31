# backend/utils/cache.py
import hashlib
import json
import logging
from functools import wraps
from typing import Optional, Any, Callable
import pickle

logger = logging.getLogger(__name__)

# In-memory cache as fallback
_memory_cache = {}

# Redis client (optional, will fallback to memory cache if not available)
_redis_client = None

def get_redis_client():
    """Get Redis client with lazy initialization"""
    global _redis_client
    if _redis_client is None:
        try:
            import redis
            _redis_client = redis.Redis(
                host='localhost',
                port=6379,
                db=0,
                decode_responses=False,  # We'll use pickle for complex objects
                socket_connect_timeout=2,
                socket_timeout=2
            )
            # Test connection
            _redis_client.ping()
            logger.info("✅ Redis cache connected")
        except Exception as e:
            logger.warning(f"⚠️ Redis not available, using memory cache: {e}")
            _redis_client = None
    return _redis_client


def generate_cache_key(prefix: str, *args, **kwargs) -> str:
    """Generate a consistent cache key from function arguments"""
    # Create a string representation of all arguments
    cache_data = {
        'args': args,
        'kwargs': sorted(kwargs.items())
    }
    cache_str = json.dumps(cache_data, sort_keys=True)
    
    # Hash it for a fixed-length key
    hash_digest = hashlib.md5(cache_str.encode()).hexdigest()
    return f"{prefix}:{hash_digest}"


def get_from_cache(key: str) -> Optional[Any]:
    """Get value from cache (Redis or memory)"""
    redis_client = get_redis_client()
    
    if redis_client:
        try:
            value = redis_client.get(key)
            if value:
                return pickle.loads(value)
        except Exception as e:
            logger.warning(f"Redis get error: {e}")
    
    # Fallback to memory cache
    return _memory_cache.get(key)


def set_in_cache(key: str, value: Any, ttl: int = 3600):
    """Set value in cache with TTL (Redis or memory)"""
    redis_client = get_redis_client()
    
    if redis_client:
        try:
            serialized = pickle.dumps(value)
            redis_client.setex(key, ttl, serialized)
            return True
        except Exception as e:
            logger.warning(f"Redis set error: {e}")
    
    # Fallback to memory cache
    _memory_cache[key] = value
    
    # Simple memory cache size limit (keep last 1000 items)
    if len(_memory_cache) > 1000:
        # Remove oldest 200 items
        for _ in range(200):
            _memory_cache.pop(next(iter(_memory_cache)))
    
    return True


def clear_cache(pattern: str = None):
    """Clear cache entries matching pattern"""
    redis_client = get_redis_client()
    
    if redis_client:
        try:
            if pattern:
                keys = redis_client.keys(f"{pattern}*")
                if keys:
                    redis_client.delete(*keys)
            else:
                redis_client.flushdb()
            logger.info(f"✅ Cache cleared: {pattern or 'all'}")
        except Exception as e:
            logger.warning(f"Redis clear error: {e}")
    
    # Clear memory cache
    if pattern:
        keys_to_delete = [k for k in _memory_cache.keys() if k.startswith(pattern)]
        for k in keys_to_delete:
            del _memory_cache[k]
    else:
        _memory_cache.clear()


def cached(prefix: str, ttl: int = 3600):
    """
    Decorator for caching function results
    
    Usage:
        @cached(prefix="keywords", ttl=3600)
        def extract_keywords(text):
            # expensive operation
            return keywords
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = generate_cache_key(prefix, *args, **kwargs)
            
            # Try to get from cache
            cached_result = get_from_cache(cache_key)
            if cached_result is not None:
                logger.debug(f"✅ Cache HIT: {prefix} - {cache_key[:16]}...")
                return cached_result
            
            # Cache miss - compute result
            logger.debug(f"⚠️ Cache MISS: {prefix} - {cache_key[:16]}...")
            result = func(*args, **kwargs)
            
            # Store in cache
            set_in_cache(cache_key, result, ttl)
            
            return result
        
        # Add cache management methods
        wrapper.clear_cache = lambda: clear_cache(prefix)
        wrapper.cache_key = lambda *args, **kwargs: generate_cache_key(prefix, *args, **kwargs)
        
        return wrapper
    return decorator


# Async version for async functions
def cached_async(prefix: str, ttl: int = 3600):
    """
    Decorator for caching async function results
    
    Usage:
        @cached_async(prefix="analysis", ttl=1800)
        async def analyze_resume(text):
            # expensive async operation
            return result
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = generate_cache_key(prefix, *args, **kwargs)
            
            # Try to get from cache
            cached_result = get_from_cache(cache_key)
            if cached_result is not None:
                logger.debug(f"✅ Cache HIT: {prefix} - {cache_key[:16]}...")
                return cached_result
            
            # Cache miss - compute result
            logger.debug(f"⚠️ Cache MISS: {prefix} - {cache_key[:16]}...")
            result = await func(*args, **kwargs)
            
            # Store in cache
            set_in_cache(cache_key, result, ttl)
            
            return result
        
        wrapper.clear_cache = lambda: clear_cache(prefix)
        wrapper.cache_key = lambda *args, **kwargs: generate_cache_key(prefix, *args, **kwargs)
        
        return wrapper
    return decorator


def get_cache_stats() -> dict:
    """Get cache statistics"""
    redis_client = get_redis_client()
    
    stats = {
        'backend': 'memory',
        'memory_items': len(_memory_cache),
        'redis_available': False
    }
    
    if redis_client:
        try:
            info = redis_client.info('stats')
            stats.update({
                'backend': 'redis',
                'redis_available': True,
                'redis_keys': redis_client.dbsize(),
                'redis_hits': info.get('keyspace_hits', 0),
                'redis_misses': info.get('keyspace_misses', 0),
                'redis_memory': redis_client.info('memory').get('used_memory_human', 'N/A')
            })
        except Exception as e:
            logger.warning(f"Redis stats error: {e}")
    
    return stats
