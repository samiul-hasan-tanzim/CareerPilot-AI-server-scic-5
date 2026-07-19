import { Request, Response, NextFunction } from "express";

type Rule = {
  field: string;
  type: "string" | "number" | "boolean" | "array" | "email";
  required?: boolean;
  min?: number;
  max?: number;
};

export const validate = (rules: Rule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === "")) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      if (value === undefined || value === null || value === "") continue;

      if (rule.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${rule.field} must be a valid email`);
        }
      }

      if (rule.type === "string" && typeof value !== "string") {
        errors.push(`${rule.field} must be a string`);
      } else if (rule.type === "number" && typeof value !== "number") {
        errors.push(`${rule.field} must be a number`);
      } else if (rule.type === "boolean" && typeof value !== "boolean") {
        errors.push(`${rule.field} must be a boolean`);
      } else if (rule.type === "array" && !Array.isArray(value)) {
        errors.push(`${rule.field} must be an array`);
      }

      if (rule.type === "string" && typeof value === "string") {
        if (rule.min && value.length < rule.min) {
          errors.push(`${rule.field} must be at least ${rule.min} characters`);
        }
        if (rule.max && value.length > rule.max) {
          errors.push(`${rule.field} must be at most ${rule.max} characters`);
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    next();
  };
};
