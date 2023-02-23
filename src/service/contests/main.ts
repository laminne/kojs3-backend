import {
  ContestsRepository,
  ProblemRepository,
} from "../../repository/contestRepository.js";
import { SubmissionsRepository } from "../../repository/submissionRepository.js";
import { Failure, Result, Success } from "../../common/result.js";
import { Submission, SubmissionState } from "../../models/submissions.js";
import { Problem } from "../../models/problems.js";
import { Contest } from "../../models/contest.js";
import { Snowflake } from "../../common/id/snowflakeID.js";
import { SnowflakeIDGenerator } from "../../common/id/snowflakeIDGenerator.js";

export class ContestUseCase {
  private _contestsRepository: ContestsRepository;
  private _submissionsRepository: SubmissionsRepository;
  private _problemRepository: ProblemRepository;
  private _idGenerator: SnowflakeIDGenerator;

  constructor(
    contestsRepository: ContestsRepository,
    submissionsRepository: SubmissionsRepository,
    problemRepository: ProblemRepository
  ) {
    this._contestsRepository = contestsRepository;
    this._submissionsRepository = submissionsRepository;
    this._problemRepository = problemRepository;
    this._idGenerator = new SnowflakeIDGenerator();
  }

  async allContests(): Promise<Result<Array<Contest>, Error>> {
    const res = await this._contestsRepository.findAll();
    if (res.isFailure()) {
      return new Failure(res.value);
    }
    return new Success(res.value);
  }

  async getContestByID(contestId: string): Promise<Result<Contest, Error>> {
    const res = await this._contestsRepository.findByID(contestId);
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    return new Success(res.value);
  }

  async getContestProblemsByID(
    contestId: string
  ): Promise<Result<Array<Problem>, Error>> {
    const r = await this._contestsRepository.findByID(contestId);
    if (r.isFailure()) {
      return new Failure(new Error());
    }

    if (!ContestUseCase.isContestStarted(new Date(r.value.startAt))) {
      return new Failure(new Error("ContestIsNotStarted"));
    }

    const res = await this._problemRepository.findProblemsByContestID(
      contestId
    );
    if (res.isFailure()) {
      return new Failure(new Error());
    }

    return new Success(res.value);
  }

  async getContestProblem(problemID: string): Promise<Result<Problem, Error>> {
    const res = await this._problemRepository.findProblemByID(problemID);
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    const r = await this._contestsRepository.findByID(res.value.contestID);
    if (r.isFailure()) {
      return new Failure(new Error());
    }
    if (!ContestUseCase.isContestStarted(new Date(r.value.startAt))) {
      return new Failure(new Error("ContestIsNotStarted"));
    }

    return new Success(res.value);
  }

  async createContestProblem(
    contestID: Snowflake,
    title: string,
    text: string,
    memoryLimit: number,
    timeLimit: number
  ) {
    if (
      memoryLimit < 0 ||
      memoryLimit > 1024 ||
      timeLimit < 0 ||
      timeLimit > 2000
    ) {
      return new Failure(new Error("invalid limit"));
    }
    const id = this._idGenerator.newID(new Date());
    // ToDo: Pointの自動計算
    const res = await this._problemRepository.createProblem(
      new Problem(id, contestID, title, text, 0, memoryLimit, timeLimit)
    );
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    return new Success(res.value);
  }

  async updateContestProblem(
    id: Snowflake,
    arg: {
      title?: string;
      text?: string;
      memoryLimit?: number;
      timeLimit?: number;
    }
  ) {
    const res = await this._problemRepository.updateProblem(id, arg);
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    return new Success(res.value);
  }

  async getSubmissionByID(id: string): Promise<Result<Submission, Error>> {
    const res = await this._submissionsRepository.findSubmissionByID(id);
    if (res.isFailure()) {
      return new Failure(res.value);
    }
    return new Success(res.value);
  }

  submit = async (arg: {
    id: string;
    contestID: string;
    contestantID: string;
    problemID: string;
    code: string;
    language: string;
  }): Promise<Result<Submission, Error>> => {
    const req: {
      id: string;
      contestID: string;
      contestantID: string;
      problemID: string;
      code: string;
      language: string;
      status: SubmissionState; // 提出直後は必ずWJ
      point: 0;
    } = {
      id: arg.id,
      contestID: arg.contestID,
      contestantID: arg.contestantID,
      problemID: arg.problemID,
      code: arg.code,
      language: arg.language,
      status: "WJ", // 提出直後は必ずWJ
      point: 0,
    };

    // ToDo: 提出した後のキューに積む処理の実装
    const res = await this._submissionsRepository.createSubmission(req);
    if (res.isFailure()) {
      return new Failure(new Error());
    }

    return new Success(res.value);
  };

  private static isContestStarted(T: Date): boolean {
    return T < new Date();
  }
}
