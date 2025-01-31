import { z } from 'zod';

export const inviteMemberSchema = z.object({
    inviteCode: z.string()
           .min(1, "hub is required")
           .uuid("Invalid hub ID"),
    profileId: z.string()
              .min(1, "user ID is required"),
});

export const addMemberSchema = z.object({
    inviteCode: z.string()
           .min(1, "hub is required")
           .uuid("Invalid hub ID"),
    profileId: z.string()
              .min(1, "user ID is required"),
})
export const leaveHubSchema = inviteMemberSchema;
