// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


const JWT_SECRET = process.env.JWT_SECRET; // Preferably from process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user; // Attach authenticated user to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

export default authMiddleware;
