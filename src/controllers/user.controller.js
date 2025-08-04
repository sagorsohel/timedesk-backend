import { User } from "../models/user.model.js";
import { sendError, sendSuccess } from "../utils/response.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });
  sendSuccess(res, 201, "User created successfully", { name, email });

  try {
    const user = await User.create({ name, email, password: hashedPassword });
    sendSuccess(res, 201, "User created successfully", { name, email });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};
