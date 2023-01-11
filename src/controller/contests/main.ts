import express from "express";
import { contestController } from "../main";

export const contestsRouter = express.Router();

contestsRouter.route("/").get(contestController.getAllContests);
console.log("あいうえお");
contestsRouter.route("/:contestId").get(contestController.getOneContest);

contestsRouter
  .route("/:contestId/tasks")
  .get(contestController.getContestTasks);

contestsRouter
  .route("/:contestId/tasks/:taskId")
  .get(contestController.getOneTask);

contestsRouter.route("/:contestId/submit").post(contestController.submission);

contestsRouter
  .route("/:contestId/submissions")
  .get(contestController.getAllSubmission);

contestsRouter
  .route("/:contestId/submissions/:submissionId")
  .get(contestController.getOneSubmission);
