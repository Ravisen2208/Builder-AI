import mongoose from "mongoose"

export async function connectToDatabase(){
    mongoose.connection.on('connected',()=>{
        console.log("Succesfull connected to MongoDB.")
    })
    await mongoose.connect(process.env.MONGODB_URI)
}