import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { createHub } from "../controllers/hub.controllers/create-hub.controller";
import { editHub } from "../controllers/hub.controllers/edit-hub.controller";

const router = Router();

router.route("/create-hub").post(requireAuth(), createHub);
router.route("/edit-hub").patch(requireAuth(), editHub);

export { router as hubRoutes };
