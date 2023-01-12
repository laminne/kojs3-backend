import express from "express";
import { UsersController } from "../controller/users/users.js";
import { PrismaUsersRepository } from "../prisma/users.js";

export const usersController: UsersController = new UsersController(
  new PrismaUsersRepository()
);
export const usersRouter = express.Router();

usersRouter.route("/").get(usersController.getAllUsers);
usersRouter.route("/:userId").get(usersController.getUserData);

export const authRouter = express.Router();
authRouter.route("/login").post(usersController.login);
authRouter.route("/register").post(usersController.register);
