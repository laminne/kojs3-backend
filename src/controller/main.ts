/*
   J "K" ONLINE JUDGE SYSTEM
   |C| 2021 - 2023 Tatsuto Yamamoto
   |C| 2022 - 2023 MCT-JOKEN
   This Software is licensed under MIT License.
 */

import express from "express";
import { usersRouter } from "./users/main";
import { contestsRouter } from "./contests/main";
import { authRouter } from "./users/main";
import "./ws/main";
import { PrismaClient } from "@prisma/client";
import { ContestController } from "./contests/contests";
import { UsersController } from "./users/users";
import { isTokenValid } from "../service/users/main";

const app = express();
const prisma = new PrismaClient();
export const contestController = new ContestController(prisma);
export const usersController = new UsersController(prisma);

export function router() {
  const allowCrossDomain = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, access_token"
    );

    // intercept OPTIONS method
    if ("OPTIONS" === req.method) {
      res.send(200);
    } else {
      next();
    }
  };

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

  app.use(allowCrossDomain);
  app.use(express.json());
  app.use("/users", checkToken, usersRouter);
  app.use("/contests", checkToken, contestsRouter);
  app.use("/", authRouter);
  app.listen(3080, () => {
    console.log(" ____  _    _      _____  ____  _____ ");
    console.log("|____|| | / /     |  _  ||____||  ___|");
    console.log("   | || |/ /  ___ | | | |   | || |___ ");
    console.log("   | || | <  |___|| | | |   | ||___  |");
    console.log(" __| || |\\ \\      | |_| | __| | ___| |");
    console.log("|____||_| \\_\\     |_____||____||_____|");
    console.log("");
    console.log("  J      K     -     O     J      S");
    console.log("2 0 2 2 - 2 3  M C T - J O K E N");
    console.log("server started :3080");
  });
}
