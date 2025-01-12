import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse.util';
import { ApiError } from '../../utils/ApiError.util';

import { z } from 'zod';
import { db } from '../../config/db.config';
import { createHubSchema } from '../../interface/hubSchema.interface';
import { userProfile } from '../../services/user-profile';

import { v4 as uuid } from 'uuid';
import { MemberRole } from '@prisma/client';

export const createHub = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate input data
        const validatedData = createHubSchema.parse(req.body);
        const { userId, name, imageUrl } = validatedData;

        // Check if profile exists
        const id = await userProfile(userId);

        // Check for duplicate hub names for the same profile
        const existingHub = await db.hub.findFirst({
            where: {
                name: name,
                profileId: id,
            },
        });

        if (existingHub) {
            throw new ApiError(409, 'A hub with this name already exists for your profile');
        }

        // Generate unique invite code with retries
        let inviteCode = uuid();

        // Create the hub
        const newHub = await db.hub.create({
            data: {
                name: name,
                imageUrl: imageUrl ?? null, // Handle optional imageUrl
                profileId: id,
                inviteCode,
                members: {
                    create: [{ profileId: id, role: MemberRole.ADMIN }],
                },
            },
        });

        // Return success response
        res.status(201).json(new ApiResponse(201, newHub, 'Hub created successfully'));
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ApiError(400, 'Validation failed', error.errors.map((e) => e.message));
        }

        if (error instanceof ApiError) {
            throw error;
        }

        console.error('Unknown error occurred:', error);
        throw new ApiError(500, 'Failed to create a new hub');
    }
};
