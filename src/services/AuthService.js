const bcrypt = require("bcryptjs");  
const jwt = require("jsonwebtoken") ;
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

const loginUser = async (email  , password ) => {
    const user = await UserModel.findOne({email}) ; 
    if(!user){
      throw new AppError("Invalid email or password",401 );
    } 
    const isPasswordValid = await bcrypt.compare(password , user.password) ;
    if(!isPasswordValid) {
        throw new AppError("Invalid email or password",401 );
    }  

  const token  = jwt.sign(
    {userId : user._id} , 
    process.env.JWT_SECRET, 
    {
        expiresIn : process.env.JWT_EXPIRES_IN
    }
  ) ; 
  return token ;


}

module.exports = {registerUser , loginUser}