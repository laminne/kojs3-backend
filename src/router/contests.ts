import express from "express";
import { ContestController } from "../controller/contests/contests.js";
import { PrismaContestsRepository } from "../repository/prisma/contests.js";
import { PrismaSubmissionsRepository } from "../repository/prisma/submissions.js";
import { PrismaQueueRepository } from "../repository/prisma/queue.js";
import { prisma } from "../repository/prisma/client.js";

export const contestController: ContestController = new ContestController(
  new PrismaContestsRepository(prisma),
  new PrismaSubmissionsRepository(prisma),
  new PrismaQueueRepository(prisma)
);

export const contestsRouter = express.Router();

contestsRouter.route("/").get(contestController.getAllContests);
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
