import express from "express";
import { createProject, getProjectHistory, getProjects, markProjectDone, startTracking, stopTracking, updateProject } from "../controllers/project.controller.js";

const projectRouter = express.Router();

projectRouter.get('/get',getProjects)
projectRouter.post('/create',createProject)
projectRouter.patch('/update/:id',updateProject)
projectRouter.patch('/mark-as-done/:id',markProjectDone)
projectRouter.post("/:projectId/start",  startTracking);
projectRouter.post("/:projectId/stop",  stopTracking);
projectRouter.get("/:projectId/history",  getProjectHistory);

export default projectRouter;
