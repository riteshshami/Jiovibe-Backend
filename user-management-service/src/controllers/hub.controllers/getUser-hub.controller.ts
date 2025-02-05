import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";
import { db } from "../../config/db.config";

export const getAllHubs = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate authentication
        const userId = req.auth?.userId;
        if (!userId) {
            throw new ApiError(401, "Authentication required");
        }

        // Find hubs where the user is either the owner or a member
        const userHubs = await db.profile.findUnique({
            where: { id: userId },
            include: {
                hubs: { // Hubs where the user is the creator (profileId in Hub model)
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                    }
                },
                members: { // Hubs where the user is a member
                    include: {
                        hub: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true,
                            }
                        }
                    }
                }
            }
        });

        // If no hubs found
        if (!userHubs) {
            throw new ApiError(404, "No Hubs Found");
        }

        // Extract and merge hubs from both ownership and membership
        const allHubs = [
            ...userHubs.hubs, // Owned hubs
            ...userHubs.members.map(m => m.hub) // Member hubs
        ];

        // Return success response
        res.status(200).json(new ApiResponse(200, allHubs, "Hubs Found"));

    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Error in fetching hubs:", error); // Log unknown errors
        throw new ApiError(500, "Failed to fetch hubs");
    }
};
