import express from "express";
import { signUp } from "../controllers/user.controller.js";

const usersRouter = express.Router();

usersRouter.post("/signup", signUp);

export default usersRouter;