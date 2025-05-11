import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
// This code imports the mongoose library for MongoDB object modeling and dotenv for environment variable management.


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};


export default connectDB;
// import express from 'express';