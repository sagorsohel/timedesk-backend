import express from "express";
import usersRouter from "./user.routes.js";


const router = express.Router();

router.use("/user", usersRouter);

export default router;