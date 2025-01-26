import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.util";
import { ApiResponse } from "../../utils/ApiResponse.util";

import { db } from "../../config/db.config";

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
    try {

        // Find the user in the database
        const users = await db.profile.findMany();

        // If no users found
        if (!users || users?.length === 0) {
            throw new ApiError(404, "No Users Found");
        }

        // Return success response
        res.status(200).json(new ApiResponse(200, users, "Users Found"));
        return;
    } catch (error: any) {

        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Error in fetching users:", error); // Log unknown errors
        throw new ApiError(500, "Failed to fetch a user");
    }
};


// Code using pagination
// import { Request, Response } from "express";
// import { ApiError } from "../../utils/ApiError.util";
// import { ApiResponse } from "../../utils/ApiResponse.util";
// import { db } from "../../config/db.config";

// export const getAllUser = async (req: Request, res: Response): Promise<void> => {
//     try {
//         // Extract query parameters for pagination
//         const page = parseInt(req.query.page as string) || 1; // Default to page 1
//         const pageSize = parseInt(req.query.pageSize as string) || 10; // Default to 10 users per page

//         // Calculate offset and limit
//         const offset = (page - 1) * pageSize;
//         const limit = pageSize;

//         // Fetch users with pagination
//         const [users, totalUsers] = await Promise.all([
//             db.profile.findMany({
//                 skip: offset,
//                 take: limit,
//             }),
//             db.profile.count(), // Get the total number of users for pagination info
//         ]);

//         // If no users found
//         if (!users || users.length === 0) {
//             throw new ApiError(404, "No Users Found");
//         }

//         // Calculate total pages
//         const totalPages = Math.ceil(totalUsers / pageSize);

//         // Return success response with pagination info
//         res.status(200).json(
//             new ApiResponse(200, {
//                 users,
//                 pagination: {
//                     currentPage: page,
//                     pageSize,
//                     totalUsers,
//                     totalPages,
//                 },
//             }, "Users Found")
//         );
//         return;
//     } catch (error: any) {
//         if (error instanceof ApiError) {
//             throw error;
//         }

//         console.error("Error in fetching users:", error); // Log unknown errors
//         throw new ApiError(500, "Failed to fetch users");
//     }
// };
