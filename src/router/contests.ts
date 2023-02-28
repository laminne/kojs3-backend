import express from "express";
import { ContestController } from "../controller/contests/contests.js";
import {
  PrismaContestsRepository,
  PrismaProblemRepository,
} from "../repository/prisma/contests.js";
import { PrismaSubmissionsRepository } from "../repository/prisma/submissions.js";
import { prisma } from "../repository/prisma/client.js";
import {
  InmemoryContestsRepository,
  InmemoryProblemRepository,
} from "../repository/memory/contest.js";
import { InmemorySubmissionsRepository } from "../repository/memory/submission.js";
import {
  CaseMockData,
  ContestsMockData,
  ProblemMockData,
  SubmissionMockData,
} from "./mockData.js";
import { HqQueue } from "../service/contests/jobqueuemanager.js";

export let contestController: ContestController;

if (process.env.JK_MODE === "db") {
  contestController = new ContestController(
    new PrismaContestsRepository(prisma),
    new PrismaSubmissionsRepository(prisma),
    new PrismaProblemRepository(prisma),
    new HqQueue("http://localhost:19900/job"),
    "http://localhost:3030/run"
  );
} else {
  contestController = new ContestController(
    new InmemoryContestsRepository(ContestsMockData),
    new InmemorySubmissionsRepository(SubmissionMockData),
    new InmemoryProblemRepository(ProblemMockData, CaseMockData),
    new HqQueue("http://localhost:19900/job"),
    "http://localhost:3030/run"
  );
}
export const contestsRouter = express.Router();

contestsRouter.route("/").get(contestController.getAllContests);
contestsRouter.route("/:contestId").get(contestController.getContest);

contestsRouter
  .route("/:contestId/problems")
  .get(contestController.getContestProblems)
  .post(contestController.createContestProblem);

contestsRouter
  .route("/:contestId/problems/:taskId")
  .get(contestController.getContestProblem);

contestsRouter
  .route("/:contestId/submissions")
  .post(contestController.createSubmission);

contestsRouter
  .route("/:contestId/submissions/:submissionId")
  .get(contestController.getSubmission);
