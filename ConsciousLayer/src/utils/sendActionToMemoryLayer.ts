import axios from "axios";

const sendActionToMemoryLayer = async (action: string, type: string) => {
    try {
        const response = await axios.post(`http://localhost:${process.env.MEMORIES_LAYER_PORT}/api/memories`, {action: action, type: type});
    } catch (error) {
        console.error("Error sending action to memory layer in ConsciousLayer/src/utils/sendActionToMemoryLayer.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
    }
};

export default sendActionToMemoryLayer;
