import express from "express";
import { requireAuth } from "@clerk/express";
import { createHub } from "../controllers/hub.controllers/create-hub.controller";

const router = express.Router();

// Apply requireAuth middleware to all routes in this router
router.use(requireAuth());

router.post("/", createHub);


export { router as hubRoutes };
