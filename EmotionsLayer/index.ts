// import "reflect-metadata"
import express, {Express}   from "express";
import {DB}                 from "./src/config/database";

//Routes
import emotionsRoutes       from "./src/routes/emotions.routes";
import hormonesRoutes       from "./src/routes/hormones.routes";

require("dotenv").config({ path: '../.env' });
const app: Express = express();

// Database Connection
const connectDB = async () => {
    try {
        await DB.initialize();
    } catch (error) {
        console.error("Unable to connect to the database in EmotionsLayer/index.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
        process.exit(1);
    }
};

// Routes
app.use("/api/emotions", emotionsRoutes);
app.use("/api/hormones", hormonesRoutes);

app.listen({ port: process.env.EMOTIONS_LAYER_PORT }, () => {
    connectDB();
    console.info(`Emotions Layer Started. Running on port ${process.env.EMOTIONS_LAYER_PORT}`);
});