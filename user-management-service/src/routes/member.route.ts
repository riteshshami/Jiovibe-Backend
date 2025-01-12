import express from "express";
import { requireAuth } from "@clerk/express";
import { inviteMember } from "../controllers/member.controllers/invite-member.controller";
import { addMember } from "../controllers/member.controllers/add-member.controller";

const router = express.Router();

router.route("/invite-link").patch(requireAuth(), inviteMember);
router.route("/add-member").post(requireAuth(), addMember);

export { router as memberRoutes };
