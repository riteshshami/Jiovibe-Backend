import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { db } from "../../config/db.config";

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
    try {

        // Find the user in the database
        const users = await db.profile.findMany();

        // If no users found
        if (!users || users?.length === 0) {
            throw new ApiError(404, "No Users Found");
        }

        // Return success response
        res.status(200).json(new ApiResponse(200, users, "Users Found"));
    } catch (error: any) {

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Unknown error occurred:", error); // Log unknown errors
        throw new ApiError(500, "Failed to fetch a user");
    }
};
