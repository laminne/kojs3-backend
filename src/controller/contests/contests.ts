import { Request, Response } from "express";
import { ContestUseCase } from "../../service/contests/main.js";
import {
  ContestsRepository,
  ProblemRepository,
} from "../../repository/contestRepository.js";
import { SubmissionsRepository } from "../../repository/submissionRepository.js";
import { SnowflakeIDGenerator } from "../../common/id/snowflakeIDGenerator.js";
import { ContestSerializer } from "./contestSerializer.js";
import { Snowflake } from "../../common/id/snowflakeID";
import { Queue } from "../../service/contests/jobqueuemanager";

export class ContestController {
  private _contestUsecase: ContestUseCase;
  private _serializer: ContestSerializer;

  constructor(
    contestsRepository: ContestsRepository,
    submissionRepository: SubmissionsRepository,
    problemRepository: ProblemRepository,
    queue: Queue,
    queueURL: string
  ) {
    this._contestUsecase = new ContestUseCase(
      contestsRepository,
      submissionRepository,
      problemRepository,
      queue,
      queueURL
    );
    this._serializer = new ContestSerializer();
  }
  // すべてのコンテストを取得
  public getAllContests = async (_req: Request, res: Response) => {
    const contests = await this._contestUsecase.allContests();
    if (contests.isFailure()) {
      return res.status(500);
    }

    const r = this._serializer.parseGetAllContestsResponse(contests.value);
    return res.json(r);
  };

  // コンテストを一つ取得
  public getContest = async (req: Request, res: Response) => {
    const contest = await this._contestUsecase.getContestByID(
      req.params.contestId
    );

    if (contest.isFailure()) {
      // ToDo: エラー型をどうにかする
      return res.status(404).send("");
    }
    const r = this._serializer.parseGetContestResponse(contest.value);
    return res.json(r);
  };

  // コンテストの問題を作成
  public createContestProblem = async (req: Request, res: Response) => {
    console.log(req.body.limits);
    const p = await this._contestUsecase.createContestProblem(
      req.params.contestId as Snowflake,
      req.body.title,
      req.body.text,
      req.body.limits.memory,
      req.body.limits.time
    );
    if (p.isFailure()) {
      return res.status(400);
    }

    return res
      .status(200)
      .json(this._serializer.parseCreateContestProblemResponse(p.value));
  };

  // コンテストの問題一覧を取得
  public getContestProblems = async (req: Request, res: Response) => {
    const tasks = await this._contestUsecase.getContestProblemsByID(
      req.params.contestId
    );

    if (tasks.isFailure()) {
      return res.status(400).send("エラーが発生しました");
    }
    const r = this._serializer.parseGetContestProblemsResponse(tasks.value);
    return res.json(r);
  };

  // コンテストの問題を1つ取得
  public getContestProblem = async (req: Request, res: Response) => {
    const tasks = await this._contestUsecase.getContestProblem(
      req.params.taskId
    );

    if (tasks.isFailure()) {
      return res.status(400).send("");
    }

    return res
      .status(200)
      .json(this._serializer.parseGetContestProblem(tasks.value));
  };

  // 問題の回答を提出
  public createSubmission = async (req: Request, res: Response) => {
    const idGenerator = new SnowflakeIDGenerator();
    const id = idGenerator.newID(new Date());

    const resp = await this._contestUsecase.submit({
      id: id,
      contestID: req.params.contestID,
      code: req.body.code,
      contestantID: "", // FIXME: 決め打ちやめる
      problemID: req.body.problemID,
      language: req.body.language,
    });

    if (resp.isFailure()) {
      // ToDo: リクエスト形式が不正なときのレスポンスを定義する
      // ToDo: Knock Outを実装する
      return res.status(400).send("");
    }

    return res.status(204).send("");
  };

  // コンテストの提出を1つ取得
  public getSubmission = async (req: Request, res: Response) => {
    const submission = await this._contestUsecase.getSubmissionByID(
      req.params.submissionId
    );
    res.json(submission);
    return;
  };

  // キューの実行結果取得用(ユーザーからは叩かない)
  public updateSubmission = async (req: Request, res: Response) => {
    const out = JSON.parse(req.body.output);
    const arg = {
      submissionID: out.submissionID,
      compilerError: out.compilerError,
      compilerMessage: out.compilerMessage,
      results: out.results,
    };
    await this._contestUsecase.updateSubmissionStatus(arg);
    res.status(200).send("");
  };
}
