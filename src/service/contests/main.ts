import {
  ContestsRepository,
  ProblemRepository,
} from "../../repository/contestRepository.js";
import { SubmissionsRepository } from "../../repository/submissionRepository.js";
import { Failure, Result, Success } from "../../common/result.js";
import { Submission, SubmissionState } from "../../models/submissions.js";

export class ContestUseCase {
  private _contestsRepository: ContestsRepository;
  private _submissionsRepository: SubmissionsRepository;
  private _problemRepository: ProblemRepository;

  constructor(
    contestsRepository: ContestsRepository,
    submissionsRepository: SubmissionsRepository,
    problemRepository: ProblemRepository
  ) {
    this._contestsRepository = contestsRepository;
    this._submissionsRepository = submissionsRepository;
    this._problemRepository = problemRepository;
  }

  async allContests() {
    return await this._contestsRepository.findAll();
  }

  async oneContest(contestId: string) {
    const res = await this._contestsRepository.findByID(contestId);
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    const i = ContestUseCase.isContestStarted(res.value.startAt);
    if (!i) {
      return new Failure("ContestNotStartedError");
    }

    return new Success(res.value);
  }

  async contestTasks(contestId: string) {
    return await this._contestsRepository.findByID(contestId);
  }

  async getContestProblem(problemID: string) {
    const res = await this._problemRepository.findProblemByID(problemID);
    if (res.isFailure()) {
      return;
    }

    return res;
  }

  async getSubmissionByID(id: string) {
    return await this._submissionsRepository.findSubmissionByID(id);
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
