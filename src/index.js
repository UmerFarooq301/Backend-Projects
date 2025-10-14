// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDatabase from "./db/databaseConn.js";

dotenv.config({
    path: './.env'
})

connectDatabase()