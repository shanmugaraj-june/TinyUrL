const express = require("express") ;  
const {authMiddleware} = require("../middleware/authMiddleware");
const UrlController  = require("../controllers/UrlController") ;
const validateUpdateUrl = require("../middleware/validateUpdateUrl") ;
const route = express.Router() ; 

route.patch("/:shortCode" , 
      authMiddleware,
      validateUpdateUrl,
      UrlController.UpadateController 
 ) ;

module.exports = route ; 
 