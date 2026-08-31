const validateCreateUrl  = (req , res , next) => {
   const { originalUrl , expiresAt , customCode } = req.body ; 
    if(!originalUrl || typeof originalUrl !== 'string' || !originalUrl.trim()) {
        return res.status(400).json({
            success: false,
            message: "Invalid original URL"
        });
    } 
    if(customCode) {
         if ( typeof customCode !== "string" || !/^[a-zA-Z0-9_-]+$/.test(customCode)){
            return res.status(400).json({
            success: false,
            message: "Invalid custom code"
        });
       }
    }
    try{
       new URL(originalUrl) ;
    }catch(err){
         return res.status(400).json({
            success: false,
            message: "Please provide a valid URL"
        });
    } 

    //  check if expiresAt is provided and is a valid date 
    if(expiresAt) {
       const expiresDate = new Date(expiresAt) ; 

       if(isNaN(expiresDate.getTime())) {
          return res.status(400).json({
            success : false, 
            message  : "Invalid expiresAt date format"
          })
       } 

       if(expiresDate.getTime() <= Date.now()){
          return res.status(400).json({
            success : false, 
            message  : "expiresAt date must be in the future"
          })
       }

    }
    next();
}; 


module.exports =  validateCreateUrl  ;