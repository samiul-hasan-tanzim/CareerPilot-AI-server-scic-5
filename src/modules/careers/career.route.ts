import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
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
router.post("/", verifyToken, createCareer);
router.put("/:id", verifyToken, updateCareer);
router.delete("/:id", verifyToken, deleteCareer);

export default router;
