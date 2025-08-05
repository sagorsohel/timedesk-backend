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
