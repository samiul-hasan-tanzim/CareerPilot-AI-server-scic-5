import { Router } from "express";
import { getWorkflowStatus, runWorkflow } from "./workflow.controller";

const router = Router();

router.get("/:userId", getWorkflowStatus);
router.post("/run", runWorkflow);

export default router;
