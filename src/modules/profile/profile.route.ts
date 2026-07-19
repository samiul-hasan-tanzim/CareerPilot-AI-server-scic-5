import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { getProfile, updateProfile, deleteAccount } from "./profile.controller";

const router = Router();

router.get("/:userId", verifyToken, getProfile);
router.put("/:userId", verifyToken, updateProfile);
router.delete("/:userId/account", verifyToken, deleteAccount);

export default router;
