import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  photoURL: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    photoURL: { type: String, default: "" },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
