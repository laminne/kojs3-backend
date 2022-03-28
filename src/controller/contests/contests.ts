import { Request, Response } from "express";
import {
  allContests,
  allSubmissions,
  contestTasks,
  oneContest,
  oneContestTask,
  getSubmission,
  submissionTask,
} from "../../service/contests/main";
import * as db from "../../prisma/queries/main";

// すべてのコンテストを取得
export async function getAllContests(_req: Request, res: Response) {
  const contests = await allContests();
  res.json(contests);
  return;
}

export async function getOneContest(req: Request, res: Response) {
  const contest = await oneContest(req.params.contestId);
  res.json(contest);
  return;
}

// export async function getContestRanking(req: Request, res: Response) {
//   console.log(req.path);
//   res.send("Hello");
// }

export async function getContestTasks(req: Request, res: Response) {
  const tasks = await contestTasks(req.params.contestId);
  res.json(tasks);
  return;
}

export async function getOneTask(req: Request, res: Response) {
  const tasks = await oneContestTask(req.params.taskId);
  res.json(tasks);
  return;
}

export async function submission(req: Request, res: Response) {
  const body = {
    code: req.body.code,
    taskId: req.body.taskId,
    compilertype: "ruby",
    userId: "62b3bb41-d18d-4ffb-ae2e-00a1a3cb2a91",
  };
  const submission = await submissionTask(body);
  res.send(submission);
  return;
}

export function getAllSubmission(_req: Request, res: Response) {
  const submissions = allSubmissions();
  res.send(submissions);
  return;
}

export async function getOneSubmission(req: Request, res: Response) {
  const submission = await getSubmission(req.params.submissionId);
  res.json(submission);
  return;
}

export async function updateState(req: Request, res: Response) {
  const submission = await db.updateSubmissionState(
    req.params.contestId,
    req.body.res,
    req.body.state
  );
  res.json(submission);
}
