import { authRouter, usersRouter } from "./users.js";
import { contestsRouter } from "./contests.js";
import express from "express";
import { isTokenValid } from "../service/users/main.js";

const checkToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const t = req.headers.authorization;
  if (!t) {
    console.log("トークンがない");
    res.sendStatus(401);
    return;
  }
  if (t.split(" ")[0] == "Bearer") {
    if (isTokenValid(t.split(" ")[1])) {
      next();
      return;
    } else {
      res.sendStatus(400).send("Your token is invalid");
      return;
    }
  } else {
    console.log(t, t.split(" ")[1]);
    res.sendStatus(401);
  }
};

export const router = express.Router();
router.use("/users", checkToken, usersRouter);
router.use("/contests", checkToken, contestsRouter);
router.use("/", authRouter);
