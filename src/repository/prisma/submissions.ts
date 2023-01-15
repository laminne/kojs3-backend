import { SubmissionsRepository } from "../submissionRepository.js";
import { PrismaClient } from "@prisma/client/index.js";
import { Failure, Result, Success } from "../../common/result.js";
import { Submission, SubmissionState } from "../../models/submissions.js";

export class PrismaSubmissionsRepository implements SubmissionsRepository {
  private readonly _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  private static typeConverter(t: any) {
    return new Submission(
      t.id,
      t.contestID,
      t.contestantID,
      t.problemID,
      t.code,
      t.language,
      t.status,
      t.point
    );
  }

  createSubmission = async (arg: {
    id: string;
    contestID: string;
    contestantID: string;
    problemID: string;
    code: string;
    language: string;
    status: SubmissionState;
    point: number;
  }): Promise<Result<Submission, Error>> => {
    let q;
    try {
      q = this._prisma.submission.create({
        data: {
          id: arg.id,
          code: arg.code,
          language: arg.language,
          status: arg.status,
          point: arg.point,
          contestId: arg.contestID,
          contestantId: arg.contestantID,
          problemId: arg.problemID,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaSubmissionsRepository.typeConverter(q);
    return new Success(res);
  };

  findSubmissionByContestantID = async (
    contestantID: string
  ): Promise<Result<Array<Submission>, Error>> => {
    let q;
    try {
      q = await this._prisma.submission.findMany({
        where: {
          contestantId: contestantID,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = q.map((j: any) => {
      return PrismaSubmissionsRepository.typeConverter(j);
    });
    return new Success(res);
  };

  findSubmissionByID = async (
    submissionID: string
  ): Promise<Result<Submission, Error>> => {
    let q;
    try {
      q = await this._prisma.submission.findUnique({
        where: {
          id: submissionID,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }
    const res = PrismaSubmissionsRepository.typeConverter(q);
    return new Success(res);
  };

  findSubmissionByProblemID = async (
    problemID: string
  ): Promise<Result<Array<Submission>, Error>> => {
    let q;
    try {
      q = await this._prisma.submission.findMany({
        where: {
          problemId: problemID,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = q.map((j: any) => {
      return PrismaSubmissionsRepository.typeConverter(j);
    });
    return new Success(res);
  };

  updateSubmission = async (
    id: string,
    arg: Partial<{
      code: string;
      language: string;
      status: SubmissionState;
      point: number;
    }>
  ): Promise<Result<Submission, Error>> => {
    let q;
    try {
      q = await this._prisma.submission.update({
        where: {
          id: id,
        },
        data: {
          code: arg.code,
          language: arg.language,
          status: arg.status,
          point: arg.point,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    const res = PrismaSubmissionsRepository.typeConverter(q);
    return new Success(res);
  };
}
