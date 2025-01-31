import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from "zod";
import { db } from "../../config/db.config";

export const getHub = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get hubId
        const hubId = req.params.id;
        if (!hubId) {
            throw new ApiError(400, "Hub ID is required");
        }

        // Find the hub in the database and include members
        const hub = await db.hub.findUnique({
            where: { id: hubId },
            select: {
                name: true,
                imageUrl: true,
                inviteCode: true,
                profileId: true,
                profile: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        email: true,
                        username: true,
                    }
                },
            },
        });

        // If hub not found
        if (!hub) {
            throw new ApiError(404, "Hub Not Found");
        }

        // Return success response
        res.status(200).json(new ApiResponse(200, hub, "Hub Found"));

    } catch (error: any) {
        if (error instanceof z.ZodError){
            throw new ApiError(
                400,
                "Validation failed: " + error.errors.map((e) => e.message).join(", ")
            );
        }

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Unable to fetch hub:", error);
        throw new ApiError(500, "Failed to fetch hub");
    }
}
