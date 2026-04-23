package com.smartbooking.config;

import java.time.Duration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    @SuppressWarnings("null")
    public CacheManager cacheManager(ObjectProvider<RedisConnectionFactory> redisConnectionFactoryProvider,
                                     @Value("${app.cache.redis-enabled:false}") boolean redisEnabled) {
        if (!redisEnabled) {
            return new ConcurrentMapCacheManager("recommendations");
        }

        RedisConnectionFactory redisConnectionFactory = redisConnectionFactoryProvider.getIfAvailable();
        if (redisConnectionFactory == null) {
            return new ConcurrentMapCacheManager("recommendations");
        }

        RedisCacheConfiguration defaults = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(15))
            .disableCachingNullValues();

        return RedisCacheManager.builder(redisConnectionFactory)
            .cacheDefaults(defaults)
            .build();
    }
}
