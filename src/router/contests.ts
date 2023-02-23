import express from "express";
import { ContestController } from "../controller/contests/contests.js";
import {
  PrismaContestsRepository,
  PrismaProblemRepository,
} from "../repository/prisma/contests.js";
import { PrismaSubmissionsRepository } from "../repository/prisma/submissions.js";
import { prisma } from "../repository/prisma/client.js";

export const contestController: ContestController = new ContestController(
  new PrismaContestsRepository(prisma),
  new PrismaSubmissionsRepository(prisma),
  new PrismaProblemRepository(prisma)
);

export const contestsRouter = express.Router();

contestsRouter.route("/").get(contestController.getAllContests);
contestsRouter.route("/:contestId").get(contestController.getContest);

contestsRouter
  .route("/:contestId/problems")
  .get(contestController.getContestProblems);

contestsRouter
  .route("/:contestId/problems/:taskId")
  .get(contestController.getContestProblem);

contestsRouter
  .route("/:contestId/submissions")
  .post(contestController.createSubmission);

contestsRouter
  .route("/:contestId/submissions/:submissionId")
  .get(contestController.getSubmission);
