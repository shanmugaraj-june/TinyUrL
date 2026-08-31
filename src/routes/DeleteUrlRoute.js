
const express = require("express") ;  
const urlController = require("../controllers/UrlController")
const route  = express.Router() ;  

route.delete("/:shortCode" , urlController.deleteUrlController) ;

module.exports = route ;