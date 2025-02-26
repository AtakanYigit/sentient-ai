import express, {Express} from "express";
import {DB}               from "./src/config/database";
import speechRoutes       from "./src/routes/speech";

require("dotenv").config({ path: '../.env' });
const app: Express = express();

// Middleware
app.use(express.json());

// Database Connection
const connectDB = async () => {
    try {
        await DB.initialize();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

// Routes
app.use("/api/speech", speechRoutes);

app.listen({ port: process.env.MOTOR_FUNCTIONS_LAYER_PORT }, () => {
    connectDB();
    console.info(`Motor Functions Layer Started. Running on port ${process.env.MOTOR_FUNCTIONS_LAYER_PORT}`);
});