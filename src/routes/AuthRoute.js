const express = require("express") ; 
const AuthController = require("../controllers/AuthController")
const route = express.Router()  ;  


route.post("/register" ,  AuthController.registerController) ;

module.exports = route ;