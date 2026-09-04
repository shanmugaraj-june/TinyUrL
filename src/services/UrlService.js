const urlModel = require('../models/UrlModel');  
const {redisClient} = require("../config/redis")
const AppError  = require("../utils/AppError");
const counterService = require('./CounterService') ;
 const base62  = require('../utils/base62') ; 
 const createShortUrl = async (originalUrl, expiresAt , customCode , userId) => { 
    const existingUrl = await urlModel.findOne({ originalUrl });
    if (existingUrl) { 
        // if existingUser is Not ExpiresAt  
        if( !existingUrl.expiresAt||existingUrl.expiresAt.getTime() > Date.now()) {
           return existingUrl;
        } 
        // if expired  
        await urlModel.deleteOne({
            _id : existingUrl._id 
        })   
    } 
    let shortCode ; 
    if(customCode){ 
        const existingCode = await urlModel.findOne({
            shortCode: customCode
        }); 
        if (existingCode) {
            throw new AppError(
                "Custom code already exists",
                409
            );

         } 
        shortCode = customCode  ;
    } else {
        const sequenceValue = await counterService.getNextSequenceValue() ;
        shortCode = base62.encode(sequenceValue) ;
    }
    const url = new urlModel({
        originalUrl,
        shortCode,
        expiresAt ,
        user: userId
    });
    await url.save(); 

    return url;
}; 

const getOriginalUrl = async (shortCode) => { 
    const cacheKey = `url:${shortCode}` ; 
    const cachedUrl = await redisClient.get(cacheKey); 
    // cache HIT 
    if(cachedUrl) {
                console.log("Redis cache HIT");   
                await urlModel.findOneAndUpdate(
                { shortCode: shortCode },
                { $inc: { clickCount: 1 } },
                { returnDocument: "after" }
                );  
        
        return {
            originalUrl : cachedUrl 
        }
    } 
    //  cache MISS 
    console.log("Redis cache MISS");

    const url = await urlModel.findOne({
        shortCode: shortCode,
    });   

     if (!url) {
        throw new AppError("URL not found", 404);
    }

    if(url && url.expiresAt && url.expiresAt < new Date()){
        throw new AppError("URL has expired", 410) ;
    } 

    // 4. Store URL in Redis
    if(url.expiresAt){
        const ttl  = Math.floor((url.expiresAt.getTime() - Date.now()) / 1000); 
        if(ttl > 0 ){
            await redisClient.set(cacheKey , 
                url.originalUrl ,
                {
                  EX : ttl 
                }
            );
        } 
    }else{
            await redisClient.set(cacheKey , url.originalUrl) ; 
        }
    
    // 5. Increment click count
    const updatedUrl = await urlModel.findOneAndUpdate(
        { shortCode: shortCode },
        { $inc: { clickCount: 1 } },
        { returnDocument: "after" }
    );


    return updatedUrl ;
}; 

const getUrlStats = async (shortCode , userId ) => {
    const url = await urlModel.findOne({
        shortCode ,
        user : userId 
    }) ; 
    if(!url) {
       throw new AppError(
      "You are not allowed to view stats for this URL",
    403
   );
    } 
    return url ;
} 

const deleteUrl = async(shortCode , userId) => {
    const  url  = await urlModel.findOneAndDelete({
        shortCode,
        user : userId 
    }) ;  
    if(!url) {
         throw new AppError("You are not allowed to delete this URL", 403);
    } 
    const cacheKey = `url:${shortCode}`;
    await redisClient.del(cacheKey);
    return  url ;
} 

const UpdateUrl = async( shortCode , expiresAt  , userId) => {
    const url = await urlModel.findOne({
        shortCode,
        user : userId
     }) ; 
    if(!url) {
        throw new AppError("You are not allowed to update this URL", 403);
    }  
    url.expiresAt = expiresAt; 
    await url.save(); 
    const cacheKey  = `url:${shortCode}` ;
    await redisClient.del(cacheKey) ;
    return url;

} 
const  GetUrl = async (page , limit) => {
  const skip = (page - 1) * limit  ; 
  const [urls , total] = await Promise.all([
        urlModel 
            .find() 
            .sort({createdAt : -1}) 
            .skip(skip) 
            .limit(limit) ,
        urlModel.countDocuments() 
  ]) ;
    const totalPages = Math.ceil(total / limit);
    return {
        urls,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };

    return urls ;

}
module.exports = { createShortUrl , getOriginalUrl ,  getUrlStats  , deleteUrl , UpdateUrl , GetUrl} ; 