import { z } from 'zod';

export const createHubSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name cannot exceed 100 characters")
        .trim(),
    imageUrl: z.string()
        .url("Invalid URL")
        .max(2048, "URL is too long")
        .trim()
        .optional()
        .default(""),
    profileId: z.string()
        .min(1, "user ID is required"),
});

export const editHubSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name cannot exceed 100 characters")
        .trim(),
    imageUrl: z.string()
        .url("Invalid URL")
        .max(2048, "URL is too long")
        .trim()
        .optional()
        .default(""),
    profileId: z.string(),
    hubId: z.string()
        .uuid("Invalid hub ID")
});

export const getHubSchema = z.object({
    id: z.string()
    .uuid("Invalid hub ID"),
})
