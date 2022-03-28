import { prisma } from "../../client";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { DBConnectionError } from "../../error";

export async function findAllSubmissions() {
  return await prisma.submissions.findMany({});
}

export async function findAllContests() {
  return await prisma.contest.findMany({});
}

export async function findContestById(id: string) {
  try {
    return await prisma.contest.findUnique({
      where: {
        id: id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientInitializationError) {
      throw new DBConnectionError();
    }
    throw e;
  }
}

export async function findContestTaskById(id: string) {
  try {
    return await prisma.tasks.findUnique({
      where: {
        id: id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientInitializationError) {
      throw new DBConnectionError();
    }
    throw e;
  }
}

export async function findSubmissionById(id: string) {
  try {
    return await prisma.submissions.findUnique({
      where: {
        id: id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientInitializationError) {
      throw new DBConnectionError();
    }
    throw e;
  }
}
