import projectModel from "../models/project.model.js";
import { sendError, sendSuccess } from "../utils/response.js";

/**
 * Create a new project
 */
export const createProject = async (req, res) => {
    try {
      const { name, description, tags, amount } = req.body;
  
      if (!name || !description) {
        return sendError(res, 400, "Name and description are required");
      }
  
      const newProject = new projectModel({
        user: req.user._id, // User from auth middleware
        name,
        description,
        tags: tags || [],
        amount: amount || 0,
      });
  
      await newProject.save();
      sendSuccess(res, 201, "Project created successfully!", { newProject });
    } catch (err) {
      console.error(err);
      sendError(res, 500, "Project creating issue", { msg: err?.message });
    }
  };
  

/**
 * Get projects with pagination, search, and tag filtering
 */
export const getProjects = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "", tags = "" } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;
  
      const matchStage = { user: req.user._id }; // Filter by logged-in user
  
      if (search.trim()) {
        matchStage.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
  
      if (tags.trim()) {
        matchStage.tags = { $in: tags.split(",").map((t) => t.trim()) };
      }
  
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
  

/**
 * Update project
 */

  export const updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, amount } = req.body;
  
      const updated = await projectModel.findOneAndUpdate(
        { _id: id, user: req.user._id }, // Only user's own project
        { name, description, amount },
        { new: true }
      );
  
      if (!updated) return sendError(res, 404, "Project not found");
  
      sendSuccess(res, 200, "Project updated successfully", { updated });
    } catch (err) {
      console.error(err);
      sendError(res, 500, "Error updating project", { msg: err?.message });
    }
  };
  

/**
 * Mark as done
 */


  export const markProjectDone = async (req, res) => {
    try {
      const { id } = req.params;
  
      const updated = await projectModel.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { isDone: true },
        { new: true }
      );
  
      if (!updated) return sendError(res, 404, "Project not found");
  
      sendSuccess(res, 200, "Project marked as done", { updated });
    } catch (err) {
      console.error(err);
      sendError(res, 500, "Error marking project as done", { msg: err?.message });
    }
  };
  