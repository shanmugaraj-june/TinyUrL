const  express = require('express') ;  
const UrlController = require('../controllers/UrlController') ; 
const validateCreateUrl  = require('../middleware/validateUrl') ; 
const route = express.Router() ; 

route.post("/" , validateCreateUrl  , UrlController.CreateUrlController) ;  


module.exports = route ;