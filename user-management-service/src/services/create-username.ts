import { z } from "zod";
import { ApiError } from "../utils/ApiError.util";
import * as sernam from "sernam";
import { db } from "../config/db.config";

const options = {
    symbols: true,
    numbers: true,
};

export const createUsername = async (firstname: string) => {
    try {
        const sn = new sernam.default(options);
        let username;
        let isExist;

        // Keep generating until a unique username is found
        do {
            username = sn.generateOne(firstname);
            isExist = await db.profile.findFirst({
                where: {
                    username: username,
                },
            });
        } while (isExist);

        return username;
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new ApiError(
                400,
                "Validation failed: " + error.errors.map((e) => e.message).join(", ")
            );
        }

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Error creating username:", error);
        throw new ApiError(500, "Failed to create username");
    }
};
