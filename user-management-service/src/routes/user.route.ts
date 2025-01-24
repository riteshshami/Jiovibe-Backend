import { Router } from 'express';
import { requireAuth } from '@clerk/express';
import { createProfile } from '../controllers/user.controllers/create-user.controller';
import { getUser } from '../controllers/user.controllers/get-user.controller';
import { getAllUser } from '../controllers/user.controllers/getAll-user.controller';

const router = Router();

router.route("/create-profile").post(requireAuth({ signInUrl: '/sign-in' }), createProfile);
router.route("/get-user/:id").get(requireAuth({ signInUrl: '/sign-in' }), getUser);
router.route("/getAll-users").get(requireAuth({ signInUrl: '/sign-in' }), getAllUser);

export { router as userRoutes };
