import { Request, Response } from "express";

import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from "zod";
import { db } from "../../config/db.config";

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate authentication
        const userId = req.auth?.userId;
        if (!userId) {
            throw new ApiError(401, "Authentication required");
        }

        // Find the user in the database
        const user = await db.profile.findUnique({
            where: { id: userId },
        });

        // If user not found
        if (!user) {
            throw new ApiError(404, "User Not Found");
        }

        // Return success response
        res.status(200).json(new ApiResponse(200, user, "User Found"));
        return;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ApiError(
                400,
                "Validation failed",
                error.errors.map((e) => e.message) // Pass detailed validation errors
            );
        }

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Unknown error occurred:", error); // Log unknown errors
        throw new ApiError(500, "Failed to fetch a user");
    }
};
