import { prisma } from "./client";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { DBConnectionError } from "./error";

export class PrismaContestsRepository {
  async findAllSubmissions() {
    return await prisma.submissions.findMany({});
  }

  async findAllContests() {
    return await prisma.contest.findMany({});
  }

  async findContestById(id: string) {
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

  async findContestTaskById(id: string) {
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

  async findSubmissionById(id: string) {
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

  async SearchContestTasksById(id: string) {
    try {
      return await prisma.tasks.findMany({
        where: {
          contestId: id,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientInitializationError) {
        throw new DBConnectionError();
      }
      throw e;
    }
  }
}
