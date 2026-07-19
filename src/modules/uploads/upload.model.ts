import mongoose, { Schema, Document } from "mongoose";

export interface IResume extends Document {
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileBuffer: Buffer;
  extractedData?: {
    skills: string[];
    experience: string[];
    education: string[];
    technologies: string[];
  };
  analysis?: {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  createdAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },
    fileBuffer: { type: Buffer, required: true },
    extractedData: {
      skills: [String],
      experience: [String],
      education: [String],
      technologies: [String],
    },
    analysis: {
      score: { type: Number },
      summary: { type: String },
      strengths: [String],
      weaknesses: [String],
      recommendations: [String],
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>("Resume", resumeSchema);
