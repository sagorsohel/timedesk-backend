import express from "express";
import { getRoutines } from "../controllers/routine.controller.js";


const routineRouter = express.Router();

routineRouter.get("/get-routines", getRoutines);


export default routineRouter;