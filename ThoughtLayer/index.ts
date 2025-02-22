// import "reflect-metadata"
import express, {Express}   from "express";
import {DB}                 from "./src/config/database";

//Routes
import thoughtRoutes       from "./src/routes/thought.routes";

require("dotenv").config();
const app: Express = express();

console.log("Thought Layer Started");

// Middleware
app.use(express.json());


// Database Connection
const connectDB = async () => {
    try {
        await DB.initialize();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

// Routes
app.use("/api/think", thoughtRoutes);

app.listen({ port: process.env.SERVER_PORT || 8083 }, () => {
    connectDB();
    const memoryUsage = process.memoryUsage();
    console.log(`-----------------------------------`);
    console.info(`Motor Functions Layer is running on port ${process.env.SERVER_PORT || 8083}`);
    console.info(`Heap Total: ${memoryUsage.heapTotal} - Heap Used: ${memoryUsage.heapUsed}`);
    console.log(`-----------------------------------`);
});