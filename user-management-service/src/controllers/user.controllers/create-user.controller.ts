import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from 'zod';
import { db } from "../../config/db.config";
import { createProfileSchema } from "../../interface/userSchema.interface";

// Create a new user profile
export const createProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate input data
        const validatedData = createProfileSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await db.profile.findUnique({
            where: { id: validatedData.userId }
        });

        if (existingUser) {
            throw new ApiError(409, 'User already exists');
        }

        // Create the user
        const newUser = await db.profile.create({
            data: {
                userId: validatedData.userId,
                name: validatedData.name,
                imageUrl: validatedData.imageUrl,
                email: validatedData.email,
            },
        });

        // Return success response
        res.status(201).json(new ApiResponse(201, newUser, "User registered successfully"));
        return;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ApiError(
                400,
                'Validation failed',
                error.errors.map(e => e.message)
            );
        }

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Unknown error occurred:", error);
        throw new ApiError(500, 'Failed to add a new user');
    }
};
