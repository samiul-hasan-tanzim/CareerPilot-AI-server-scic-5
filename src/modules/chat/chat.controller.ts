import { Request, Response } from "express";
import { Conversation } from "./chat.model";
import { generateChatResponse, generateChatResponseStream } from "../../utils/chat-engine";

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId, userId, content } = req.body;

    if (!content?.trim()) {
      res.status(400).json({ message: "Message content is required" });
      return;
    }

    const uid = userId || "anonymous";
    let conversation = conversationId
      ? await Conversation.findById(conversationId)
      : null;

    if (!conversation) {
      conversation = await Conversation.create({
        userId: uid,
        title: content.slice(0, 60),
        messages: [],
      });
    }

    conversation.messages.push({
      role: "user",
      content,
      timestamp: new Date(),
    });

    const reply = await generateChatResponse(uid, content);

    conversation.messages.push({
      role: "assistant",
      content: reply,
      timestamp: new Date(),
    });

    if (conversation.messages.length <= 2) {
      conversation.title = content.slice(0, 60);
    }

    await conversation.save();

    res.json({
      conversation: {
        id: conversation._id,
        title: conversation.title,
      },
      message: {
        role: "assistant" as const,
        content: reply,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Failed to process message" });
  }
};

export const sendMessageStream = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId, userId, content } = req.body;

    if (!content?.trim()) {
      res.status(400).json({ message: "Message content is required" });
      return;
    }

    const uid = userId || "anonymous";
    let conversation = conversationId
      ? await Conversation.findById(conversationId)
      : null;

    if (!conversation) {
      conversation = await Conversation.create({
        userId: uid,
        title: content.slice(0, 60),
        messages: [],
      });
    }

    conversation.messages.push({
      role: "user",
      content,
      timestamp: new Date(),
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    let fullResponse = "";
    const stream = generateChatResponseStream(uid, content);
    for await (const chunk of stream) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    conversation.messages.push({
      role: "assistant",
      content: fullResponse,
      timestamp: new Date(),
    });
    await conversation.save();

    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id, conversationTitle: conversation.title })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Send message stream error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to send message" });
    }
    res.end();
  }
};

export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select("title createdAt updatedAt");
    res.json({ conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

export const getConversationMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }
    res.json({ messages: conversation.messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const deleteConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Conversation.findByIdAndDelete(id);
    res.json({ message: "Conversation deleted" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};
