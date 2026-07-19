import { Router } from "express";
import { getCareerRecommendations } from "./recommendation.controller";

const router = Router();

router.get("/:userId", getCareerRecommendations);

export default router;
