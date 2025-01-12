import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from "zod";
import { db } from "../../config/db.config";
import { inviteMemberSchema } from "../../interface/memberSchema.interface";
import { userProfile } from "../../services/user-profile";

import { v4 as uuidv4 } from "uuid";


export const inviteMember = async (req: Request, res: Response): Promise<void> => {

    try {
        // Validate input data
        const validatedData = inviteMemberSchema.parse(req.body);

        // Check if profile exists
        const profileId = await userProfile(validatedData.profileId);

        // Check if hub exists
        const existingHub = await db.hub.findUnique({
            where: { inviteCode: validatedData.inviteCode }
        });

        if (!existingHub) {
            throw new ApiError(404, 'Hub not found');
        }

        // Generate unique invite code
        let inviteCode = uuidv4();

        // Update the invite code
        await db.hub.update({
            where: {
                inviteCode: validatedData.inviteCode,
                profileId,
            },
            data: {
                inviteCode
            },
        });

        //  Return success response
        res.status(201).json(
            new ApiResponse(201, inviteCode, "Invite code updated successfully")
        );
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ApiError(
                400,
                'Validation failed: ' + error.errors.map(e => e.message).join(', '),
            );
        }

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Error updating link:", error);
        throw new ApiError(500, 'Failed to generate a new invite link');
    }
}
