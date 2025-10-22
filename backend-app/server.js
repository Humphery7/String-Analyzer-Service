import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";

dotenv.config();


const PORT = process.env.PORT || 3000;


let mongoUri = process.env.MONGO_URI;


if (mongoUri.startsWith('"') && mongoUri.endsWith('"')) {
    mongoUri = mongoUri.slice(1, -1);
}


const start = async ()=>{
    try{
        await connectDB(mongoUri);
        app.listen(PORT, ()=>{
            console.log(`Server is listening on port ${PORT}`)
        })
    }catch(error){
        console.log(error);
    }
};

start();