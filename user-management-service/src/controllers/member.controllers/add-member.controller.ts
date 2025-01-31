import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from "zod";
import { db } from "../../config/db.config";

import { addMemberSchema } from "../../interface/memberSchema.interface";
import { MemberRole } from "@prisma/client";

export const addMember = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get profileId from request
        const profileId = req.auth?.userId;
        if(!profileId) {
            throw new ApiError(401, "Unauthorized");
        }

        // Validate input data
        const validatedData = addMemberSchema.parse(req.body);

        // Validate invite code
        const { inviteCode }  = validatedData;

         // Use transaction for atomic operations
         const result = await db.$transaction(async (prisma) => {
            // 1. Get hub with locking to prevent race conditions
            const hub = await prisma.hub.findUnique({
                where: { inviteCode },
                select: { id: true }
            });

            if (!hub) {
                throw new ApiError(404, "Hub not found");
            }

            // 2. Check existing membership atomically
            const existingMember = await prisma.member.findFirst({
                where: {
                    hubId: hub.id,
                    profileId: profileId
                }
            });

            if (existingMember) {
                throw new ApiError(409, "Member already exists in this hub");
            }

            // 3. Create new membership
            return await prisma.member.create({
                data: {
                    hubId: hub.id,
                    profileId: profileId,
                },
                select: {
                    id: true,
                    role: true,
                    createdAt: true,
                    hub: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    profile: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            });
        });

        // Return success response
        res.status(201).json(
            new ApiResponse(201, result, "Member added successfully")
        );
        return;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ApiError(
                400,
                "Validation failed: " + error.errors.map((e) => e.message).join(", ")
            );
        }

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Error adding member:", error);
        throw new ApiError(500, "Failed to add a new member");
    }
};
