import { DB } from "../config/database";
import { LongTermMemories } from "../entities/LongTermMemories";
import { LessThan } from "typeorm";

const longTermMemoriesRepository = DB.getRepository(LongTermMemories);

export const checkLongTermMemory = async () => {
    try {
        // Get current date and date from 2 days ago
        const now = new Date();
        const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));
        
        // Find memories that haven't been checked in the last 2 days
        const memoriesToCheck = await longTermMemoriesRepository.find({
            where: {
                lastChecked: LessThan(twoDaysAgo)
            }
        });

        if (memoriesToCheck.length === 0) {
            return;
        }

        for (const memory of memoriesToCheck) {
            // Check if memory has been accessed since last check
            const accessesSinceLastCheck = memory.totalAccesses - memory.totalAccessesLast;

            if (accessesSinceLastCheck === 0) {
                // Reduce importance level if memory hasn't been accessed
                memory.levelOfImportance--;
                
                if (memory.levelOfImportance <= 0) {
                    // Remove memory if importance level drops to 0
                    await longTermMemoriesRepository.remove(memory);
                    console.log(`Removed memory: ${memory.id} due to lack of access`);
                    continue;
                }
            }

            // Update last checked time and total accesses
            memory.lastChecked = now;
            memory.totalAccessesLast = memory.totalAccesses;

            // Save updated memory
            await longTermMemoriesRepository.save(memory);
        }

        console.log(`Checked ${memoriesToCheck.length} long-term memories`);
    } catch (error) {
        console.error("Error checking long-term memories in MemoriesLayer/src/utils/checkLongTermMemory.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
    }
};