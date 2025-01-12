import { z } from 'zod';

export const createProfileSchema = z.object({
    userId: z.string()
        .min(1, "User ID is required")
        .trim(),
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
    email: z.string()
        .email("Invalid email address")
        .max(320, "Email is too long")
        .trim(),
});

export const readProfileSchema = z.object({
    userId: z.string()
        .min(1, "User ID is required")
        .trim()
});
