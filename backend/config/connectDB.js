import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected Successfully ", connection.connection.host, connection.connection.name)
    } catch (error) {
        console.log("Failed Connecting Database", error)
        process.exit(1);
    }
}