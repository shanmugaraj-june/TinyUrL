const express = require("express") ;  
const UrlController  = require("../controllers/UrlController") ;
const validateUrl = require("../middleware/validateUrl") ;
const route = express.Router() ; 

route.patch("/:shortCode" ,validateUrl , UrlController.UpadateController )

module.exports = route ; 
 