import { Router } from "express";
import { getOverview } from "./dashboard.controller";

const router = Router();

router.get("/overview/:userId", getOverview);

export default router;
