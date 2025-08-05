import express from "express";
import usersRouter from "./user.routes.js";
import routineRouter from "./routine.routes.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.use("/user", usersRouter);
router.use("/routines",authMiddleware, routineRouter);

export default router;