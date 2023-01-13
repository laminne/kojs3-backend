/*
   J "K" ONLINE JUDGE SYSTEM
   (C) 2021 - 2023 Tatsuto Yamamoto
   (C) 2022 - 2023 MCT-JOKEN
   This Software is licensed under MIT License.
 */

import express from "express";
import "./ws/main.js";
import { router } from "../router/root.js";

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
  app.listen(3090, () => {
    console.log(" ____  _    _      _____  ____  _____ ");
    console.log("|____|| | / /     |  _  ||____||  ___|");
    console.log("   | || |/ /  ___ | | | |   | || |___ ");
    console.log("   | || | <  |___|| | | |   | ||___  |");
    console.log(" __| || |\\ \\      | |_| | __| | ___| |");
    console.log("|____||_| \\_\\     |_____||____||_____|");
    console.log("");
    console.log("(C) 2021-2023 Tatsuto Yamamoto");
    console.log("(C) 2022-2023 MCT-JOKEN");
    console.log("🎀 Server started Port 3080");
  });
}
