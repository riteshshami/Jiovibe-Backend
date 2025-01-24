import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { inviteMember } from "../controllers/member.controllers/invite-member.controller";
import { addMember } from "../controllers/member.controllers/add-member.controller";
import { getAllMembers } from "../controllers/member.controllers/getAll-members";

const router = Router();

router.route("/invite-link").patch(requireAuth(), inviteMember);
router.route("/add-member").post(requireAuth(), addMember);
router.route("/get-members/:id").get(requireAuth(), getAllMembers);

export { router as memberRoutes };
