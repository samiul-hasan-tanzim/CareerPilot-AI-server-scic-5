import { Router } from "express";
import { getProfile, updateProfile, deleteAccount } from "./profile.controller";

const router = Router();

router.get("/:userId", getProfile);
router.put("/:userId", updateProfile);
router.delete("/:userId/account", deleteAccount);

export default router;
