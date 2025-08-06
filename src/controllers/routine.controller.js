import mongoose from "mongoose";
import { UserRoutine } from "../models/routine.model.js";
import { sendError, sendSuccess } from "../utils/response.js";

export const getRoutines = async (req, res) => {
  const userId = req.user._id;

  try {
    const routines = await UserRoutine.find({ userId });
    return sendSuccess(res, 200, "Routines fetched successfully", routines);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const createRoutine = async (req, res) => {
  const userId = req.user._id;
  const { name, durationSeconds } = req.body;

  if (!name || !durationSeconds) {
    return sendError(res, 400, "Name and durationSeconds are required");
  }

  try {
    const newRoutineItem = {
      id: Date.now(),
      name,
      duration: durationSeconds, // Optional readable format
      originalDurationSeconds: durationSeconds,
      remainingSeconds: durationSeconds,
      isRunning: false,
      isFinished: false,
    };

    let userRoutine = await UserRoutine.findOne({ userId });

    if (!userRoutine) {
      userRoutine = await UserRoutine.create({
        userId,
        routines: [newRoutineItem],
      });
    } else {
      userRoutine.routines.push(newRoutineItem);
      await userRoutine.save();
    }

    return sendSuccess(
      res,
      201,
      "Routine created successfully",
      newRoutineItem
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
export const updateRoutineTimer = async (req, res) => {
  const userId = req.user._id;
  const { _id, remainingSeconds, isFinished, isRunning } = req.body;

  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return sendError(res, 400, "Valid routine _id is required");
  }

  try {
    const userRoutine = await UserRoutine.findOne({ userId });
    if (!userRoutine) {
      return sendError(res, 404, "User routines not found");
    }

    // Find routine by MongoDB ObjectId
    const routine = userRoutine.routines.id(_id);
    if (!routine) {
      return sendError(res, 404, "Routine not found");
    }

    // Update fields
    if (typeof remainingSeconds === "number") {
      routine.remainingSeconds = remainingSeconds;
    }

    if (typeof isFinished === "boolean") {
      routine.isFinished = isFinished;
    }

    if (typeof isRunning === "boolean") {
      routine.isRunning = isRunning;
    }

    await userRoutine.save();

    return sendSuccess(res, 200, "Routine updated successfully", routine);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateRoutine = async (req, res) => {
  const userId = req.user._id;
  const { _id, name, originalDurationSeconds } = req.body;

  // Validate routine ID
  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return sendError(res, 400, "Valid routine _id is required");
  }

  try {
    // Find user's routines
    const userRoutine = await UserRoutine.findOne({ userId });
    if (!userRoutine) {
      return sendError(res, 404, "User routines not found");
    }

    // Find the specific routine
    const routine = userRoutine.routines.id(_id);
    if (!routine) {
      return sendError(res, 404, "Routine not found");
    }

    // Update fields
    if (typeof name === "string") {
      routine.name = name;
    }

    if (typeof originalDurationSeconds === "number") {
      routine.originalDurationSeconds = originalDurationSeconds;
      // Optional: also update remainingSeconds if you want it to reset
      routine.remainingSeconds = originalDurationSeconds;
    }

    await userRoutine.save();

    return sendSuccess(res, 200, "Routine updated successfully", routine);
  } catch (error) {
    console.error("Update routine error:", error);
    return sendError(res, 500, error.message);
  }
};
export const deleteRoutine = async (req, res) => {
    const userId = req.user._id;
    const { _id } = req.body;
  
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return sendError(res, 400, "Valid routine _id is required");
    }
  
    try {
      const userRoutine = await UserRoutine.findOne({ userId });
      if (!userRoutine) {
        return sendError(res, 404, "User routines not found");
      }
  
      const routine = userRoutine.routines.id(_id);
      if (!routine) {
        return sendError(res, 404, "Routine not found");
      }
  
      // Remove the routine from the array
      routine.remove();
  
      await userRoutine.save();
  
      return sendSuccess(res, 200, "Routine deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting routine:", error);
      return sendError(res, 500, error.message);
    }
  };
  