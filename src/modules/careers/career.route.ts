import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { validate } from "../../middlewares/validate";
import {
  getCareers,
  getCareerById,
  getMyCareers,
  createCareer,
  updateCareer,
  deleteCareer,
  getFilterOptions,
} from "./career.controller";

const router = Router();

router.get("/", getCareers);
router.get("/mine", verifyToken, getMyCareers);
router.get("/filters", getFilterOptions);
router.get("/:id", getCareerById);
router.post("/", verifyToken, validate([
  { field: "title", type: "string", required: true, min: 2 },
]), createCareer);
router.put("/:id", verifyToken, updateCareer);
router.delete("/:id", verifyToken, deleteCareer);

export default router;
