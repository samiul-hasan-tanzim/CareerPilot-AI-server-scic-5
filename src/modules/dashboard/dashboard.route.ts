import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { getOverview } from "./dashboard.controller";

const router = Router();

router.get("/overview/:userId", verifyToken, getOverview);

export default router;
