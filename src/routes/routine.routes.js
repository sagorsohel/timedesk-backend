import express from "express";
import {
  getRoutines,
  createRoutine,
  updateRoutineTimer
} from "../controllers/routine.controller.js";

const routineRouter = express.Router();

routineRouter.get("/get-routines", getRoutines);
routineRouter.post("/create", createRoutine);
routineRouter.patch("/update-timer", updateRoutineTimer);

export default routineRouter;
