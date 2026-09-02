const jwt = require("jsonwebtoken") ;
const AppError = require("../utils/AppError")
const authMiddleware = async(req , res , next) => {
    try{ 
        const authHeader = req.headers.authorization  ; 
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Authentication required", 401);
        }
        const token  = authHeader.split(" ")[1]  ;
        if(!token){
            throw new AppError("Authentication required"  , 401 ) ;
        } 
        const decoded = jwt.verify(token , process.env.JWT_SECRET) ; 
        req.user = decoded ; 
        next() ;

    }catch(err) {
        next(err) ;
    }
}; 

module.exports = {authMiddleware} ;