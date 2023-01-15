import { Request, Response } from "express";
import { ContestUseCase } from "../../service/contests/main.js";
import {
  ContestsRepository,
  ProblemRepository,
} from "../../repository/contestRepository.js";
import { SubmissionsRepository } from "../../repository/submissionRepository.js";
import { SnowflakeIDGenerator } from "../../common/id/snowflakeIDGenerator.js";

export class ContestController {
  private _contestUsecase: ContestUseCase;

  constructor(
    repository: ContestsRepository,
    submissionRepository: SubmissionsRepository,
    problemRepository: ProblemRepository
  ) {
    this._contestUsecase = new ContestUseCase(
      repository,
      submissionRepository,
      problemRepository
    );
  }

  // すべてのコンテストを取得
  public getAllContests = async (_req: Request, res: Response) => {
    const contests = await this._contestUsecase.allContests();
    res.json(contests);
    return;
  };

  public getOneContest = async (req: Request, res: Response) => {
    let contest;
    try {
      contest = await this._contestUsecase.oneContest(req.params.contestId);
    } catch (e) {
      res.status(400).send("エラーが発生しました");
      return;
    }
    res.json(contest);
  };

  public getContestTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await this._contestUsecase.contestTasks(
        req.params.contestId
      );
      res.json(tasks);
      return;
    } catch (e) {
      res.status(400).send("エラーが発生しました");
    }
  };

  public getOneTask = async (req: Request, res: Response) => {
    try {
      const tasks = await this._contestUsecase.getContestProblem(
        req.params.taskId
      );
      res.json(tasks);
      return;
    } catch (e) {
      res.status(400).send("エラーが発生しました");
    }
  };

  public submit = async (req: Request, res: Response) => {
    const idGenerator = new SnowflakeIDGenerator();
    const id = idGenerator.newID(new Date());

    const resp = await this._contestUsecase.submit({
      id: id,
      contestID: req.params.contestID,
      code: req.body.code,
      contestantID: req.params.contestantID,
      problemID: req.params.problemID,
      language: req.body.language,
    });

    // ToDo: データの詰め直しをする
    res.send(resp.value);

    res.status(400).send("エラーが発生しました");
  };

  public getOneSubmission = async (req: Request, res: Response) => {
    const submission = await this._contestUsecase.getSubmissionByID(
      req.params.submissionId
    );
    res.json(submission);
    return;
  };
}
