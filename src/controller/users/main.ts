import express from "express";
import { getAllUsers, getUserData } from "./users";

export const usersRouter = express.Router();

usersRouter.route("/").get(getAllUsers);

usersRouter.route("/users/:userId").get(getUserData);
