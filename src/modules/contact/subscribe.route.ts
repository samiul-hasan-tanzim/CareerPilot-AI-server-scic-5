import { Router } from "express";
import { subscribe } from "./contact.controller";
import { validate } from "../../middlewares/validate";

const router = Router();

router.post("/", validate([
  { field: "email", type: "email", required: true },
]), subscribe);

export default router;
