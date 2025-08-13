import express from "express";
import { createProject, getProjects } from "../controllers/project.controller.js";

const projectRouter = express.Router();

projectRouter.get('/get',getProjects)
projectRouter.post('/create',createProject)

export default projectRouter;
