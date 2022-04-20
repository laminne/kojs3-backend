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
  let contest;
  try {
    contest = await oneContest(req.params.contestId);
  } catch (e) {
    res.status(400).send("エラーが発生しました");
    return;
  }
  res.json(contest);
}

export async function getContestTasks(req: Request, res: Response) {
  try {
    const tasks = await contestTasks(req.params.contestId);
    res.json(tasks);
    return;
  } catch (e) {
    res.status(400).send("エラーが発生しました");
  }
}

export async function getOneTask(req: Request, res: Response) {
  try {
    const tasks = await oneContestTask(req.params.taskId);
    res.json(tasks);
    return;
  } catch (e) {
    res.status(400).send("エラーが発生しました");
  }
}

export async function submission(req: Request, res: Response) {
  const body = {
    code: req.body.code,
    taskId: req.body.taskId,
    compilertype: req.body.compiler_type,
    userId: "374793af-2202-4cdc-b060-6f5865237a71",
  };
  try {
    const submission = await submissionTask(body);
    // ToDo: データの詰め直しをする
    res.send(submission);
    return;
  } catch (e) {
    console.log(e);
    res.status(400).send("エラーが発生しました");
  }
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
  const submission = await db.updateSubmissionStateByHqId(
    req.params.contestId,
    req.body.res,
    req.body.state
  );
  res.json(submission);
}
