const express = require("express") ; 
const AuthController = require("../controllers/AuthController") ; 
const {authMiddleware} = require("../middleware/authMiddleware");
const route = express.Router()  ;  

route.post("/register" ,  AuthController.registerController) ;
route.post("/login" , AuthController.loginController ) ; 

route.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
});
module.exports = route ;