import axios from "axios";

const sendActionToMemoryLayer = async (action: string) => {
    try {
        const response = await axios.post(`http://localhost:${process.env.MEMORIES_LAYER_PORT}/api/`, {action: action});
    } catch (error) {
        console.log("Error sending action to memory layer.");
    }
};

export default sendActionToMemoryLayer;