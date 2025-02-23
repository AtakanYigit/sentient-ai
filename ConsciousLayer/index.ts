console.log("Conscious Layer Started");

const actions = [
    "",
    "",
    "",
    "",
    "",
];

import {OpenAI}            from "openai";
import {DB}                from "./config/database";
import {Context}           from "./src/entities/Context";
import {Vitals}            from "./src/entities/Vitals";
import axios               from "axios";

const vitalsRepository = DB.getRepository(Vitals);
const contextRepository = DB.getRepository(Context);

const openai = new OpenAI({
    baseURL: `http://localhost:${process.env.LM_SERVER_PORT}/v1`,
    apiKey: "not-needed"
});

const sendActionToMemoryLayer = async (action: string) => {
    try {
        const response = await axios.post(`http://localhost:${process.env.MEMORIES_LAYER_PORT}/api/`, {action: action});

        console.log(response.data);
    } catch (error) {
        console.error("Error sending action to memory layer:", error);
    }
};

// Start the loop
const init = async () => {
    if (!DB.isInitialized) {
        await DB.initialize();
    }

    // setInterval(fetchAndProcessContext, 30000);
};

// Initialize
init();