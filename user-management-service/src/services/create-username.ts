import { z } from "zod";
import { ApiError } from "../utils/ApiError.util";
import * as sernam from "sernam"; 

const options = {
    symbols: true,
    numbers: true,
};

export const createUsername = (firstname: string) => {
    try {
        const sn = new sernam.default(options); // Ensure correct initialization
        let username = sn.generateOne(firstname);
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
