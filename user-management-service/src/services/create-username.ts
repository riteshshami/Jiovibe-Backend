import { z } from "zod";
import { ApiError } from "../utils/ApiError.util";

export const createUsername = (email: string) => {
    try {

    } catch (error: any) {
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
}
