import projectModel from "../models/project.model.js";
import { sendError, sendSuccess } from "../utils/response.js";

/**
 * Create a new project
 */
export const createProject = async (req, res) => {
  try {
    const { name, description, tags, amount } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const newProject = new projectModel({
      name,
      description,
      tags: tags || [],
      amount: amount || 0,
      isDone: false,
      timerStart: null,
      totalTrackedTime: 0,
    });

    await newProject.save();

    sendSuccess(res, 201, "Project created successfully!", { newProject });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Project creating issue", { msg: err?.msg });
  }
};

/**
 * Get projects with pagination, search, and tag filtering
 */
export const getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      tags = "", // Comma-separated tags
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Match conditions for aggregation
    const matchStage = {};

    // Search by name or description
    if (search.trim()) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by tags
    if (tags.trim()) {
      const tagsArray = tags.split(",").map((t) => t.trim());
      matchStage.tags = { $in: tagsArray };
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [
            { $count: "total" },
            { $addFields: { page: pageNum, limit: limitNum } },
          ],
          data: [{ $skip: skip }, { $limit: limitNum }],
        },
      },
    ];

    const result = await projectModel.aggregate(pipeline);

    const projects = result[0]?.data || [];
    const total = result[0]?.metadata[0]?.total || 0;

    sendSuccess(res, 200, "Projects fetched successfully", {
      projects,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Error fetching projects", { msg: err?.message });
  }
};
