import { Contest, PrismaClient, Tasks, Submissions } from "@prisma/client";

const prisma = new PrismaClient();

export type Submission = {
  code: string;
  taskId: string;
  userId: string;
  compilerType: string;
  state?: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC" | "WJ";
};

export async function getAllContests(): Promise<Array<Contest>> {
  return await prisma.contest.findMany({});
}

export async function getOneContest(id: string): Promise<Contest | Error> {
  const contest = await prisma.contest.findUnique({
    where: {
      id: id,
    },
  });
  if (!contest) {
    return new Error("");
  } else {
    return contest;
  }
}

export async function getContestTasks(id: string): Promise<Array<Tasks>> {
  return await prisma.tasks.findMany({
    where: {
      contestId: id,
    },
  });
}

export async function getOneContestTask(id: string): Promise<Tasks | Error> {
  const task = await prisma.tasks.findUnique({
    where: {
      id: id,
    },
  });
  if (!task) {
    return new Error("");
  } else {
    return task;
  }
}

export async function newSubmission(body: Submission): Promise<Submissions> {
  // ToDo: ユーザーIDの固定をやめる
  return await prisma.submissions.create({
    data: {
      code: body.code,
      tasks: { connect: { id: body.taskId } },
      User: { connect: { id: "12312312" } },
      state: "WJ", // 実行開始時は必ず WJ (Waiting for Judge)
      response: "",
    },
  });
}

export async function submissions(): Promise<Array<Submissions>> {
  return await prisma.submissions.findMany({});
}

export async function oneSubmission(id: string): Promise<Submissions | Error> {
  const submission = await prisma.submissions.findUnique({
    where: {
      id: id,
    },
  });
  if (!submission) {
    return new Error("");
  } else {
    return submission;
  }
}

export async function SubmitQueue(queue: {
  status: string;
  submission: string;
  hqId: string;
}) {
  return await prisma.queue.create({
    data: {
      status: queue.status,
      submission: { connect: { id: queue.submission } },
      hqId: queue.hqId,
    },
  });
}

export async function updateSubmissionState(
  id: string,
  res: string,
  state: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC"
) {
  // ToDo: State固定やめろ

  // hqが発行するIDから提出を探す
  const q = await prisma.queue.findUnique({
    where: {
      hqId: id,
    },
  });

  if (!q || !q.submissionId) {
    return;
  }
  await prisma.submissions.update({
    where: {
      id: q.submissionId,
    },
    data: {
      response: res,
      state: state,
    },
  });
}
