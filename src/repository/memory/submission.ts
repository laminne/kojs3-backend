import { SubmissionsRepository } from "../submissionRepository.js";
import { Submission, SubmissionState } from "../../models/submissions.js";
import { Failure, Result, Success } from "../../common/result.js";

export class InmemorySubmissionsRepository implements SubmissionsRepository {
  private readonly _submission: Set<Submission>;

  constructor(data: Array<Submission>) {
    this._submission = new Set<Submission>(data);
  }

  async createSubmission(arg: {
    id: string;
    contestID: string;
    contestantID: string;
    problemID: string;
    code: string;
    language: string;
    status: SubmissionState;
    point: number;
  }): Promise<Result<Submission, Error>> {
    for (const v of this._submission) {
      if (v.id === arg.id) {
        return new Failure(new Error("AlreadyExistsError"));
      }
    }

    const req = new Submission(
      arg.id,
      arg.contestID,
      arg.contestantID,
      arg.problemID,
      arg.code,
      arg.language,
      arg.status,
      arg.point,
      0,
      0,
      ""
    );
    this._submission.add(req);

    return new Success(req);
  }

  async findSubmissionByContestantID(
    contestantID: string
  ): Promise<Result<Array<Submission>, Error>> {
    const res: Array<Submission> = [];
    for (const v of this._submission) {
      if (v.contestantID === contestantID) {
        res.push(v);
      }
    }

    return new Success(res);
  }

  async findSubmissionByID(
    submissionID: string
  ): Promise<Result<Submission, Error>> {
    for (const v of this._submission) {
      if (v.id === submissionID) {
        return new Success(v);
      }
    }

    return new Failure(new Error("NotFoundError"));
  }

  async findSubmissionByProblemID(
    problemID: string
  ): Promise<Result<Array<Submission>, Error>> {
    const res: Array<Submission> = [];
    for (const v of this._submission) {
      if (v.problemID === problemID) {
        res.push(v);
      }
    }

    return new Success(res);
  }

  async updateSubmission(
    id: string,
    arg: Partial<{
      code: string;
      language: string;
      status: SubmissionState;
      point: number;
      execTime: number;
      memoryUsage: number;
      output: string;
    }>
  ): Promise<Result<Submission, Error>> {
    const res = await this.findSubmissionByID(id);
    if (res.isFailure()) {
      return new Failure(new Error("NotFoundError"));
    }

    this._submission.delete(res.value);

    if (arg.code) {
      res.value.code = arg.code;
    }
    if (arg.language) {
      res.value.language = arg.language;
    }
    if (arg.status) {
      res.value.status = arg.status;
    }
    if (arg.point) {
      res.value.point = arg.point;
    }
    if (arg.execTime) {
      res.value.execTime = arg.execTime;
    }
    if (arg.memoryUsage) {
      res.value.memoryUsage = arg.memoryUsage;
    }
    if (arg.output) {
      res.value.output = arg.output;
    }

    await this.createSubmission(res.value);

    return new Success(res.value);
  }
}
