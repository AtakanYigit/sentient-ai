import { DB } from "../config/database";
import { Context } from "../entities/Context";
import { LessThan } from "typeorm";

const contextRepository = DB.getRepository(Context);

export const cleanOldContexts = async () => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        await contextRepository.delete({
            createdAt: LessThan(fiveMinutesAgo)
        });
        
        console.log("Cleaned contexts older than 5 minutes");
    } catch (error) {
        console.error("Error cleaning old contexts in MemoriesLayer/src/utils/cleanOldContexts.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
    }
};
