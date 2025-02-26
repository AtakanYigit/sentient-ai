import {DB}                from "../config/database";
import {ShortTermMemories} from "../entities/ShortTermMemories";
import {LessThan}          from "typeorm";
import {PastVisions}       from "../entities/PastVisions";    

const pastVisionsRepository = DB.getRepository(PastVisions);        
const shortTermMemoriesRepository = DB.getRepository(ShortTermMemories);

export const cleanShortTermMemory = async () => {
    try {
        const sixtySecondsAgo = new Date(Date.now() - 60000);
        
        await shortTermMemoriesRepository.delete({
            createdAt: LessThan(sixtySecondsAgo)
        });

        await pastVisionsRepository.delete({
            createdAt: LessThan(sixtySecondsAgo)
        });
        
        console.log("Cleaned short-term memories older than 60 seconds");
    } catch (error) {
        console.error("Error cleaning short-term memories:", error);
    }
};
