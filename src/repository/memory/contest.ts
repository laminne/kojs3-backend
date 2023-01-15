import {
  caseUpdateArgs,
  ContestsRepository,
  contestUpdateArg,
  ProblemRepository,
  problemUpdateArgs,
} from "../contestRepository.js";
import { Failure, Result, Success } from "../../common/result.js";
import { Contest } from "../../models/contest.js";
import { Case, Problem } from "../../models/problems.js";

export class InmemoryContestsRepository implements ContestsRepository {
  private readonly _contests: Set<Contest>;

  constructor(data: Array<Contest>) {
    this._contests = new Set<Contest>(data);
  }

  async createContest(contest: Contest): Promise<Result<Contest, Error>> {
    for (const v of this._contests) {
      if (v.id === contest.id || v.title === contest.title) {
        return new Failure(new Error("AlreadyExistsError"));
      }
    }

    this._contests.add(contest);

    return new Success(contest);
  }

  async deleteContest(id: string): Promise<Result<Contest, Error>> {
    const res = await this.findByID(id);
    // 存在しないときはエラー
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    if (!this._contests.delete(res.value)) {
      return new Failure(new Error("DataStoreError"));
    }

    return new Success(res.value);
  }

  async findAll(): Promise<Result<Array<Contest>, Error>> {
    return new Success([...this._contests]);
  }

  async findByID(id: string): Promise<Result<Contest, Error>> {
    for (const v of this._contests) {
      if (v.id === id) {
        return new Success(v);
      }
    }

    return new Failure(new Error("NotFoundError"));
  }

  async updateContest(
    id: string,
    arg: contestUpdateArg
  ): Promise<Result<Contest, Error>> {
    const res = await this.findByID(id);
    // 存在しないときはエラー
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    // 一回消す
    await this.deleteContest(res.value.id);

    if (arg.title) {
      res.value.title = arg.title;
    }
    if (arg.description) {
      res.value.description = arg.description;
    }
    if (arg.startAt) {
      res.value.startAt = arg.startAt;
    }
    if (arg.endAt) {
      res.value.endAt = arg.endAt;
    }

    await this.createContest(res.value);

    return new Success(res.value);
  }
}

export class InmemoryProblemRepository implements ProblemRepository {
  private readonly _problem: Set<Problem>;
  private readonly _case: Set<Case>;

  constructor(
    problemData: Array<Problem> | undefined,
    caseData: Array<Case> | undefined
  ) {
    if (problemData) {
      this._problem = new Set<Problem>(problemData);
    } else {
      this._problem = new Set<Problem>();
    }

    if (caseData) {
      this._case = new Set<Case>(caseData);
    } else {
      this._case = new Set<Case>();
    }
  }

  async createCase(c: Case): Promise<Result<Case, Error>> {
    for (const v of this._case) {
      if (v.id === c.id) {
        return new Failure(new Error("AlreadyExistsError"));
      }
    }

    this._case.add(c);

    return new Success(c);
  }

  async createProblem(problem: Problem): Promise<Result<Problem, Error>> {
    for (const v of this._problem) {
      if (v.id === problem.id || v.title === problem.title) {
        return new Failure(new Error("AlreadyExistsError"));
      }
    }

    this._problem.add(problem);

    return new Success(problem);
  }

  async deleteProblem(id: string): Promise<Result<Problem, Error>> {
    const res = await this.findProblemByID(id);
    // 存在しないときはエラー
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    if (!this._problem.delete(res.value)) {
      return new Failure(new Error("DataStoreError"));
    }

    return new Success(res.value);
  }

  async findCasesByProblemID(id: string): Promise<Result<Array<Case>, Error>> {
    const res: Array<Case> = [];
    for (const v of this._case) {
      if (v.problemID === id) {
        res.push(v);
      }
    }

    return new Success(res);
  }

  async findProblemByID(problemID: string): Promise<Result<Problem, Error>> {
    for (const v of this._problem) {
      if (v.id === problemID) {
        return new Success(v);
      }
    }

    return new Failure(new Error("NotFoundError"));
  }

  async findProblemsByContestID(
    contestID: string
  ): Promise<Result<Array<Problem>, Error>> {
    const res: Array<Problem> = [];
    for (const v of this._problem) {
      if (v.contestID === contestID) {
        res.push(v);
      }
    }

    return new Success(res);
  }

  async updateCase(
    id: string,
    args: caseUpdateArgs
  ): Promise<Result<Case, Error>> {
    for (const v of this._case) {
      if (v.id === id) {
        const res = v;
        this._case.delete(v);

        if (args.input) {
          res.input = args.input;
        }

        if (args.output) {
          res.output = args.output;
        }
        return new Success(res);
      }
    }

    return new Failure(new Error("NotFoundError"));
  }

  async updateProblem(
    id: string,
    args: problemUpdateArgs
  ): Promise<Result<Problem, Error>> {
    const res = await this.findProblemByID(id);
    if (res.isFailure()) {
      return new Failure(new Error("NotFoundError"));
    }

    this._problem.delete(res.value);

    if (args.title) {
      res.value.title = args.title;
    }
    if (args.text) {
      res.value.text = args.text;
    }
    if (args.timeLimit) {
      res.value.timeLimit = args.timeLimit;
    }
    if (args.memoryLimit) {
      res.value.memoryLimit = args.memoryLimit;
    }
    if (args.point) {
      res.value.point = args.point;
    }

    await this.createProblem(res.value);

    return new Success(res.value);
  }
}
