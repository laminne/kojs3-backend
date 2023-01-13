import { prisma } from "./client.js";
import { PrismaClientInitializationError } from "@prisma/client/runtime/index.js";
import { DBConnectionError } from "./error.js";
import { ContestsRepository } from "../contestRepository.js";

export class PrismaContestsRepository implements ContestsRepository {
  async findAllSubmissions() {
    return await prisma.submissions.findMany({});
  }

  public findAllContests = async (): Promise<Array<any>> => {
    return await prisma.contest.findMany({});
  };

  public findByID = async (id: string): Promise<any> => {
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
  };

  public findTaskByID = async (id: string): Promise<any> => {
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
  };

  public findSubmissionByID = async (id: string): Promise<any> => {
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
  };

  public findAllContestTasks = async (
    contestId: string
  ): Promise<Array<any>> => {
    try {
      return await prisma.tasks.findMany({
        where: {
          contestId: contestId,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientInitializationError) {
        throw new DBConnectionError();
      }
      throw e;
    }
  };
}
