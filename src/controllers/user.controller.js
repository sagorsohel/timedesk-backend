import { User } from "../models/user.model.js";
import { sendError, sendSuccess } from "../utils/response.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 400, "All fields are required");
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, "User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    return sendSuccess(res, 201, "User created successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
