const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL,

    socket: {
        reconnectStrategy: (retries) => {
            console.log(`Redis reconnect attempt: ${retries}`);
            return Math.min(retries * 500, 5000);
        }
    }
});

redisClient.on("error", () => {
    console.error("Redis connection unavailable");
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (err) {
        console.error("Redis unavailable. Starting without Redis...");
    }
};

module.exports = {
    redisClient,
    connectRedis
};