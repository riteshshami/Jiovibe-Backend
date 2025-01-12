import express from 'express';
import { requireAuth } from '@clerk/express';
import { createProfile } from '../controllers/user.controllers/create-user.controller';
import { getUser } from '../controllers/user.controllers/get-user.controller';

const router = express.Router();

router.route("/create-profile").post(requireAuth(), createProfile);
router.route("/user").get(requireAuth(), getUser);

export { router as userRoutes };
