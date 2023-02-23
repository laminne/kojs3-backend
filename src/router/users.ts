import express from "express";
import { UsersController } from "../controller/users/users.js";
import { PrismaUsersRepository } from "../repository/prisma/users.js";
import { prisma } from "../repository/prisma/client.js";
import { InmemoryUserRepository } from "../repository/memory/users.js";
import { UserMockData } from "./mockData.js";

export let usersController: UsersController;
if (process.env.JK_MODE === "db") {
  usersController = new UsersController(new PrismaUsersRepository(prisma));
} else {
  usersController = new UsersController(
    new InmemoryUserRepository(UserMockData)
  );
}

export const usersRouter = express.Router();

usersRouter
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.register);
usersRouter.route("/:userId").get(usersController.getUserData);

export const authRouter = express.Router();
authRouter.route("/login").post(usersController.login);
