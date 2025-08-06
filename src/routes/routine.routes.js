import express from "express";
import {
  getRoutines,
  createRoutine,
  updateRoutineTimer,
  updateRoutine
} from "../controllers/routine.controller.js";

const routineRouter = express.Router();

routineRouter.get("/get-routines", getRoutines);
routineRouter.post("/create", createRoutine);
routineRouter.patch("/update-timer", updateRoutineTimer);
routineRouter.patch("/update", updateRoutine);

export default routineRouter;
