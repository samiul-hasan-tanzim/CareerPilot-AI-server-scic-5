import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { getWorkflowStatus, runWorkflow } from "./workflow.controller";

const router = Router();

router.get("/:userId", verifyToken, getWorkflowStatus);
router.post("/run", verifyToken, runWorkflow);

export default router;
