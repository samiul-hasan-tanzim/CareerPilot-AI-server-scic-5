import { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/verifyToken";
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
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { skills: { $regex: escaped, $options: "i" } },
        { industry: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
        { shortDescription: { $regex: escaped, $options: "i" } },
        { company: { $regex: escaped, $options: "i" } },
      ];
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

    const minVal = minSalary ? parseInt(minSalary, 10) : NaN;
    const maxVal = maxSalary ? parseInt(maxSalary, 10) : NaN;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const sortField = ["title", "salary", "growth", "level", "industry", "createdAt"].includes(sort)
      ? sort
      : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    let careers;
    let total: number;

    if (!isNaN(minVal) || !isNaN(maxVal)) {
      const salaryFilter: Record<string, number> = {};
      if (!isNaN(minVal)) salaryFilter.$gte = minVal;
      if (!isNaN(maxVal)) salaryFilter.$lte = maxVal;

      const sortDir = sortOrder as 1 | -1;
      const sortKey = sortField === "salary" ? "salaryNum" : sortField;

      const addSalaryNum = {
        $addFields: {
          salaryNum: {
            $convert: {
              input: {
                $arrayElemAt: [
                  { $split: [{ $arrayElemAt: [{ $split: ["$salary", "$"] }, 1] }, "K"] },
                  0,
                ],
              },
              to: "int",
              onError: -1,
              onNull: -1,
            },
          },
        },
      };

      const results = await Career.aggregate([
        { $match: filter },
        addSalaryNum,
        { $match: { salaryNum: salaryFilter } },
        { $sort: { [sortKey]: sortDir } },
        { $skip: skip },
        { $limit: limitNum },
      ]);
      careers = results;

      const countResult = await Career.aggregate([
        { $match: filter },
        addSalaryNum,
        { $match: { salaryNum: salaryFilter } },
        { $count: "total" },
      ]);
      total = countResult.length > 0 ? (countResult[0] as { total: number }).total : 0;
    } else {
      [careers, total] = await Promise.all([
        Career.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum).lean(),
        Career.countDocuments(filter),
      ]);
    }

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
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Get careers error:", msg);
    res.status(500).json({ message: "Failed to fetch careers", error: msg });
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
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Get career error:", msg);
    res.status(500).json({ message: "Failed to fetch career", error: msg });
  }
};

export const getMyCareers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const careers = await Career.find({ createdBy: req.userId }).sort({ createdAt: -1 }).lean();
    res.json({ careers });
  } catch (error) {
    console.error("Get my careers error:", error);
    res.status(500).json({ message: "Failed to fetch your careers" });
  }
};

export const createCareer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const career = await Career.create({ ...req.body, createdBy: req.userId });
    res.status(201).json({ career });
  } catch (error) {
    console.error("Create career error:", error);
    res.status(500).json({ message: "Failed to create career" });
  }
};

export const updateCareer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await Career.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ message: "Career not found" });
      return;
    }
    if (existing.createdBy !== req.userId) {
      res.status(403).json({ message: "You can only update your own careers" });
      return;
    }
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ career });
  } catch (error) {
    console.error("Update career error:", error);
    res.status(500).json({ message: "Failed to update career" });
  }
};

export const deleteCareer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await Career.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ message: "Career not found" });
      return;
    }
    if (existing.createdBy !== req.userId) {
      res.status(403).json({ message: "You can only delete your own careers" });
      return;
    }
    await Career.findByIdAndDelete(req.params.id);
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
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Get filter options error:", msg);
    res.status(500).json({ message: "Failed to fetch filter options", error: msg });
  }
};
