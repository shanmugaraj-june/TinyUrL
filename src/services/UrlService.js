const urlModel = require('../models/UrlModel');  
const AppError  = require("../utils/AppError");
const counterService = require('./CounterService') ;
 const base62  = require('../utils/base62') ; 
 const createShortUrl = async (originalUrl, expiresAt , customCode) => { 
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
        const shortCode = base62.encode(sequenceValue) ;
    }
    const url = new urlModel({
        originalUrl,
        shortCode,
        expiresAt
    });
    await url.save(); 

    return url;
}; 

const getOriginalUrl = async (shortCode) => {
    const url = await urlModel.findOne({
        shortCode: shortCode,
    });   

     if (!url) {
        throw new AppError("URL not found", 404);
    }

    if(url && url.expiresAt && url.expiresAt < new Date()){
        throw new AppError("URL has expired", 410) ;
    } 

    const updatedUrl = await urlModel.findOneAndUpdate(
        { shortCode: shortCode },
        { $inc: { clickCount: 1 } },
        { returnDocument: "after" }
    );


    return updatedUrl ;
}; 

const getUrlStats = async (shortCode) => {
    const url = await urlModel.findOne({shortCode}) ; 
    if(!url) {
        throw new AppError("URL not found" , 404) ;
    } 
    return url ;
} 

const deleteUrl = async(shortCode) => {
    const  url  = await urlModel.findOneAndDelete({shortCode}) ;  
    if(!url) {
        throw new AppError("URL not found" , 404) ;
    }
    return  url ;
} 

const UpdateUrl = async( shortCode , expiresAt) => {
    const url = await urlModel.findOne({shortCode}) ; 
    if(!url) {
        throw new AppError("URL not found" , 404) ;
    }  
    url.expiresAt = expiresAt;
    await url.save();
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