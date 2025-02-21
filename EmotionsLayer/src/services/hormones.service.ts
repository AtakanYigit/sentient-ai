import {Request, Response} from "express";
import {DB} from "../config/database";
import {Hormones} from "../entities/Hormones";

const hormonesRepository = DB.getRepository(Hormones);

const maxHormoneLevel = 10;
const minHormoneLevel = 0;

export const HormonesService = {
    getHormones: async () => {
        try {
            console.log("Fetching hormones");
            const hormones = await hormonesRepository.find();
            return hormones;
        } catch (error) {
            console.log(error);
            return {success: false};
        }
    },
    releaseHormones: async (newHormones: any) => {
        try {
            console.log("Releasing hormones");
            const currentLevels = await hormonesRepository.find();

            const updatedLevels = currentLevels.map((hormone: any) => {
                hormone.level = Math.max(minHormoneLevel, Math.min(maxHormoneLevel, hormone.level + newHormones[hormone.name]));
                return hormone;
            });

            console.log(updatedLevels);

            await hormonesRepository.save(updatedLevels);

            return {success: true};
        } catch (error) {
            console.log(error);
            return {success: false};
        }
    }
}