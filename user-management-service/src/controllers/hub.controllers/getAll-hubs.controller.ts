import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { db } from "../../config/db.config";

export const getAllHubs = async (req: Request, res: Response): Promise<void> => {
    try {

        // Find the hubs in the database
        const hubs = await db.hub.findMany();

        // If no hubs found
        if (!hubs || hubs?.length === 0) {
            throw new ApiError(404, "No Hubs Found");
        }

        // Return success response
        res.status(200).json(new ApiResponse(200, hubs, "Hubs Found"));
    } catch (error: any) {

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Error in fetching hubs:", error); // Log unknown errors
        throw new ApiError(500, "Failed to fetch hubs");
    }
}
