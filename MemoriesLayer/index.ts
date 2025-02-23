// import "reflect-metadata"
import express, {Express}   from "express";
import {DB}                 from "./src/config/database";

//Routes
import memoriesRoutes       from "./src/routes/memories.routes";
import { cleanShortTermMemory } from "./src/utils/cleanShortTermMemory";
import { checkLongTermMemory } from "./src/utils/checkLongTermMemory";
import { cleanOldContexts } from "./src/utils/cleanOldContexts";

require("dotenv").config();
const app: Express = express();

console.log("Memories Layer Started");

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
app.use("/api/memories", memoriesRoutes);

app.listen({ port: process.env.SERVER_PORT || 8081 }, () => {
    connectDB();
    const memoryUsage = process.memoryUsage();
    console.log(`-----------------------------------`);
    console.info(`Memories Layer is running on port ${process.env.SERVER_PORT || 8081}`);
    console.info(`Heap Total: ${memoryUsage.heapTotal} - Heap Used: ${memoryUsage.heapUsed}`);
    console.log(`-----------------------------------`);
    
    setInterval(checkLongTermMemory, 3600000); // Hourly
    setInterval(cleanShortTermMemory, 30000); // Every 30 seconds
    setInterval(cleanOldContexts, 120000); // Every 2 Minutes
});