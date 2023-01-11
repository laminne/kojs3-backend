import { Request, Response } from "express";
import { ContestUseCase } from "../../service/contests/main";

export class ContestController {
  private _contestUsecase: ContestUseCase;

  constructor(repository: any) {
    this._contestUsecase = new ContestUseCase(repository);
  }

  // すべてのコンテストを取得
  async getAllContests(_req: Request, res: Response) {
    const contests = await this._contestUsecase.allContests();
    res.json(contests);
    return;
  }

  async getOneContest(req: Request, res: Response) {
    let contest;
    try {
      contest = await this._contestUsecase.oneContest(req.params.contestId);
    } catch (e) {
      res.status(400).send("エラーが発生しました");
      return;
    }
    res.json(contest);
  }

  async getContestTasks(req: Request, res: Response) {
    try {
      const tasks = await this._contestUsecase.contestTasks(
        req.params.contestId
      );
      res.json(tasks);
      return;
    } catch (e) {
      res.status(400).send("エラーが発生しました");
    }
  }

  async getOneTask(req: Request, res: Response) {
    try {
      const tasks = await this._contestUsecase.oneContestTask(
        req.params.taskId
      );
      res.json(tasks);
      return;
    } catch (e) {
      res.status(400).send("エラーが発生しました");
    }
  }

  async submission(req: Request, res: Response) {
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
  }

  getAllSubmission(_req: Request, res: Response) {
    const submissions = this._contestUsecase.allSubmissions();
    res.send(submissions);
    return;
  }

  async getOneSubmission(req: Request, res: Response) {
    const submission = await this._contestUsecase.getSubmission(
      req.params.submissionId
    );
    res.json(submission);
    return;
  }
}
