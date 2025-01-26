import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from "zod";
import { db } from "../../config/db.config";
import { addMemberSchema } from "../../interface/memberSchema.interface";
import { userProfile } from "../../services/user-profile";

export const addMember = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate input data
        const validatedData = addMemberSchema.parse(req.body);

        // Check if profile exists
        const profileId = await userProfile(validatedData.profileId);

        // Validate invite code
        const inviteCode = validatedData.inviteCode;

        // Check if hub exists with the given invite code
        const hub = await db.hub.findUnique({
            where: { inviteCode },
        });

        if (!hub) {
            throw new ApiError(404, "Hub not found");
        }

        // Check if user is already a member
        const existingMember = await db.hub.findFirst({
            where: {
                inviteCode,
                members: {
                    some: { profileId },
                },
            },
        });

        if (existingMember) {
            throw new ApiError(409, "Member already exists");
        }

        // Add the member
        const updatedHub = await db.hub.update({
            where: { inviteCode },
            data: {
                members: {
                    create: {
                        profileId,
                    },
                },
            },
        });

        if (!updatedHub) {
            throw new ApiError(500, "Unable to add member to hub");
        }

        // Return success response
        res.status(200).json(
            new ApiResponse(200, { message: "Member added successfully" })
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
