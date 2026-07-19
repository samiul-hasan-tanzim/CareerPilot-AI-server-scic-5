import { Router } from "express";
import { subscribe } from "./contact.controller";

const router = Router();

router.post("/", subscribe);

export default router;
