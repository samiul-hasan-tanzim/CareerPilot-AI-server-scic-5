import { Router } from "express";
import { sendMessage, getConversations, getConversationMessages, deleteConversation } from "./chat.controller";

const router = Router();

router.post("/send", sendMessage);
router.get("/conversations/:userId", getConversations);
router.get("/conversations/:id/messages", getConversationMessages);
router.delete("/conversations/:id", deleteConversation);

export default router;
