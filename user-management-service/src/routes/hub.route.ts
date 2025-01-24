import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { createHub } from "../controllers/hub.controllers/create-hub.controller";
import { editHub } from "../controllers/hub.controllers/edit-hub.controller";
import { getHub } from "../controllers/hub.controllers/get-hub.controller";
import { getAllHubs } from "../controllers/hub.controllers/getAll-hubs.controller";
import { deleteHub } from "../controllers/hub.controllers/delete-hub.controller";

const router = Router();

router.route("/create-hub").post(requireAuth(), createHub);
router.route("/edit-hub/:id").patch(requireAuth(), editHub);
router.route("/get-hub/:id").get(requireAuth(), getHub);
router.route("/getAll-hubs").get(requireAuth(), getAllHubs);
router.route("/deleteHub/:id").delete(requireAuth(), deleteHub);

export { router as hubRoutes };
