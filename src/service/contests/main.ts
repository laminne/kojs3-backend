import * as db from "../../prisma/queries/main";
import { enqueue, hqURL, Job, HqResponse } from "./jobqueuemanager";

export type Submission = {
  code: string;
  taskId: string;
  userId: string;
  compilerType: string;
  state?: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC" | "WJ";
};

export async function allContests() {
  return await db.findAllContests();
}

export async function oneContest(contestId: string) {
  return await db.findContestById(contestId);
}

export async function contestTasks(contestId: string) {
  return await db.SearchContestTasksById(contestId);
}

export async function oneContestTask(taskId: string) {
  return await db.findContestTaskById(taskId);
}

export async function submissionTask(body: {
  code: string;
  compilertype: string;
  taskId: string;
  userId: string;
}) {
  const submission: Submission = {
    code: body.code,
    taskId: body.taskId,
    compilerType: body.compilertype,
    userId: body.taskId,
  };
  const jobqueue: Job = {
    url: hqURL,
    payload: {
      task_id: submission.taskId,
      compiler_type: submission.compilerType,
      code: submission.code,
    },
  };
  const subres = await db.createSubmission(submission);
  const res = await enqueue(jobqueue);
  if (isHqResponse(res)) {
    await db.SubmitQueue({
      status: res.status,
      submission: subres.id,
      hqId: res.id,
    });
  }
}

export async function allSubmissions() {
  return await db.findAllSubmissions();
}

export async function getSubmission(id: string) {
  return await db.findSubmissionById(id);
}

// export async function updateState(id: string, response: string) {
//   return "";
// }

const isHqResponse = (arg: unknown): arg is HqResponse =>
  typeof arg === "object" && arg !== null;
