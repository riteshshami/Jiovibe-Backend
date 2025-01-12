import { db } from "../config/db.config";
import { ApiError } from "../utils/ApiError.util";

export const userProfile = async (profileId: string): Promise<string> => {
    const profile = await db.profile.findUnique({
        where: { userId: profileId },
        select: { id: true }
    });

    if (!profile) {
        throw new ApiError(404, 'Profile not found');
    }

    return profile.id;
}
