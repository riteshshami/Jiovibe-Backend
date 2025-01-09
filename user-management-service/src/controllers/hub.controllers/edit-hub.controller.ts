import { Request, Response } from "express";
import { logger } from "../../utils/logger.util";
import { editHubSchema } from "../../interface/hubSchema.interface";
import { userProfile } from "../../services/user-profile";
import { db } from "../../config/db.config";
import { AppError, AppSuccess } from "../../utils/appresponse.util";
import { z } from "zod";

export const updateInviteLink = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    try {
        // Validate input data
        const validatedData = editHubSchema.parse(req.body);

        // Check if profile exist
        const profileId = await userProfile(validatedData.profileId);

        // Update the server
        const hub = db.hub.update({
            where: {
                id: validatedData.hubId,
                profileId: profileId
            },
            data: {
                name: validatedData.name,
                imageUrl: validatedData.imageUrl
            }
        });

        // Log success
        logger.info(`Hub edited successfully`, {
            hubId: validatedData.hubId,
            profileId: profileId,
            executionTime: Date.now() - startTime
        });

        // Return success response
        new AppSuccess(
            'Hub edited successfully',
            201,
            {
                hub: hub,
                owner: profileId
            }
        ).send(res);

    } catch (error: any) {
        // Log error
        logger.error('Error generating new invite link', {
        error: error.message,
        stack: error.stack,
        executionTime: Date.now() - startTime
        });

        if (error instanceof z.ZodError) {
            throw new AppError(
                'Validation failed: ' + error.errors.map(e => e.message).join(', '),
                400
            );
        }

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Failed to create a new hub', 500);
    }
}
