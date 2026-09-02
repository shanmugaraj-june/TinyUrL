const asyncHandler = require("../utils/asyncHandler") ; 
const AuthService = require("../services/AuthService") ;
const registerController = asyncHandler( async(req , res ) => { 
     const {name , email , password}  = req.body ; 
     const user  = await AuthService.registerUser(name , email , password ) ; 
     return  res.status(201).json({
        success : true , 
        message : "User registered successfully",  
        data : { 
           id: user._id,
           name : user.name , 
           email : user.email 
        }
      })
} ) ; 

const loginController  = asyncHandler(async (req , res) => { 
    const {email , password}  = req.body ; 
    const token =  await AuthService.loginUser(email , password) ; 
     return res.status(200).json({
        success: true , 
        message : "Login successful",
        data : {
            token 
        } 
     })
})
module.exports = {registerController  , loginController} ;