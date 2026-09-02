const epxress =  require("express") ;  
const UrlController = require("../controllers/UrlController"); 
const {authMiddleware} = require("../middleware/authMiddleware");
const route = epxress.Router() ;  

route.get("/:shortCode/stats" 
    ,authMiddleware
    , UrlController.getUrlStatsController )

module.exports = route ;