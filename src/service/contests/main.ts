import * as db from "../../prisma/queries/main";
import { enqueue, Job, HqResponse } from "./jobqueuemanager";
import { renderMarkdownToHTML } from "../misc/mdrender";

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
  const res = await db.findContestById(contestId);
  if (!res) {
    return;
  }
  const i = isContestStarted(res.starting_time);
  if (!i) {
    throw new Error("ContestNotStartedError");
  }
  res.descriptions = await renderMarkdownToHTML(res.descriptions);
  return res;
}

export async function contestTasks(contestId: string) {
  return await db.SearchContestTasksById(contestId);
}

export async function oneContestTask(taskId: string) {
  const res = await db.findContestTaskById(taskId);
  if (!res) {
    return;
  }
  const r = await db.findContestById(res.contestId);
  if (!r) {
    return;
  }
  const i = isContestStarted(r.starting_time);
  if (!i) {
    throw new Error("ContestNotStartedError");
  }
  res.description = await renderMarkdownToHTML(res.description);
  return res;
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
  try {
    try {
      const res = await enqueue(jobqueue);
      // Enqueue時の返り値に応じて動作を変える
      if (isHqResponse(res)) {
        const subres = await db.createSubmission(submission);
        await db.SubmitQueue({
          status: res.status,
          submission: subres.id,
          hqId: res.id,
        });
        return subres;
      }
    } catch (e) {
      const subres = await db.createSubmission(submission);
      const r = await db.updateSubmissionStateById(subres.id, "", "IE");
      console.log(r);
      return r;
    }
    return;
  } catch (e) {
    console.log(e);
    throw e;
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

// true->started
function isContestStarted(T: Date): boolean {
  return T < new Date();
}

const isHqResponse = (arg: unknown): arg is HqResponse =>
  typeof arg === "object" && arg !== null;
