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
  


// start tracking time 
export const startTracking = async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.user._id;
  
      const project = await projectModel.findOne({ _id: projectId, userId });
      if (!project) return sendError(res, 404, "Project not found");
  
      project.timerStart = new Date();
      await project.save();
  
      sendSuccess(res, 200, "Timer started", { timerStart: project.timerStart });
    } catch (err) {
      sendError(res, 500, "Error starting timer", { msg: err?.message });
    }
  };
  

//   stop tracking

export const stopTracking = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { title } = req.body;
      const userId = req.user._id;
  
      const project = await projectModel.findOne({ _id: projectId, userId });
      if (!project) return sendError(res, 404, "Project not found");
  
      if (!project.timerStart) return sendError(res, 400, "Timer not started");
  
      const endTime = new Date();
      const duration = Math.floor((endTime - project.timerStart) / 1000); // in seconds
  
      // Push to timeLogs
      project.timeLogs.push({
        title,
        date: new Date(),
        duration,
        startedAt: project.timerStart,
        endedAt: endTime,
      });
  
      // Update totalTrackedTime
      project.totalTrackedTime += duration;
  
      // Reset timerStart
      project.timerStart = null;
  
      await project.save();
  
      sendSuccess(res, 200, "Timer stopped and saved", { project });
    } catch (err) {
      sendError(res, 500, "Error stopping timer", { msg: err?.message });
    }
  };

  
//   get history 
export const getProjectHistory = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { date } = req.query; // optional YYYY-MM-DD
      const userId = req.user._id;
  
      const project = await projectModel.findOne({ _id: projectId, userId });
      if (!project) return sendError(res, 404, "Project not found");
  
      let logs = project.timeLogs;
  
      if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
  
        logs = logs.filter(log => log.date >= start && log.date <= end);
      }
  
      sendSuccess(res, 200, "History fetched", { logs });
    } catch (err) {
      sendError(res, 500, "Error fetching history", { msg: err?.message });
    }
  };
  