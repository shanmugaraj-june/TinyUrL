const urlService  = require('../services/UrlService') ; 
const asyncHandler = require("../utils/asyncHandler") ; 
const {mongoose} =  require("../config/db");
const AppError = require("../utils/AppError") ;
const  CreateUrlController  = asyncHandler(async (req , res) => {
        const { originalUrl , expiresAt , customCode} = req.body; 
        const userId = req.user.userId ;
        const result = await urlService.createShortUrl(originalUrl, expiresAt ,customCode , userId) ;
        const shortUrl = `${process.env.BASE_URL}/${result.shortCode}`;
        res.status(201).json({
            success: true,
            data:  {
                originalUrl: result.originalUrl,
                shortCode: result.shortCode,
                shortUrl: shortUrl,
                expiresAt: result.expiresAt
            }
        });
} )
const redirectUrlController  = asyncHandler(async(req , res ) => {
        const { shortCode } = req.params;
        const url = await urlService.getOriginalUrl(shortCode);
        return res.redirect(url.originalUrl);
} ) 

const getUrlStatsController = asyncHandler(async(req , res)  => {
      const {shortCode}  = req.params ; 
      const userId = req.user.userId ;
      const  url  = await urlService.getUrlStats(shortCode , userId); 

       return res.status(200).json({
        success : true , 
        data : {
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            clickCount: url.clickCount,
            createdAt: url.createdAt,
            expiresAt: url.expiresAt
             
        }
    })
}) 

const deleteUrlController = asyncHandler(async(req  , res) => {
      const {shortCode} = req.params ; 
      const userId = req.user.userId ; 
      const  result = await urlService.deleteUrl(shortCode , userId) ; 
      return res.status(200).json({
        success: true,
        message: "URL deleted successfully",
        data: {
            shortCode: result.shortCode
        }
    });
})  

const UpadateController = asyncHandler (async (req , res ) => {
    const {expiresAt}  = req.body  ; 
    const {shortCode} = req.params ; 
    const userId = req.user.userId 
    const updatedUrl =   await  urlService.UpdateUrl(shortCode , expiresAt  , userId) ; 
     return res.status(200).json({
        success: true,
        data: {
            originalUrl: updatedUrl.originalUrl,
            shortCode: updatedUrl.shortCode,
            expiresAt: updatedUrl.expiresAt
        }
    });

}) 

const getUrlsController =  asyncHandler( async (req , res) => {
    const page  = (req.query.page) || 1 
    const limit = (req.query.limit)  || 5

    if (page < 1) {
        throw new AppError("Page must be greater than 0", 400);
    }

    if (limit < 1 || limit > 100) {
        throw new AppError(
            "Limit must be between 1 and 100",
            400
        );
    }
    const result = await urlService.GetUrl(page , limit) ;   
    return res.json({
            success : true , 
            data : result.urls ,
            pagination : result.pagination 
    })
}); 

const healthController = asyncHandler(async (req , res)  => { 
        const isDatabaseConnected = mongoose.connection.readyState
        return res.status(isDatabaseConnected ? 200 : 504).json({
        success : isDatabaseConnected ,  
        message : isDatabaseConnected ? 
              "API is healthy"
              :"Database is not connected", 
        database : isDatabaseConnected ? 
                   "connected" 
                   :"disConnected"

       })
})

module.exports = {  
     CreateUrlController,
     redirectUrlController  , 
     getUrlStatsController ,
     deleteUrlController , 
     UpadateController , 
     getUrlsController ,
     healthController };