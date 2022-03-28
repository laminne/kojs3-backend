import express, { Request, Response } from "express";
import * as db from "../../prisma/queries/main";

export const runsRouter = express.Router();
runsRouter.put("/:id", updateRun);
// ここの:idはhqが発行したid
async function updateRun(req: Request, res: Response) {
  let state: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC" = "AC";
  for (let i = 0; i < req.body.Status.length; i++) {
    if (req.body.Status[i] != "AC") {
      // 1つでもACでないものはACにならない
      state = req.body.Status[i];
    }
  }

  const submission = await db.updateSubmissionState(
    req.params.id,
    req.body.Status,
    state
  );
  res.json(submission);
}
/*

{
  "TaskID":"000-000",
  "Status":[
    {
      "TestID":"",
      "ExitStatus":0,
      "Duration":3118,
      "Status":"WA"
    },
    {
      "TestID":"",
      "ExitStatus":0,
      "Duration":3071,
      "Status":"WA"
    },
    {
      "TestID":"",
      "ExitStatus":0,
      "Duration":3069,
      "Status":"WA"
     }
   ]
}

*/
