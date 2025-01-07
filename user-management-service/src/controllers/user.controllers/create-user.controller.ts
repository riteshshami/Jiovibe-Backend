import { Request, Response } from "express";
import { AppError, AppSuccess } from "../../utils/appresponse.util";

import { z } from 'zod';
import { db } from "../../config/db.config";
import { logger } from "../../utils/logger.util";

import { createProfileSchema } from "../../interface/userSchema.interface";

// Create a new user profile
export const createProfile = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    try {
        // Validate input data
        const validatedData = createProfileSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await db.profile.findUnique({
            where: { id: validatedData.userId }
        });

        if (existingUser){
            throw new AppError('User already exist', 409);
        }

        // Create the user
        const newUser = await db.profile.create({
            data: {
                userId: validatedData.userId,
                name: validatedData.name,
                imageUrl: validatedData.imageUrl,
                email: validatedData.email,
            },
        })

        // log success
        logger.info(`User created successfully`, {
            profileId: newUser.id,
            executionTime: Date.now() - startTime
        });

        // Return success response
        new AppSuccess(
            'User added successfully',
            201,
            {
                user: newUser.id
            }
        ).send(res)
    } catch (error: any) {
        // log error
        logger.error('Error adding user', {
            error: error.message,
            stack: error.stack,
            executionTime: Date.now() - startTime
        });

        if(error instanceof z.ZodError){
            throw new AppError(
                'Validation failed: ' + error.errors.map(e => e.message).join(', '),
                400
            );
        }

        if(error instanceof AppError){
            throw error;
        }

        throw new AppError('Failed to add a new user', 500);
    }
};
