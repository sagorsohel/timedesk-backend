import express from "express";
import { createProject, getProjects, markProjectDone, updateProject } from "../controllers/project.controller.js";

const projectRouter = express.Router();

projectRouter.get('/get',getProjects)
projectRouter.post('/create',createProject)
projectRouter.patch('/update/:id',updateProject)
projectRouter.patch('/mark-as-done/:id',markProjectDone)

export default projectRouter;
