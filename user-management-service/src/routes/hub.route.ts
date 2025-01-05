import express from "express";
import { requireAuth } from "@clerk/express";
import { createHub, getAllHubs, getJoinedHubs, getOneHub, updateHub, deleteHub } from "../controllers/hub.controller";
import { isMember } from "../middlewares/isMember";

const router = express.Router();

router.use(requireAuth());

router.post("/create-hub", createHub);
router.get("/hubs", getAllHubs);

router.use(isMember);

router.get("/hub/:id", getOneHub);
router.get("/hubs/joined", getJoinedHubs);
router.put("/hub/:id", updateHub);
router.delete("/hub/:id", deleteHub);


export { router as hubRoutes };
