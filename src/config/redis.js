const {createClient } = require("redis") ;

const redisClient = createClient({
    url: process.env.REDIS_URL,

    socket: {
        reconnectStrategy: (retries) => {
            console.log(`Redis reconnect attempt: ${retries}`);

            return Math.min(retries * 500, 5000);
        }
    }
});

redisClient.on("error"  , (err) => {
     console.error("Redis Client Error:", err);
}) ; 

const connectRedis = async () => {
    try {
        await redisClient.connect() ; 
        console.log("Connected to Redis") ;
    }catch (err) {
        console.error("Redis connection failed:", err);
        throw err;
    }
}  

module.exports = {redisClient , connectRedis } ;
 