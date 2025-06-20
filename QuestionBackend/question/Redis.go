package question

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)


func SetCache(rdb *redis.Client, key string, value any, expiration time.Duration, ctx context.Context) error {
	return rdb.Set(ctx, key, value, expiration).Err()
}

func GetCache(rdb *redis.Client, key string, ctx context.Context) (string, error) {
	val, err := rdb.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", nil // key does not exist
	}
	return val, err
}
