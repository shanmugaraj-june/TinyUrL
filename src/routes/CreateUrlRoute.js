const  express = require('express') ;  
const UrlController = require('../controllers/UrlController') ; 
const validateCreateUrl  = require('../middleware/validateUrl') ; 
const createUrlLimiter = require("../middleware/RateLimiter")
const route = express.Router() ; 

route.post("/" ,createUrlLimiter, validateCreateUrl  , UrlController.CreateUrlController) ;  


module.exports = route ;