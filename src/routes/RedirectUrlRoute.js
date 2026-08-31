const  express = require('express') ;  
const UrlController = require('../controllers/UrlController') ; 
const route = express.Router() ; 

route.get("/:shortCode" , UrlController.redirectUrlController) ;

module.exports = route ;