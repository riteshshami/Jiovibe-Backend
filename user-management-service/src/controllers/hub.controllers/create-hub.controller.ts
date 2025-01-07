import { Request, Response } from 'express';
import { AppError, AppSuccess } from '../../utils/appresponse.util';

import { z } from 'zod';
import { db } from '../../config/db.config';
import { logger } from '../../utils/logger.util';

import { createHubSchema } from '../../interface/hubSchema.interface';

import { generateInviteCode } from '../../utils/generateInvitecode.util';
import { INVITE_CODE_LENGTH, MAX_RETRIES } from '../../constants';

export const createHub = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    try {
        // Validate input data
        const validatedData = createHubSchema.parse(req.body);

        // Check if profile exists
        const existingProfile = await db.profile.findUnique({
            where: { id: validatedData.profileId }
        });

        if (!existingProfile) {
            throw new AppError('Profile not found', 404);
        }

        // Check for duplicate hub names for the same profile
        const existingHub = await db.hub.findFirst({
            where: {
                name: validatedData.name,
                profileId: validatedData.profileId
            }
        });

        if (existingHub) {
            throw new AppError('A hub with this name already exists for your profile', 409);
        }

        // Generate unique invite code with retries
        let inviteCode = '';
        let retryCount = 0;

        while (retryCount < MAX_RETRIES) {
            inviteCode = generateInviteCode(INVITE_CODE_LENGTH);
            const existingHubWithCode = await db.hub.findFirst({
                where: { inviteCode }
            });

            if (!existingHubWithCode) break;
            retryCount++;

            if (retryCount === MAX_RETRIES) {
                throw new AppError('Failed to generate unique invite code', 500);
            }
        }

        // Create the hub
        const newHub = await db.hub.create({
            data: {
                name: validatedData.name,
                imageUrl: validatedData.imageUrl ?? null, // Handle optional imageUrl
                profileId: validatedData.profileId,
                inviteCode,
            },
            include: {
                profile: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                members: true
            }
        });

        // Create initial member (owner) with ADMIN role
        await db.member.create({
            data: {
                profileId: validatedData.profileId,
                hubId: newHub.id,
                role: 'ADMIN'
            }
        });

        // Log success
        logger.info(`Hub created successfully`, {
            hubId: newHub.id,
            profileId: validatedData.profileId,
            executionTime: Date.now() - startTime
        });

        // Return success response
        new AppSuccess(
            'Hub created successfully',
            201,
            {
                hub: newHub,
                inviteCode,
                owner: newHub.profile
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
