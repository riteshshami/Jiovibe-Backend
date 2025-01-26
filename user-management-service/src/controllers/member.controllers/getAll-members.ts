import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { db } from "../../config/db.config";

export const getAllMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get the hub id
        const hubId = req.params.id;

        // Check if hub id is provided
        if (!hubId) {
            throw new ApiError(400, "Hub ID is required");
        }

        // Find the hub in the database and include members
        const members = await db.member.findMany({
            where: { hubId },
        });

        // If no members found
        if (!members || members?.length === 0) {
            throw new ApiError(404, "No Members Found");
        }

        // Return success response
        res.status(200).json(new ApiResponse(200, members, "Members Found"));
        return;
    } catch (error: any) {

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Error in fetching members:", error); // Log unknown errors
        throw new ApiError(500, "Failed to fetch members");
    }
}
