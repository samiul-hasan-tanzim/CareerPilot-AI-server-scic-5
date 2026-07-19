import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { sendMessage, getConversations, getConversationMessages, deleteConversation } from "./chat.controller";

const router = Router();

router.post("/send", verifyToken, sendMessage);
router.get("/conversations/:userId", verifyToken, getConversations);
router.get("/conversations/:id/messages", verifyToken, getConversationMessages);
router.delete("/conversations/:id", verifyToken, deleteConversation);

export default router;
