import express, {Express} from "express";
import {DB}               from "./src/config/database";
import cors               from "cors";
import hearAndProcess     from "./src/utils/hearAndProcess";

//Routes
import sensesRoutes       from "./src/routes/senses.routes";

require("dotenv").config({ path: '../.env' });
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
    } catch (error) {
        console.error("Unable to connect to the database in SensesLayer/index.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
        process.exit(1);
    }
};

// Routes
app.use("/api/senses", sensesRoutes);

app.listen({ port: process.env.SENSES_LAYER_PORT }, () => {
    connectDB();
    console.info(`Senses Layer Started. Running on port ${process.env.SENSES_LAYER_PORT}`);

    // Continuous Listening
    // hearAndProcess();
});