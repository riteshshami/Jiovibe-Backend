import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { createHub } from "../controllers/hub.controllers/create-hub.controller";
import { editHub } from "../controllers/hub.controllers/edit-hub.controller";
import { getHub } from "../controllers/hub.controllers/get-hub.controller";

const router = Router();

router.route("/create-hub").post(requireAuth(), createHub);
router.route("/edit-hub/:id").patch(requireAuth(), editHub);
router.route("/get-hub/:id").get(requireAuth(), getHub);

export { router as hubRoutes };
