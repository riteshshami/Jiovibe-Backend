import { NextFunction, Request } from "express";
import { db } from "../config/db.config";
import { ApiError } from "../utils/ApiError.util";

declare module 'express' {
    interface Request {
        user?: {
            profileId: string;
        };
        member?: {
            id: string;
            role: string;
        };
    }
}

export const isMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get hubId from request parameters
        const hubId = req.params.hubId;

        // Get profileId from authenticated user
        const profileId = req.user?.profileId;

        if (!hubId) {
            throw new ApiError(400, 'Hub ID is required');
        }

        if (!profileId) {
            throw new ApiError(401, 'Unauthorized - No profile ID found');
        }

        // Check if the user is a member of the hub
        const member = await db.member.findFirst({
            where: {
                AND: [
                    { hubId: hubId },
                    { profileId: profileId }
                ]
            },
            select: {
                id: true,
                role: true
            }
        });

        if (!member) {
            throw new ApiError(403, 'Forbidden - You are not a member of this hub');
        }

        // Attach member information to the request for use in subsequent middleware or routes
        req.member = member;

        next();
    } catch (error: any) {

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, 'Failed to verify hub membership');
    }
};

export const hasRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const startTime = Date.now();

        try {
            const memberRole = req.member?.role;

            if (!memberRole || !allowedRoles.includes(memberRole)) {
                throw new ApiError(403, 'Forbidden - Insufficient permissions');
            }

            next();
        } catch (error: any) {

            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(500, 'Failed to verify role permissions');
        }
    };
};
