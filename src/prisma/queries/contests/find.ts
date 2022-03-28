import { prisma } from "../../client";

export async function findAllSubmissions() {
  return await prisma.submissions.findMany({});
}

export async function findAllContests() {
  return await prisma.contest.findMany({});
}

export async function findContestById(id: string) {
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

export async function findContestTaskById(id: string) {
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

export async function findSubmissionById(id: string) {
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
