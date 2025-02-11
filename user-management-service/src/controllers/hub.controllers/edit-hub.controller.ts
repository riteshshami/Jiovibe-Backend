import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from "zod";
import { db } from "../../config/db.config";
import { editHubSchema } from "../../interface/hubSchema.interface";

export const editHub = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate authentication
        const userId = req.auth?.userId;
        if (!userId) {
            throw new ApiError(401, "Authentication required");
        }

        // Validate input data
        const validatedData = editHubSchema.parse(req.body);
        const { name, imageUrl } = validatedData;

        // Get and validate hubId
        const hubId  = req.params.id;
        if (!hubId) {
            throw new ApiError(400, 'Hub ID is required');
        }

        // Check if the hub exists and belongs to the user
        const existingHub = await db.hub.findFirst({
            where: {
                id: hubId,
                profileId: userId,
            },
        });

        if (!existingHub) {
            throw new ApiError(404, 'Hub not found or not authorized to edit');
        }

        // Update the hub
        const updatedHub = await db.hub.update({
            where: {
                id: hubId,
                profileId: userId,
            },
            data: {
                name,
                imageUrl,
            },
        });

        // Return success response
        res.status(200).json(
            new ApiResponse(200, updatedHub, "Hub edited successfully")
        );
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ApiError(
                400,
                'Validation failed: ' + error.errors.map(e => e.message).join(', '),
            );
        }

        if (error instanceof ApiError) {
            throw error;
        }

        console.error('Error editing hub:', error);
        throw new ApiError(500, 'Failed to edit the hub');
    }
};
