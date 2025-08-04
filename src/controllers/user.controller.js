import { User } from "../models/user.model.js";
import { sendError, sendSuccess } from "../utils/response.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, "All fields are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 400, "User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return sendError(res, 400, "Invalid password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return sendSuccess(res, 200, "Login successful", { token, userData });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
