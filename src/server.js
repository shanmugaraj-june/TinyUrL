require("dotenv").config();
const app  = require("./app") ; 
const {connectDB , mongoose}  = require("./config/db") ;
const PORT = process.env.PORT || 3000 ; 
let server;
const startServer = async() => {
    try{ 
        await  connectDB() ;
        server = app.listen(PORT , () => {
          console.log(`Server is running on port ${PORT}`) ; 
       }) 
    }catch(err) {
         console.error("Failed to start server");
         process.exit(1);
    }
}

startServer(); 

process.on("SIGINT", async () => {
    console.log("Shutting down server...");

    try {
        // 1. Stop accepting new HTTP requests
        if (server) {
            server.close(() => {
                console.log("HTTP server closed");
            });
        }

        // 2. Close MongoDB
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log("MongoDB connection closed");
        }

        // 3. Exit
        process.exit(0);

    } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
    }
});
