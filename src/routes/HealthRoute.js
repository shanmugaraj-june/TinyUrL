const express = require("express") ;
const UrlController  =  require("../controllers/UrlController")
const route = express.Router() ;  

route.get('/' , UrlController.healthController) ;


module.exports = route ;