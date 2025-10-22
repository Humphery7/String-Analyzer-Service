import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = (url)=>{
    return mongoose.connect(url).then(()=>{console.log("Connection to DB successful")});
};

export default connectDB;
