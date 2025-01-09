import express from "express";
import { requireAuth } from "@clerk/express";
import { inviteMember } from "../controllers/member.controllers/invite-member.controller";
import { addMember } from "../controllers/member.controllers/add-member.controller";

const router = express.Router();

router.use(requireAuth());

router.patch("/invite-member", inviteMember);
router.post("/add-member", addMember);

export { router as memberRoutes };
