import { Request, Response } from "express";
import { UserProfile } from "./profile.model";
import { Resume } from "../uploads/upload.model";
import { Conversation } from "../chat/chat.model";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    let profile = await UserProfile.findOne({ userId });
    if (!profile) {
      profile = await UserProfile.create({ userId });
    }
    res.json({ profile });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const updates = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json({ profile, message: "Profile updated" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    await Promise.all([
      UserProfile.deleteOne({ userId }),
      Resume.deleteMany({ userId }),
      Conversation.deleteMany({ userId }),
    ]);

    res.json({ message: "Account deleted" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
};
