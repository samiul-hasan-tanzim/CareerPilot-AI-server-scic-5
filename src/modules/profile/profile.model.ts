import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  preferredRole: string;
  experienceLevel: string;
  expectedSalary: string;
  preferredLocation: string;
  notifications: {
    resumeAnalysis: boolean;
    jobRecommendations: boolean;
    weeklyInsights: boolean;
    marketing: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IUserProfile>(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    avatar: { type: String, default: "" },
    preferredRole: { type: String, default: "" },
    experienceLevel: { type: String, default: "" },
    expectedSalary: { type: String, default: "" },
    preferredLocation: { type: String, default: "" },
    notifications: {
      resumeAnalysis: { type: Boolean, default: true },
      jobRecommendations: { type: Boolean, default: true },
      weeklyInsights: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const UserProfile = mongoose.model<IUserProfile>("UserProfile", profileSchema);
