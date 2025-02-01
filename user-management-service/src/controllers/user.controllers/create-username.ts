import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { z } from "zod";
import { db } from "../../config/db.config";
import { createUsername } from "../../services/create-username";
import { getUser } from "./get-user.controller";
import { clerkClient } from "@clerk/express";


export const generateUsername = async (req: Request, res: Response): Promise<void> => {

    try {
        // Get profileId from request
        const profileId = req.auth?.userId;
        if(!profileId) {
            throw new ApiError(401, "Unauthorized");
        }

        const user = await clerkClient.users.getUser(profileId);

        let username = createUsername(user?.firstName as string);

        //  Return success response
        res.status(201).json(
            new ApiResponse(201, username, "Username updated successfully")
        );
        return;
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
        throw new ApiError(500, 'Failed to generate a new username');
    }
}
