import { Request, Response } from "express";
import { Career } from "./career.model";

export const getCareers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      level,
      industry,
      remote,
      minSalary,
      maxSalary,
      sort = "createdAt",
      order = "desc",
      page = "1",
      limit = "12",
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (level) {
      filter.level = { $regex: level, $options: "i" };
    }

    if (industry) {
      filter.industry = { $regex: industry, $options: "i" };
    }

    if (remote === "true") {
      filter.remote = true;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const sortField = ["title", "salary", "growth", "level", "industry", "createdAt"].includes(sort)
      ? sort
      : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const [careers, total] = await Promise.all([
      Career.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum).lean(),
      Career.countDocuments(filter),
    ]);

    res.json({
      careers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get careers error:", error);
    res.status(500).json({ message: "Failed to fetch careers" });
  }
};

export const getCareerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const career = await Career.findById(req.params.id).lean();

    if (!career) {
      res.status(404).json({ message: "Career not found" });
      return;
    }

    res.json({ career });
  } catch (error) {
    console.error("Get career error:", error);
    res.status(500).json({ message: "Failed to fetch career" });
  }
};

export const createCareer = async (req: Request, res: Response): Promise<void> => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ career });
  } catch (error) {
    console.error("Create career error:", error);
    res.status(500).json({ message: "Failed to create career" });
  }
};

export const updateCareer = async (req: Request, res: Response): Promise<void> => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!career) {
      res.status(404).json({ message: "Career not found" });
      return;
    }
    res.json({ career });
  } catch (error) {
    console.error("Update career error:", error);
    res.status(500).json({ message: "Failed to update career" });
  }
};

export const deleteCareer = async (req: Request, res: Response): Promise<void> => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) {
      res.status(404).json({ message: "Career not found" });
      return;
    }
    res.json({ message: "Career deleted" });
  } catch (error) {
    console.error("Delete career error:", error);
    res.status(500).json({ message: "Failed to delete career" });
  }
};

export const getFilterOptions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [levels, industries] = await Promise.all([
      Career.distinct("level"),
      Career.distinct("industry"),
    ]);

    res.json({
      levels: levels.filter(Boolean).sort(),
      industries: industries.filter(Boolean).sort(),
    });
  } catch (error) {
    console.error("Get filter options error:", error);
    res.status(500).json({ message: "Failed to fetch filter options" });
  }
};
