/*
   KEMOMIMI ONLINE JUDGE SYSTEM
   |C| 2021 - 2022 Tatsuto Yamamoto
   This Software is licensed under MIT License.
 */

import express from "express";
import { usersRouter } from "./users/main";
import { contestsRouter } from "./contests/main";
import { runsRouter } from "./run/runs";
const app = express();
// Routeing

export function router() {
  const allowCrossDomain = function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
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
  app.use(allowCrossDomain);
  app.use(express.json());
  app.use("/users", usersRouter);
  app.use("/contests", contestsRouter);
  app.use("/runs", runsRouter);
  // app.use("/", root);
  app.listen(3080);
}

// function root(_: any, res: express.Response) {
//   res.send("KEMOMIMI JUDGE v0.0.1");
// }
