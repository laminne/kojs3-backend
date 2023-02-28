import axios from "axios";
import { Failure, Result, Success } from "../../common/result.js";

export type Job = {
  url: string;
  payload: {
    problemID: string;
    submissionID: string;
    code: string;
    lang: string;
    cases: Array<{ name: string; file: string }>;
    config: {
      timeLimit: number;
      memoryLimit: number;
    };
  };
};

export type HqResponse = {
  canceled: boolean;
  comment: string;
  createdAt: Date;
  err: string;
  failure: boolean;
  finishedAt: Date;
  headers?: object;
  id: string;
  name: string;
  output: string;
  payload: object;
  running: boolean;
  startedAt?: Date;
  status: string;
  statusCode?: number;
  success: boolean;
  timeout: number;
  url: string;
  waiting: boolean;
};

export interface Queue {
  enqueue(
    url: string,
    problemID: string,
    submissionID: string,
    code: string,
    lang: string,
    cases: Array<{ name: string; file: string }>,
    config: {
      timeLimit: number;
      memoryLimit: number;
    }
  ): Promise<Result<void, Error>>;
}

export class HqQueue implements Queue {
  private readonly _url: string;
  constructor(url: string) {
    this._url = url;
  }

  async enqueue(
    url: string,
    problemID: string,
    submissionID: string,
    code: string,
    lang: string,
    cases: Array<{ name: string; file: string }>,
    config: {
      timeLimit: number;
      memoryLimit: number;
    }
  ): Promise<Result<void, Error>> {
    const job: Job = {
      url: url,
      payload: {
        problemID: problemID,
        submissionID: submissionID,
        code: code,
        lang: lang,
        cases: cases,
        config: config,
      },
    };
    try {
      await axios.post<HqResponse>(this._url, JSON.stringify(job), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.log("error:", e);
      return new Failure(new Error("enqueue failed"));
    }

    return new Success(undefined);
  }
}

export class DummyQueue implements Queue {
  async enqueue(
    _: string,
    __: string,
    ___: string,
    ____: string,
    _____: string,
    ______: Array<{ name: string; file: string }>,
    _______: {
      timeLimit: number;
      memoryLimit: number;
    }
  ): Promise<Result<void, Error>> {
    return new Success(undefined);
  }
}
