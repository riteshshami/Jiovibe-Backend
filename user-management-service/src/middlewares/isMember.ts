import { NextFunction, Request } from "express";
import { AppError } from "../utils/appresponse.util";
import { logger } from "../utils/logger.util";
import { db } from "../config/db.config";

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
    const startTime = Date.now();

    try {
        // Get hubId from request parameters
        const hubId = req.params.hubId;

        // Get profileId from authenticated user
        const profileId = req.user?.profileId;

        if (!hubId) {
            throw new AppError('Hub ID is required', 400);
        }

        if (!profileId) {
            throw new AppError('Unauthorized - No profile ID found', 401);
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
            throw new AppError('Forbidden - You are not a member of this hub', 403);
        }

        // Attach member information to the request for use in subsequent middleware or routes
        req.member = member;

        // Log success
        logger.info('Hub membership verified', {
            hubId,
            profileId,
            memberId: member.id,
            executionTime: Date.now() - startTime
        });

        next();
    } catch (error: any) {
        // Log error
        logger.error('Hub membership verification failed', {
            error: error.message,
            stack: error.stack,
            executionTime: Date.now() - startTime
        });

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Failed to verify hub membership', 500);
    }
};

export const hasRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const startTime = Date.now();

        try {
            const memberRole = req.member?.role;

            if (!memberRole || !allowedRoles.includes(memberRole)) {
                throw new AppError('Forbidden - Insufficient permissions', 403);
            }

            // Log success
            logger.info('Role verification successful', {
                role: memberRole,
                executionTime: Date.now() - startTime
            });

            next();
        } catch (error: any) {
            // Log error
            logger.error('Role verification failed', {
                error: error.message,
                stack: error.stack,
                executionTime: Date.now() - startTime
            });

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError('Failed to verify role permissions', 500);
        }
    };
};
