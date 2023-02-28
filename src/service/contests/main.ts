import {
  ContestsRepository,
  ProblemRepository,
} from "../../repository/contestRepository.js";
import { SubmissionsRepository } from "../../repository/submissionRepository.js";
import { Failure, Result, Success } from "../../common/result.js";
import { Submission, SubmissionState } from "../../models/submissions.js";
import { Case, Problem } from "../../models/problems.js";
import { Contest } from "../../models/contest.js";
import { Snowflake } from "../../common/id/snowflakeID.js";
import { SnowflakeIDGenerator } from "../../common/id/snowflakeIDGenerator.js";
import { Queue } from "./jobqueuemanager.js";
export class ContestUseCase {
  private _contestsRepository: ContestsRepository;
  private _submissionsRepository: SubmissionsRepository;
  private _problemRepository: ProblemRepository;
  private _idGenerator: SnowflakeIDGenerator;
  private _queue: Queue;
  private _queueURL: string;

  constructor(
    contestsRepository: ContestsRepository,
    submissionsRepository: SubmissionsRepository,
    problemRepository: ProblemRepository,
    queue: Queue,
    queueURL: string
  ) {
    this._contestsRepository = contestsRepository;
    this._submissionsRepository = submissionsRepository;
    this._problemRepository = problemRepository;
    this._idGenerator = new SnowflakeIDGenerator();
    this._queue = queue;
    this._queueURL = queueURL;
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
    const wj: SubmissionState = "WJ";
    const req = {
      id: arg.id,
      contestID: arg.contestID,
      contestantID: arg.contestantID,
      problemID: arg.problemID,
      code: arg.code,
      language: arg.language,
      status: wj, // 提出直後は必ずWJ
      point: 0,
    };

    const res = await this._submissionsRepository.createSubmission(req);
    if (res.isFailure()) {
      return new Failure(new Error());
    }

    const p = await this._problemRepository.findProblemByID(arg.problemID);
    if (p.isFailure()) {
      return new Failure(new Error());
    }
    const c = await this._problemRepository.findCasesByProblemID(arg.problemID);
    if (c.isFailure()) {
      return new Failure(new Error());
    }
    const cases = c.value.map((ca: Case) => {
      return { name: `${ca.problemID}.txt`, file: ca.input };
    });

    const r = await this._queue.enqueue(
      this._queueURL,
      arg.problemID,
      arg.id,
      arg.code,
      arg.language,
      cases,
      { timeLimit: p.value.timeLimit, memoryLimit: p.value.memoryLimit }
    );
    if (r.isFailure()) {
      return new Failure(new Error());
    }

    return new Success(res.value);
  };

  async updateSubmissionStatus(arg: {
    submissionID: string;
    compilerError: string;
    compilerMessage: string;
    results: Array<{
      caseID: string;
      output: string;
      exitStatus: number;
      duration: number;
      usage: number;
    }>;
  }) {
    /*
    ToDo:
      - outputとcaseを比較
      - ステータスを更新
      - 保存
    */

    /*
  判定
  
  AC条件: WA/TLE/MLEがないこと / CEしていないこと
  */
    const submission = await this._submissionsRepository.findSubmissionByID(
      arg.submissionID
    );
    if (submission.isFailure()) {
      return new Failure(new Error("failed to get submission"));
    }

    const problem = await this._problemRepository.findProblemByID(
      submission.value.problemID
    );
    if (problem.isFailure()) {
      return new Failure(new Error("failed to get problem"));
    }

    const cases = await this._problemRepository.findCasesByProblemID(
      submission.value.problemID
    );
    if (cases.isFailure()) {
      return new Failure(new Error("failed to get cases"));
    }

    const state = this.judge(cases.value, problem.value, arg.results);

    const r = await this._submissionsRepository.updateSubmission(
      arg.submissionID,
      { status: state[0], execTime: state[1], memoryUsage: state[2] }
    );
    if (r.isFailure()) {
      return new Failure(new Error("failed to update submission"));
    }
    return new Success("");
  }

  private static isContestStarted(T: Date): boolean {
    return T < new Date();
  }

  private judge(
    cases: Array<Case>,
    problem: Problem,
    results: Array<{
      caseID: string;
      output: string;
      exitStatus: number;
      duration: number;
      usage: number;
    }>
  ): [state: SubmissionState, maxDuration: number, maxUsage: number] {
    let [maxDuration, maxUsage] = [0, 0];
    const r = results.map((o): SubmissionState => {
      if (o.duration > maxDuration) {
        maxDuration = o.duration;
      }
      if (o.usage > maxUsage) {
        maxUsage = o.usage;
      }
      // 異常終了 -> IE
      if (o.exitStatus != 0) {
        return "IE";
      }
      if (o.usage < problem.memoryLimit) {
        return "MLE";
      }
      if (o.duration < problem.timeLimit) {
        return "TLE";
      }

      let caseOutput: string = "";
      cases.map((c) => {
        if (c.id === o.caseID) {
          caseOutput = c.output;
        }
      });

      if (caseOutput !== o.output) {
        return "WA";
      }

      return "AC";
    });

    if (r.includes("CE")) {
      return ["CE", maxDuration, maxUsage];
    }
    if (r.includes("TLE")) {
      return ["TLE", maxDuration, maxUsage];
    }
    if (r.includes("OLE")) {
      return ["OLE", maxDuration, maxUsage];
    }
    if (r.includes("RE")) {
      return ["RE", maxDuration, maxUsage];
    }

    return ["AC", maxDuration, maxUsage];
  }
}
