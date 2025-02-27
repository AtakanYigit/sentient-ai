import { DB } from "../config/database";
import { Context } from "../entities/Context";
import { LessThan } from "typeorm";

const contextRepository = DB.getRepository(Context);

export const cleanOldContexts = async () => {
    try {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        
        await contextRepository.delete({
            createdAt: LessThan(oneMinuteAgo)
        });
        
        console.log("Cleaned contexts older than 1 minute");
    } catch (error) {
        console.error("Error cleaning old contexts in MemoriesLayer/src/utils/cleanOldContexts.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
    }
};
