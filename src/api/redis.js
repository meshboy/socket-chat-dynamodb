import bluebird from "bluebird";
import redis from "redis";

bluebird.promisifyAll(redis);

export const RedisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
});
