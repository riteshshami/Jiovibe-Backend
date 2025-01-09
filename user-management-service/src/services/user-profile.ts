import { db } from "../config/db.config";
import { AppError } from "../utils/appresponse.util";

export const userProfile = async (profileId: string): Promise<string> => {
    const profile = await db.profile.findUnique({
        where: { userId: profileId },
        select: { id: true }
    });

    if (!profile) {
        throw new AppError('Profile not found', 404);
    }

    return profile.id;
}
