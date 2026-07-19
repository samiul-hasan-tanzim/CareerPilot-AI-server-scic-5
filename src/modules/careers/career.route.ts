import { Router } from "express";
import {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  getFilterOptions,
} from "./career.controller";

const router = Router();

router.get("/", getCareers);
router.get("/filters", getFilterOptions);
router.get("/:id", getCareerById);
router.post("/", createCareer);
router.put("/:id", updateCareer);
router.delete("/:id", deleteCareer);

export default router;
