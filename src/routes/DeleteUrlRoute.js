
const express = require("express") ;  
const {authMiddleware} = require("../middleware/authMiddleware");
const urlController = require("../controllers/UrlController")
const route  = express.Router() ;  

route.delete("/:shortCode" ,
    authMiddleware,
    urlController.deleteUrlController) ;

module.exports = route ;