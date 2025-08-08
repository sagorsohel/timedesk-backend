import express from "express";
import usersRouter from "./user.routes.js";
import routineRouter from "./routine.routes.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import authRouter from "./auth.routes.js";
import statsRouter from "./stats.routes.js";
import badgeRouter from "./badge.route.js";


const router = express.Router();

router.use("/stats", statsRouter);    // /api/stats/:userId
router.use("/badge", badgeRouter);    // /api/badge/:userId and /api/badge/graph/:userId
router.use("/auth", authRouter);
router.use("/user", usersRouter);
router.use("/routines",authMiddleware, routineRouter);

export default router;