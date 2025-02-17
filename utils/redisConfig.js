const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST ,
    port: process.env.REDIS_PORT 
  }
});

redisClient.on("connect", () => console.log("Connected to Redis..."));
redisClient.on("error", (err) => console.error("Redis Connection Failed:", err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
