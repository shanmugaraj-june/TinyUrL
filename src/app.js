const express = require("express"); 
const createUrlRoute  = require("./routes/CreateUrlRoute") ; 
const RedirectUrlRoute = require("./routes/RedirectUrlRoute") ;  
const UrlStatsRoute = require("./routes/UrlStatsRoute") ; 
const deleteUrlRoute  = require("./routes/DeleteUrlRoute") ; 
const UpdateUrlRoute = require("./routes/UpdateUrlRoute") ;  
const GetUrlRoute = require("./routes/GetUrlRoute");
const errorMiddleware = require("./middleware/errorMiddleware") ;
const logger = require("./middleware/LoggerMiddler");
const db  = require("./config/db") ;
const app = express(); 

//middlewares
app.use(express.json()) ;  

//middlewares  
app.use(logger);


//routes  createURl 
// API routes
app.use("/api/url", createUrlRoute);
app.use("/api/url", UrlStatsRoute); 
app.use("/api/url" ,  GetUrlRoute);

// Public short URL redirect
app.use("/", RedirectUrlRoute);   

// delete Url  
app.use("/api/url" , deleteUrlRoute) ; 

// update Url  
app.use("/api/url" , UpdateUrlRoute) ;
// error Middleware ; 
app.use(errorMiddleware) ;




module.exports = app;