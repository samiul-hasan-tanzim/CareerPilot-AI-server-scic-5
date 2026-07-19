import { Router } from "express";
import { submitContact } from "./contact.controller";
import { validate } from "../../middlewares/validate";

const router = Router();

router.post("/", validate([
  { field: "name", type: "string", required: true },
  { field: "email", type: "email", required: true },
  { field: "message", type: "string", required: true, min: 10 },
]), submitContact);

export default router;
