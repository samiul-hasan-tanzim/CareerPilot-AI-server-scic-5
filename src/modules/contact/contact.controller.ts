import { Request, Response } from "express";
import { ContactMessage } from "./contact.model";
import { Subscriber } from "./subscriber.model";

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    await ContactMessage.create({ name, email, subject, message });

    res.json({ message: "Message received. We'll get back to you soon." });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      res.json({ message: "Already subscribed" });
      return;
    }

    await Subscriber.create({ email });

    res.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Failed to subscribe" });
  }
};
