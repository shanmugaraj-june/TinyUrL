const rateLimit = require("express-rate-limit");
const createUrlLimiter =  rateLimit({
    windowMs : 15 * 60 * 1000 , 
    limit : 10 , 
    message : {
        success : false , 
        message : "Too many requests. Please try again later."
    }
}) ; 

module.exports = createUrlLimiter ; 
