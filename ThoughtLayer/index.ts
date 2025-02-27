import express, {Express} from "express";
import {DB}               from "./src/config/database";
import thoughtRoutes      from "./src/routes/thought.routes";

require('dotenv').config({ path: '../.env' });
const app: Express = express();

// Middleware
app.use(express.json());

// Database Connection
const connectDB = async () => {
    try {
        await DB.initialize();
    } catch (error) {
        console.error("Unable to connect to the database in ThoughtLayer/index.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
        process.exit(1);
    }
};

app.use("/api/think", thoughtRoutes);

app.listen({ port: process.env.THOUGHT_LAYER_PORT }, () => {
    connectDB();
    console.info(`Thought Layer Started. Running on port ${process.env.THOUGHT_LAYER_PORT}`);
});