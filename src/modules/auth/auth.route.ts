import { Router } from "express";
import { register, login, googleLogin, exchangeToken, forgotPassword, resetPassword, changePassword, getMe } from "./auth.controller";
import { verifyToken } from "../../middlewares/verifyToken";
import { validate } from "../../middlewares/validate";

const router = Router();

router.post("/register", validate([
  { field: "name", type: "string", required: true, min: 2 },
  { field: "email", type: "email", required: true },
  { field: "password", type: "string", required: true, min: 6 },
]), register);
router.post("/login", validate([
  { field: "email", type: "email", required: true },
  { field: "password", type: "string", required: true },
]), login);
router.post("/google", googleLogin);
router.post("/exchange", validate([
  { field: "userId", type: "string", required: true },
]), exchangeToken);
router.post("/forgot-password", validate([
  { field: "email", type: "email", required: true },
]), forgotPassword);
router.post("/reset-password", validate([
  { field: "token", type: "string", required: true },
  { field: "password", type: "string", required: true, min: 6 },
]), resetPassword);
router.put("/change-password", verifyToken, changePassword);
router.get("/me", verifyToken, getMe);

export default router;
