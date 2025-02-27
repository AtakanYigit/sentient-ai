import axios from "axios";
require("dotenv").config({ path: '../.env' });

const sendActionToMemoryLayer = async (action: string, type: string) => {
    try {
        console.log(action, type);
        await axios.post(`http://localhost:${process.env.MEMORIES_LAYER_PORT}/api/memories`, {action: action, type: type});
    } catch (error) {
        console.log("Error sending action to memory layer in SensesLayer/src/utils/sendActionTomemoryLayer.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
    }
};

export default sendActionToMemoryLayer;