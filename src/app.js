const express = require("express"); 
const helmet  = require("helmet") ; 
const cors  = require("cors") ;
const createUrlRoute  = require("./routes/CreateUrlRoute") ; 
const RedirectUrlRoute = require("./routes/RedirectUrlRoute") ;  
const UrlStatsRoute = require("./routes/UrlStatsRoute") ; 
const deleteUrlRoute  = require("./routes/DeleteUrlRoute") ; 
const UpdateUrlRoute = require("./routes/UpdateUrlRoute") ;  
const GetUrlRoute = require("./routes/GetUrlRoute"); 
const HealthRoute = require("./routes/HealthRoute") ; 
const AuthRoute = require("./routes/AuthRoute") ;
const errorMiddleware = require("./middleware/errorMiddleware") ; 
const logger = require("./middleware/LoggerMiddler");
const app = express(); 


//security layer  
app.use(helmet()) ; 
//add cors  
app.use(cors({
    origin: process.env.CLIENT_URL
}));

//middlewares
app.use(express.json({
    limit : "10kb"
})) ;  

//middlewares  
app.use(logger);

//routes register  
app.use("/api/auth/" , AuthRoute) ;

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

// heath check up Api  
app.use("/api/health" , HealthRoute) ;

// error Middleware ; 
app.use(errorMiddleware) ;




module.exports = app;