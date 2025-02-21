import express, {Express}   from "express";
// import {DB}                 from "./src/config/database";
import cors                 from "cors";

//Routes
// import authRoutes                from "./src/routes/auth.routes";

require("dotenv").config();
const app: Express = express();

console.log("Motor Functions Layer Started");

// const corsOptions = {
//     origin: process.env.NODE_ENV === "production" 
//         ? `https://${process.env.DOMAIN}`
//         : ["http://localhost:3000", "http://localhost:3001"], 
//     methods: "GET, POST, PUT, PATCH, DELETE",
//     allowedHeaders: [
//         "Content-Type",
//         "Authorization",
//         "Accept",
//         "Content-Disposition"
//     ],
//     exposedHeaders: [
//         "Content-Type",
//         "Authorization",
//         "Content-Disposition"
//     ],
//     credentials: true
// };

// Middleware
// app.use(express.json());
// app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: true }));

// Database Connection
const connectDB = async () => {
    try {
        // await DB.initialize();
        // console.log("Database connected successfully");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

// Routes
// app.use("/api/", funcName);
// app.use("/api/", funcName);

app.listen({ port: process.env.SERVER_PORT || 8082 }, () => {
    connectDB();
    const memoryUsage = process.memoryUsage();
    console.log(`-----------------------------------`);
    console.info(`Motor Functions Layer is running on port ${process.env.SERVER_PORT || 8082}`);
    console.info(`Heap Total: ${memoryUsage.heapTotal} - Heap Used: ${memoryUsage.heapUsed}`);
    console.log(`-----------------------------------`);
});