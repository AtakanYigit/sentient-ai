import express, {Express}   from "express";
import {DB}                 from "./src/config/database";

//Routes
import memoriesRoutes         from "./src/routes/memories.routes";
import {cleanShortTermMemory} from "./src/utils/cleanShortTermMemory";
import {checkLongTermMemory}  from "./src/utils/checkLongTermMemory";
import {cleanOldContexts}     from "./src/utils/cleanOldContexts";

require("dotenv").config({ path: '../.env' });
const app: Express = express();

// Middleware
app.use(express.json());

// Database Connection
const connectDB = async () => {
    try {
        await DB.initialize();
    } catch (error) {
        console.error("Unable to connect to the database in MemoriesLayer/index.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
        process.exit(1);
    }
};

// Routes
app.use("/api/memories", memoriesRoutes);

app.listen({ port: process.env.MEMORIES_LAYER_PORT }, () => {
    connectDB();
    console.info(`Memories Layer Started. Running on port ${process.env.MEMORIES_LAYER_PORT}`);

    setInterval(checkLongTermMemory, parseInt(process.env.CHECK_LONG_TERM_MEMORY_INTERVAL) || 600000);
    setInterval(cleanShortTermMemory, parseInt(process.env.CLEAN_SHORT_TERM_MEMORY_INTERVAL) || 60000);
    setInterval(cleanOldContexts, parseInt(process.env.CLEAN_OLD_CONTEXTS_INTERVAL) || 60000);
});