const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { redisClient } = require("../config/redis");

const createUrlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 10,

    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

module.exports = createUrlLimiter;