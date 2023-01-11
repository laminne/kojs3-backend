import express from "express";
import { usersController } from "../main";
export const usersRouter = express.Router();

usersRouter.route("/").get(usersController.getAllUsers);
usersRouter.route("/users/:userId").get(usersController.getUserData);

export const authRouter = express.Router();
authRouter.route("/login").post(usersController.login);
authRouter.route("/register").post(usersController.register);
