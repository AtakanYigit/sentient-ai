console.log("Senses Layer Started");

import express, {Express} from "express";
import {DB}               from "./src/config/database";
import cors               from "cors";
import hearAndProcess     from "./src/utils/hearAndProcess";

//Routes
import sensesRoutes       from "./src/routes/senses.routes";

require("dotenv").config();
const app: Express = express();

const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"], 
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: [
        "Content-Type",
        "Accept",
        "Content-Disposition"
    ],
    exposedHeaders: [
        "Content-Type",
        "Content-Disposition"
    ]
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

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
app.use("/api/senses", sensesRoutes);

app.listen({ port: process.env.SENSES_SERVER_PORT || 8085 }, () => {
    connectDB();
    const memoryUsage = process.memoryUsage();
    console.log(`-----------------------------------`);
    console.info(`Senses Layer is running on port ${process.env.SENSES_SERVER_PORT || 8085}`);
    console.info(`Heap Total: ${memoryUsage.heapTotal} - Heap Used: ${memoryUsage.heapUsed}`);
    console.log(`-----------------------------------`);

    // Continuous Listening
    // hearAndProcess();
});