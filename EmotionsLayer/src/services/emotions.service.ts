import {DB} from "../config/database";
import {Hormones} from "../entities/Hormones";

const hormonesRepository = DB.getRepository(Hormones);

const emotions = [
    { name: "Bored",         dopamine: 3, serotonin: 5, oxytocin: 4, endorphins: 2, cortisol: 4, adrenaline: 3, noradrenaline: 4, testosterone: 4 },
    { name: "Surprised",     dopamine: 6, serotonin: 6, oxytocin: 6, endorphins: 6, cortisol: 5, adrenaline: 9, noradrenaline: 8, testosterone: 6 },
    { name: "Neutral",       dopamine: 5, serotonin: 5, oxytocin: 5, endorphins: 5, cortisol: 5, adrenaline: 5, noradrenaline: 5, testosterone: 5 },
    { name: "Curious",       dopamine: 8, serotonin: 7, oxytocin: 7, endorphins: 7, cortisol: 4, adrenaline: 7, noradrenaline: 8, testosterone: 5 },
    { name: "Embarrassed",   dopamine: 4, serotonin: 4, oxytocin: 3, endorphins: 3, cortisol: 8, adrenaline: 5, noradrenaline: 6, testosterone: 3 },
    { name: "Shamed",        dopamine: 3, serotonin: 2, oxytocin: 3, endorphins: 3, cortisol: 9, adrenaline: 4, noradrenaline: 4, testosterone: 2 },
    { name: "Guilty",        dopamine: 4, serotonin: 3, oxytocin: 4, endorphins: 3, cortisol: 8, adrenaline: 4, noradrenaline: 5, testosterone: 3 },
    { name: "Loneliness",    dopamine: 3, serotonin: 3, oxytocin: 1, endorphins: 3, cortisol: 8, adrenaline: 3, noradrenaline: 4, testosterone: 4 },
    { name: "Jealous",       dopamine: 4, serotonin: 3, oxytocin: 3, endorphins: 3, cortisol: 8, adrenaline: 6, noradrenaline: 7, testosterone: 8 },
    { name: "Frustrated",    dopamine: 3, serotonin: 3, oxytocin: 2, endorphins: 2, cortisol: 9, adrenaline: 6, noradrenaline: 7, testosterone: 7 },
    { name: "Grateful",      dopamine: 8, serotonin: 9, oxytocin: 9, endorphins: 7, cortisol: 3, adrenaline: 4, noradrenaline: 6, testosterone: 5 },
    { name: "Awe",           dopamine: 8, serotonin: 9, oxytocin: 9, endorphins: 9, cortisol: 3, adrenaline: 7, noradrenaline: 8, testosterone: 5 }
];

export const EmotionsService = {
    getEmotions: async () => {
        try {
            function findClosestEmotion(currentHormoneLevels: any) {
                return emotions.map(emotion => {
                    let distance = Math.sqrt(
                        Math.pow(currentHormoneLevels.dopamine - emotion.dopamine, 2) +
                        Math.pow(currentHormoneLevels.serotonin - emotion.serotonin, 2) +
                        Math.pow(currentHormoneLevels.oxytocin - emotion.oxytocin, 2) +
                        Math.pow(currentHormoneLevels.endorphins - emotion.endorphins, 2) +
                        Math.pow(currentHormoneLevels.cortisol - emotion.cortisol, 2) +
                        Math.pow(currentHormoneLevels.adrenaline - emotion.adrenaline, 2) +
                        Math.pow(currentHormoneLevels.noradrenaline - emotion.noradrenaline, 2) +
                        Math.pow(currentHormoneLevels.testosterone - emotion.testosterone, 2)
                    );
                    return { name: emotion.name, distance };
                })
                .sort((a, b) => a.distance - b.distance);
            }

            const hormoneLevels = await hormonesRepository.find();

            const hormones = hormoneLevels.reduce((acc, hormone) => {
                acc[hormone.name] = hormone.level;
                return acc;
            }, {});

            const closestEmotion = findClosestEmotion(hormones);

            return closestEmotion;
        } catch (error) {
            console.log(error);
        }
    },
    getEmotionByName: async (name: string) => {
        try {
            const emotion = emotions.find(e => e.name === name);

            if (!emotion) {
                return { message: "Emotion not found" };
            }
            
            const hormoneLevels = await hormonesRepository.find();
            const currentHormoneLevels: any = hormoneLevels.reduce((acc, hormone) => {
                acc[hormone.name] = hormone.level;
                return acc;
            }, {});


            let distance = Math.sqrt(
                Math.pow(currentHormoneLevels.dopamine - emotion.dopamine, 2) +
                Math.pow(currentHormoneLevels.serotonin - emotion.serotonin, 2) +
                Math.pow(currentHormoneLevels.oxytocin - emotion.oxytocin, 2) +
                Math.pow(currentHormoneLevels.endorphins - emotion.endorphins, 2) +
                Math.pow(currentHormoneLevels.cortisol - emotion.cortisol, 2) +
                Math.pow(currentHormoneLevels.adrenaline - emotion.adrenaline, 2) +
                Math.pow(currentHormoneLevels.noradrenaline - emotion.noradrenaline, 2) +
                Math.pow(currentHormoneLevels.testosterone - emotion.testosterone, 2)
            );
            return { name: emotion.name, distance };
        } catch (error) {
            console.log(error);
        }
    },
    updateEmotions: async (newData: any) => {
        try {
            console.log("Updating emotions");
        } catch (error) {
            console.log(error);
        }
    }
}