import { Request, Response } from "express";
import { ContestUseCase } from "../../service/contests/main.js";

export class ContestController {
  private _contestUsecase: ContestUseCase;

  constructor(repository: any) {
    this._contestUsecase = new ContestUseCase(repository);
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
      const tasks = await this._contestUsecase.oneContestTask(
        req.params.taskId
      );
      res.json(tasks);
      return;
    } catch (e) {
      res.status(400).send("エラーが発生しました");
    }
  };

  public submission = async (req: Request, res: Response) => {
    const body = {
      code: req.body.code,
      taskId: req.body.taskId,
      compilertype: req.body.compiler_type,
      userId: "374793af-2202-4cdc-b060-6f5865237a71",
    };
    try {
      const submission = await this._contestUsecase.submissionTask(body);
      // ToDo: データの詰め直しをする
      res.send(submission);
      return;
    } catch (e) {
      console.log(e);
      res.status(400).send("エラーが発生しました");
    }
  };

  public getAllSubmission = async (_req: Request, res: Response) => {
    const submissions = this._contestUsecase.allSubmissions();
    res.send(submissions);
    return;
  };

  public getOneSubmission = async (req: Request, res: Response) => {
    const submission = await this._contestUsecase.getSubmission(
      req.params.submissionId
    );
    res.json(submission);
    return;
  };
}
