import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { db } from "../../config/db.config";

export const deleteHub = async (req: Request, res: Response) => {
    try {
        // Validate authentication
        const userId = req.auth?.userId;
        if (!userId) {
            throw new ApiError(401, "Authentication required");
        }

        // Extract the invite code from the request
        const hubId = req.params.id;

        // Check if hub exists with the given invite code
        const hub = await db.hub.findUnique({
            where: {
                id: hubId,
                profileId: userId,
            },
        });

        if (!hub) {
            throw new ApiError(404, "Hub not found");
        }

        // Delete the hub
        const deletedHub = await db.hub.delete({
            where: {
                id: hubId,
                profileId: userId,
            },
        });

        if (!deletedHub) {
            throw new ApiError(500, "Unable to delete hub");
        }

        // Return success response
        res.status(200).json(new ApiResponse(200, deletedHub, "Hub Deleted"));
    } catch (error: any) {

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Error in deleting hub:", error); // Log unknown errors
        throw new ApiError(500, "Failed to delete hub");

    }
}
