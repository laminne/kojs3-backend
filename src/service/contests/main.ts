import {
  getAllContests,
  getContestTasks,
  getOneContest,
  getOneContestTask,
  newSubmission,
  oneSubmission,
  Submission,
  submissions,
  SubmitQueue,
} from "../../repository/contests/main";
import { enqueue, hqURL, Job, HqResponse } from "./jobqueuemanager";

export async function allContests() {
  return await getAllContests();
}

export async function oneContest(contestId: string) {
  return await getOneContest(contestId);
}

export async function contestTasks(contestId: string) {
  return await getContestTasks(contestId);
}

export async function oneContestTask(taskId: string) {
  return await getOneContestTask(taskId);
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
  const subres = await newSubmission(submission);
  const res = await enqueue(jobqueue);
  if (isHqResponse(res)) {
    await SubmitQueue({
      status: res.status,
      submission: subres.id,
      hqId: res.id,
    });
  }
}

export async function allSubmissions() {
  return await submissions();
}

export async function getSubmission(id: string) {
  return await oneSubmission(id);
}

// export async function updateState(id: string, response: string) {
//   return "";
// }

const isHqResponse = (arg: unknown): arg is HqResponse =>
  typeof arg === "object" && arg !== null;
