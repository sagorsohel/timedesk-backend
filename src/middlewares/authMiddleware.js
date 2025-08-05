// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { sendError } from "../utils/response.js";

// const JWT_SECRET = process.env.JWT_SECRET; // Preferably from process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return sendError(res, 401, "No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return sendError(res, 401, "Invalid token");

    req.user = user; // Attach authenticated user to request object
    next();
  } catch (err) {
    console.error("JWT Verify Error:", err.message); // 👈 for debugging

    return sendError(res, 401, "Token invalid or expired");
  }
};

export default authMiddleware;
