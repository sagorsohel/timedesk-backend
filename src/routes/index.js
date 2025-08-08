import express from "express";
import usersRouter from "./user.routes.js";
import routineRouter from "./routine.routes.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import authRouter from "./auth.routes.js";


const router = express.Router();


router.use("/auth", authRouter);
router.use("/user", usersRouter);
router.use("/routines",authMiddleware, routineRouter);

export default router;