import { Request, Response } from "express";

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: "Name, email, and message are required" });
      return;
    }

    // In production, send email or save to DB
    res.json({ message: "Message received. We'll get back to you soon." });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // In production, save to mailing list
    res.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Failed to subscribe" });
  }
};
