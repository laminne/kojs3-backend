import express from "express";
import {
  getAllContests,
  getAllSubmission,
  getContestTasks,
  getOneContest,
  getOneSubmission,
  getOneTask,
  submission,
  updateState,
} from "./contests";

export const contestsRouter = express.Router();
contestsRouter.route("/").get(getAllContests);
console.log("あいうえお");
contestsRouter.route("/:contestId").get(getOneContest);

contestsRouter.route("/:contestId/tasks").get(getContestTasks);

// contestsRouter.route("/:contestId/ranking").get(getContestRanking);

contestsRouter.route("/:contestId/tasks/:taskId").get(getOneTask);

contestsRouter.route("/:contestId/submit").post(submission);

contestsRouter.route("/:contestId/submissions").get(getAllSubmission);

contestsRouter
  .route("/:contestId/submissions/:submissionId")
  .get(getOneSubmission)
  .patch(updateState);
