import { Router } from "express";
import { register, login, googleLogin, exchangeToken, getMe } from "./auth.controller";
import { verifyToken } from "../../middlewares/verifyToken";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/exchange", exchangeToken);
router.get("/me", verifyToken, getMe);

export default router;
