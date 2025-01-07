import express from "express";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.use(requireAuth());



export { router as memberRoutes };
