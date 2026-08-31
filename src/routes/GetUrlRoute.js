const express = require("express") ;  
const UrlControllers  = require("../controllers/UrlController");
const route =  express.Router() ; 

route.get("/" , UrlControllers.getUrlsController) ; 

module.exports =  route ;