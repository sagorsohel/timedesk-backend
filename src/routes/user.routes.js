import express from "express";
import { login, signUp } from "../controllers/user.controller.js";

const usersRouter = express.Router();

usersRouter.post("/signup", signUp);
usersRouter.post("/login", login);

export default usersRouter;