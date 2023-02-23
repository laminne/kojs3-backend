/*
   J "K" ONLINE JUDGE SYSTEM
   (C) 2021 - 2023 Tatsuto Yamamoto
   (C) 2022 - 2023 MCT-JOKEN
   This Software is licensed under MIT License.
 */

import express from "express";
import "../controller/ws/main.js";
import { router } from "./root.js";

export function startServer() {
  const app = express();

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

  app.use(allowCrossDomain);
  app.use(express.json());
  app.use("/api/v1", router);
  app.listen(3080, () => {
    console.log("🎀 Server started Port 3080");
  });
}
/*




*/
