import { Request, Response } from "express";
import { logger } from "../../utils/logger.util";
import { AppError, AppSuccess } from "../../utils/appresponse.util";
import { z } from "zod";
import { inviteMemberSchema } from "../../interface/memberSchema.interface";
import { db } from "../../config/db.config";
import { v4 as uuidv4 } from "uuid";
import { userProfile } from "../../services/user-profile";

export const inviteMember = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    try {
        // Validate input data
        const validatedData = inviteMemberSchema.parse(req.body);

        // Check if profile exists
        const profileId = await userProfile(validatedData.profileId);

        // Check if hub exists
        const existingHub = await db.hub.findUnique({
            where: { id: validatedData.hubId }
        });

        if (!existingHub) {
            throw new AppError('Hub not found', 404);
        }

        // Generate unique invite code with retries
        let inviteCode = uuidv4();

        // Update the invite code
        const hub = await db.hub.update({
            where: {
                id: validatedData.hubId,
                profileId: profileId,
            },
            data: {
                inviteCode
            },
        });

        // Log success
        logger.info('Invite link created successfully', {
            profileId: profileId,
            inviteCode,
            executionTime: Date.now() - startTime
        })

        //  Return success response
        new AppSuccess(
            'Invite link created successfully',
            201,
            {
                inviteCode
            }
        ).send(res);

    } catch (error: any) {
        // Log error
        logger.error('Error generating invite link', {
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

        throw new AppError('Failed to generate a new invite link', 500);
    }
}
