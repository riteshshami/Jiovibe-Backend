import { Request, Response } from 'express';
import { AppError, AppSuccess } from '../../utils/appresponse.util';

import { z } from 'zod';
import { db } from '../../config/db.config';
import { v4 as uuid } from 'uuid';
import { logger } from '../../utils/logger.util';

import { createHubSchema } from '../../interface/hubSchema.interface';

import { MemberRole } from '@prisma/client';
import { userProfile } from '../../services/user-profile';

export const createHub = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    try {
        // Validate input data
        const validatedData = createHubSchema.parse(req.body);

        // Check if profile exists
        const profileId = await userProfile(validatedData.profileId);

        // Check for duplicate hub names for the same profile
        const existingHub = await db.hub.findFirst({
            where: {
                name: validatedData.name,
                profileId: profileId
            }
        });

        if (existingHub) {
            throw new AppError('A hub with this name already exists for your profile', 409);
        }

        // Generate unique invite code with retries
        let inviteCode = uuid();

        // Create the hub
        const newHub = await db.hub.create({
            data: {
                name: validatedData.name,
                imageUrl: validatedData.imageUrl ?? null, // Handle optional imageUrl
                profileId: profileId,
                inviteCode,
                members: {
                    create: [
                        {profileId: profileId, role: MemberRole.ADMIN}
                    ]
                }
            },
        });

        // Log success
        logger.info(`Hub created successfully`, {
            hubId: newHub.id,
            profileId: profileId,
            executionTime: Date.now() - startTime
        });

        // Return success response
        new AppSuccess(
            'Hub created successfully',
            201,
            {
                hub: newHub,
                inviteCode,
                owner: profileId
            }
        ).send(res);

    } catch (error: any) {
        // Log error
        logger.error('Error creating hub', {
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
};
