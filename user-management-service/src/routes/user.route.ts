import express from 'express';
import { requireAuth } from '@clerk/express';
import { createProfile } from '../controllers/user.controllers/create-user.controller';

const router = express.Router();

// Apply requireAuth middleware to all routes in this router
router.use(requireAuth());

router.post("/", createProfile);

export { router as userRoutes };
