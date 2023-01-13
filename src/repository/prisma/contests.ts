import { PrismaClientInitializationError } from "@prisma/client/runtime/index.js";
import { DBConnectionError } from "./error.js";
import { ContestsRepository } from "../contestRepository.js";
import { PrismaClient } from "@prisma/client/index.js";

export class PrismaContestsRepository implements ContestsRepository {
  private readonly _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async findAllSubmissions() {
    return await this._prisma.submissions.findMany({});
  }

  public findAllContests = async (): Promise<Array<any>> => {
    return await this._prisma.contest.findMany({});
  };

  public findByID = async (id: string): Promise<any> => {
    try {
      return await this._prisma.contest.findUnique({
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
      return await this._prisma.tasks.findUnique({
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
      return await this._prisma.submissions.findUnique({
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
      return await this._prisma.tasks.findMany({
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
