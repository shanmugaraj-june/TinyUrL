const epxress =  require("express") ;  
const UrlController = require("../controllers/UrlController")
const route = epxress.Router() ;  

route.get("/:shortCode/stats" , UrlController.getUrlStatsController )

module.exports = route ;