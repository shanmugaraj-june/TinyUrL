const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel") ; 
const AppError =  require("../utils/AppError") ;
const registerUser  = async(name , email , password) => {
   const existingEmail = await UserModel.findOne({email : email}) ; 
   if(existingEmail){
     throw new AppError("Email is already registered"  , 409) ; 
   }  
   const hashedPassword = await bcrypt.hash(password , 10) ; 
   const user  = new UserModel({
    name ,
    email , 
    password : hashedPassword 
   }) ;
   await user.save() ;
   return user ;
} 

module.exports = {registerUser}