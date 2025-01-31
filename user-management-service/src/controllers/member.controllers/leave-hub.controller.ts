import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from "zod";
import { db } from "../../config/db.config";
import { leaveHubSchema } from "../../interface/memberSchema.interface";

export const leaveHub = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get profileId from request
        const profileId = req.auth?.userId;
        if (!profileId) {
            throw new ApiError(401, "Unauthorized");
        }

        // Validate input data
        const validatedData = leaveHubSchema.parse(req.body);

        // Check if hub exists
        const existingHub = await db.hub.findUnique({
            where: { inviteCode: validatedData.inviteCode }
        });

        if (!existingHub) {
            throw new ApiError(404, 'Hub not found');
        }

        // Check if user is a member
        const isMember = await db.member.findFirst({
            where: {
                hubId: existingHub.id,
                profileId
            }
        });

        if (!isMember) {
            throw new ApiError(404, 'User is not a member of the hub');
        }

        // Remove the member
        const leaveHub = await db.member.delete({
            where: {
                id: isMember.id
            }
        });

        if (!leaveHub) {
            throw new ApiError(500, 'Unable to leave hub');
        }

        // Return success response
        res.status(201).json(
            new ApiResponse(201, existingHub.id, "Left hub successfully")
        );
        return; // Ensure function exits after sending response
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

        console.error("Error leaving hub:", error);
        throw new ApiError(500, "Failed to leave the hub");
    }
}
