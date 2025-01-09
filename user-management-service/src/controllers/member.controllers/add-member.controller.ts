import { Request, Response } from "express";
import { logger } from "../../utils/logger.util";
import { addMemberSchema } from "../../interface/memberSchema.interface";
import { userProfile } from "../../services/user-profile";
import { AppError, AppSuccess } from "../../utils/appresponse.util";
import { db } from "../../config/db.config";
import { z } from "zod";

export const addMember = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    try {
        // Validate input data
        const validatedData = addMemberSchema.parse(req.body);

        // Check if profile exist
        const profileId = await userProfile(validatedData.profileId);

        // Invite code
        const inviteCode = validatedData.inviteCode;

        // Check if user is member
        const existingMember = await db.hub.findUnique({
            where: {
                inviteCode,
                members: {
                    some: {
                        profileId: profileId
                    }
                }
            }
        });

        if (existingMember) {
            // Log success
            logger.info('User already exist', {
                inviteCode,
                executionTime: Date.now() - startTime
            })

            // Return success response
            new AppSuccess(
                'Member already exist',
                201,
                'Existing'
            ).send(res);
        }

        // Add the member
        const hub = await db.hub.update({
            where: {
                inviteCode,
            },
            data: {
                members: {
                    create: {
                        profileId: profileId
                    }
                }
            }
        });

        if(!hub){
            throw new AppError("Unable to add member to hub", 500);
        }

        // Log success
        logger.info('User added successfully', {
            inviteCode,
            executionTime: Date.now() - startTime
        })

        // Return success response
        new AppSuccess(
            'Member added successfully',
            201,
            'Added'
        ).send(res);

    } catch (error: any) {
        // Log error
        logger.error('Error while adding new member', {
            error: error.message,
            stack: error.stack,
            executionTime: Date.now() - startTime
        });

        if (error instanceof z.ZodError) {
            throw new AppError(
                'Validation failed: ' + error.errors.map(e => e.message).join(', '),
                400
            );
        }

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Failed to add a new member', 500);
    }
}
