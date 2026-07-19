import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { validate } from "../../middlewares/validate";
import { sendMessage, sendMessageStream, getConversations, getConversationMessages, deleteConversation } from "./chat.controller";

const router = Router();

router.post("/send", verifyToken, validate([
  { field: "content", type: "string", required: true, min: 1 },
]), sendMessage);
router.post("/send/stream", verifyToken, validate([
  { field: "content", type: "string", required: true, min: 1 },
]), sendMessageStream);
router.get("/conversations/:userId", verifyToken, getConversations);
router.get("/conversations/:id/messages", verifyToken, getConversationMessages);
router.delete("/conversations/:id", verifyToken, deleteConversation);

export default router;
