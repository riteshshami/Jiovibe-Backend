import { z } from 'zod';

export const createProfileSchema = z.object({
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
    username: z.string()
        .min(1, "Username is required")
        .max(100, "Username cannot exceed 100 characters")
        .trim(),
});
