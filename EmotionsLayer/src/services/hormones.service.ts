import {Request, Response} from "express";

export const HormonesService = {
    getHormones: async () => {
        try {
            console.log("Fetching hormones");
        } catch (error) {
            console.log(error);
        }
    },
    updateHormones: async (newData: any) => {
        try {
            console.log("Updating hormones");
        } catch (error) {
            console.log(error);
        }
    }
}