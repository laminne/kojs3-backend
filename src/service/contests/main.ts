import * as db from "../../prisma/queries/main";
import { enqueue, Job, HqResponse } from "./jobqueuemanager";

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
    userId: body.userId,
  };
  const jobqueue: Job = {
    url: "http://127.0.0.1:3000/run",
    payload: {
      // task_id: submission.taskId,
      task_id: "000-000",
      compiler_type: submission.compilerType,
      code: submission.code,
    },
  };
  console.log(submission.compilerType, "コンパイラタイプ");
  const subres = await db.createSubmission(submission);
  const res = await enqueue(jobqueue);
  if (isHqResponse(res)) {
    await db.SubmitQueue({
      status: res.status,
      submission: subres.id,
      hqId: res.id,
    });
  }
  return subres;
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
