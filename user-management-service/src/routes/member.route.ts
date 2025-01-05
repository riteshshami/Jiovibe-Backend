import express from "express";
import { requireAuth } from "@clerk/express";
import { addMember, getMembers, getOneMember, removeMember, roleChange } from "../controllers/member.controller";
import { isModerator } from "../middlewares/isModerator";

const router = express.Router();

router.use(requireAuth());
router.use(isModerator);

router.post("/add-member", addMember);
router.get("/members", getMembers);
router.get("/member/:id", getOneMember);
router.delete("/member/:id", removeMember);
router.put("/member/:id", roleChange);


export { router as memberRoutes };
