import { Request, Response } from "express";

import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from 'zod';
import { db } from "../../config/db.config";

import { createProfileSchema } from "../../interface/userSchema.interface";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const createProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate authentication
        const userId = req.auth?.userId;
        if (!userId) {
            throw new ApiError(401, "Authentication required");
        }

        // Validate input
        const validatedData = createProfileSchema.parse(req.body);

        // Create profile in transaction for future extensibility
        const newUser = await db.$transaction(async (prisma) => {
            // Check for existing profile (optional safety check)
            const existing = await prisma.profile.findUnique({
                where: { id: userId }
            });

            if (existing) {
                throw new ApiError(409, "Profile already exists");
            }

            return prisma.profile.create({
                data: {
                    id: userId,
                    name: validatedData.name.trim(),
                    imageUrl: validatedData.imageUrl,
                    email: validatedData.email.toLowerCase(),
                    username: validatedData.username.trim(),
                },
                select: { // Limit returned fields
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    createdAt: true,
                }
            });
        });

        // Return standardized success response
        res.status(201).json(
            new ApiResponse(201, newUser, "Profile created successfully")
        );

    } catch (error: unknown) {
        // Handle known error types
        if (error instanceof z.ZodError) {
            res.status(400).json(
                new ApiError(400, "Validation error", error.issues)
            );
        }

        if (error instanceof PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            if (error.code === 'P2002') {
                res.status(409).json(
                    new ApiError(409, "Profile already exists")
                );
            }
            res.status(500).json(
                new ApiError(500, "Database operation failed")
            );
        }

        if (error instanceof ApiError) {
            res.status(error.statusCode).json(error);
        }

        // Handle unknown errors securely
        console.error("Profile creation error:", error);
        res.status(500).json(
            new ApiError(500, "Internal server error")
        );
    }
};
