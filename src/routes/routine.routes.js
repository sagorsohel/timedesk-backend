import express from "express";
import {
  getRoutines,
  createRoutine,
  updateRoutineTimer,
  updateRoutine,
  deleteRoutine
} from "../controllers/routine.controller.js";

const routineRouter = express.Router();

routineRouter.get("/get-routines", getRoutines);
routineRouter.post("/create", createRoutine);
routineRouter.patch("/update-timer", updateRoutineTimer);
routineRouter.patch("/update", updateRoutine);
routineRouter.delete("/delete/:_id", deleteRoutine);

export default routineRouter;
