// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDatabase from "./db/databaseConn.js";

dotenv.config({
    path: './.env'
})

connectDatabase()
.then(() => {
    app.listen((process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${
            process.env.PORT }`);     
    }))
})
.catch((error) =>{
    console.log("MONGODB CONNECTION FAILED !!!", error);
})