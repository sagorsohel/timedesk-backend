import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";

const authRouter = express.Router();

// Step 1: Redirect user to GitHub for login
authRouter.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"], session: false })
  );
  
  authRouter.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/login", session: false }),
    (req, res) => {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  
      // Serialize user data for frontend
      const userData = encodeURIComponent(
        JSON.stringify({
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          // add other fields if needed
        })
      );
  
      // Redirect with token and user data
      res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}&user=${userData}`);
    }
  );
  
  
export default authRouter;
