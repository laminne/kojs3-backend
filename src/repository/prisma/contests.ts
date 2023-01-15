import {
  caseUpdateArgs,
  ContestsRepository,
  ProblemRepository,
  problemUpdateArgs,
} from "../contestRepository.js";
import { PrismaClient } from "@prisma/client/index.js";
import { Contest } from "../../models/contest.js";
import { Failure, Result, Success } from "../../common/result.js";
import { Case, Problem } from "../../models/problems.js";

export type contestUpdateArg = Partial<{
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
}>;

export class PrismaContestsRepository implements ContestsRepository {
  private readonly _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  private static typeConverter(T: any) {
    return new Contest(T.id, T.title, T.description, T.startAt, T.endAt);
  }

  createContest = async (contest: Contest): Promise<Result<Contest, Error>> => {
    let q;
    try {
      q = await this._prisma.contest.create({
        data: {
          id: contest.id,
          title: contest.title,
          description: contest.description,
          startAt: contest.startAt,
          endAt: contest.endAt,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaContestsRepository.typeConverter(q);
    return new Success(res);
  };

  deleteContest = async (id: string): Promise<Result<Contest, Error>> => {
    let q;
    try {
      q = await this._prisma.contest.delete({ where: { id: id } });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaContestsRepository.typeConverter(q);
    return new Success(res);
  };

  findAll = async (): Promise<Result<Array<Contest>, Error>> => {
    let q;
    try {
      q = await this._prisma.contest.findMany({});
    } catch (e) {
      return new Failure(new Error());
    }

    const res = q.map((n: any) => {
      return PrismaContestsRepository.typeConverter(n);
    });
    return new Success(res);
  };

  findByID = async (id: string): Promise<Result<Contest, Error>> => {
    let q;
    try {
      q = await this._prisma.contest.findUnique({ where: { id: id } });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaContestsRepository.typeConverter(q);
    return new Success(res);
  };

  updateContest = async (
    id: string,
    arg: contestUpdateArg
  ): Promise<Result<Contest, Error>> => {
    let q;
    try {
      q = await this._prisma.contest.update({
        where: { id: id },
        data: {
          title: arg.title,
          description: arg.description,
          startAt: arg.startAt,
          endAt: arg.endAt,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaContestsRepository.typeConverter(q);
    return new Success(res);
  };
}

export class PrismaProblemRepository implements ProblemRepository {
  private readonly _prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  private static problemTypeConverter = (t: any) => {
    return new Problem(
      t.id,
      t.contestID,
      t.title,
      t.text,
      t.point,
      t.memoryLimit,
      t.timeLimit
    );
  };

  private static caseTypeConverter = (t: any) => {
    return new Case(t.id, t.problemID, t.input, t.output);
  };

  createCase = async (c: Case): Promise<Result<Case, Error>> => {
    let q;
    try {
      q = await this._prisma.case.create({
        data: {
          id: c.id,
          input: c.input,
          output: c.output,
          problemId: c.problemID,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaProblemRepository.caseTypeConverter(q);
    return new Success(res);
  };

  createProblem = async (problem: Problem): Promise<Result<Problem, Error>> => {
    let q;
    try {
      q = await this._prisma.problem.create({
        data: {
          id: problem.id,
          title: problem.title,
          text: problem.text,
          point: problem.point,
          memoryLimit: problem.memoryLimit,
          timeLimit: problem.timeLimit,
          contestId: problem.contestID,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaProblemRepository.problemTypeConverter(q);
    return new Success(res);
  };

  deleteProblem = async (id: string): Promise<Result<Problem, Error>> => {
    let q;
    try {
      q = await this._prisma.problem.delete({
        where: {
          id: id,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaProblemRepository.problemTypeConverter(q);
    return new Success(res);
  };

  findCasesByProblemID = async (
    id: string
  ): Promise<Result<Array<Case>, Error>> => {
    let q;

    try {
      q = await this._prisma.case.findMany({
        where: {
          problemId: id,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = q.map((j: any) => {
      return PrismaProblemRepository.caseTypeConverter(j);
    });
    return new Success(res);
  };

  findProblemsByContestID = async (
    contestID: string
  ): Promise<Result<Array<Problem>, Error>> => {
    let q;

    try {
      q = await this._prisma.problem.findMany({
        where: {
          contestId: contestID,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = q.map((j: any) => {
      return PrismaProblemRepository.problemTypeConverter(j);
    });
    return new Success(res);
  };

  findProblemByID = async (
    problemID: string
  ): Promise<Result<Problem, Error>> => {
    let q;

    try {
      q = await this._prisma.problem.findUnique({
        where: {
          id: problemID,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaProblemRepository.problemTypeConverter(q);
    return new Success(res);
  };

  updateCase = async (
    id: string,
    args: caseUpdateArgs
  ): Promise<Result<Case, Error>> => {
    let q;

    try {
      q = await this._prisma.case.update({
        where: {
          id: id,
        },
        data: {
          input: args.input,
          output: args.output,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaProblemRepository.caseTypeConverter(q);
    return new Success(res);
  };

  updateProblem = async (
    id: string,
    args: problemUpdateArgs
  ): Promise<Result<Problem, Error>> => {
    let q;

    try {
      q = await this._prisma.problem.update({
        where: {
          id: id,
        },
        data: {
          title: args.title,
          text: args.text,
          point: args.point,
          memoryLimit: args.memoryLimit,
          timeLimit: args.timeLimit,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaProblemRepository.problemTypeConverter(q);
    return new Success(res);
  };
}
