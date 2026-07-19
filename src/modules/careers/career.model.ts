import mongoose, { Schema, Document } from "mongoose";

export interface ICareer extends Document {
  title: string;
  skills: string[];
  salary: string;
  growth: string;
  level: string;
  industry: string;
  remote: boolean;
  description: string;
  company: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const careerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true },
    skills: [String],
    salary: { type: String, default: "" },
    growth: { type: String, default: "" },
    level: { type: String, default: "Mid" },
    industry: { type: String, default: "Tech" },
    remote: { type: Boolean, default: false },
    description: { type: String, default: "" },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

careerSchema.index({ title: "text", skills: "text", industry: "text", company: "text", description: "text" });

export const Career = mongoose.model<ICareer>("Career", careerSchema);
