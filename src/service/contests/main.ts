import { enqueue, Job, HqResponse } from "./jobqueuemanager";
import { renderMarkdownToHTML } from "../misc/mdrender";

export type Submission = {
  code: string;
  taskId: string;
  userId: string;
  compilerType: string;
  state?: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC" | "WJ";
};

export class ContestUseCase {
  private _repository: any;

  constructor(repository: any) {
    this._repository = repository;
  }

  async allContests() {
    return await this._repository.findAllContests();
  }

  async oneContest(contestId: string) {
    const res = await this._repository.findContestById(contestId);
    if (!res) {
      return;
    }
    const i = this.isContestStarted(res.starting_time);
    if (!i) {
      throw new Error("ContestNotStartedError");
    }
    res.descriptions = await renderMarkdownToHTML(res.descriptions);
    return res;
  }

  async contestTasks(contestId: string) {
    return await this._repository.SearchContestTasksById(contestId);
  }

  async oneContestTask(taskId: string) {
    const res = await this._repository.findContestTaskById(taskId);
    if (!res) {
      return;
    }
    const r = await this._repository.findContestById(res.contestId);
    if (!r) {
      return;
    }
    const i = this.isContestStarted(r.starting_time);
    if (!i) {
      throw new Error("ContestNotStartedError");
    }
    res.description = await renderMarkdownToHTML(res.description);
    return res;
  }

  async submissionTask(body: {
    code: string;
    compilertype: string;
    taskId: string;
    userId: string;
  }) {
    const submission: Submission = {
      code: body.code,
      taskId: body.taskId,
      compilerType: body.compilertype,
      userId: body.userId,
    };
    const jobqueue: Job = {
      url: "http://127.0.0.1:3000/run",
      payload: {
        // task_id: submission.taskId,
        task_id: "000-000",
        compiler_type: submission.compilerType,
        code: submission.code,
      },
    };
    console.log(submission.compilerType, "コンパイラタイプ");
    try {
      try {
        const res = await enqueue(jobqueue);
        // Enqueue時の返り値に応じて動作を変える
        if (this.isHqResponse(res)) {
          const subres = await this._repository.createSubmission(submission);
          await this._repository.SubmitQueue({
            status: res.status,
            submission: subres.id,
            hqId: res.id,
          });
          return subres;
        }
      } catch (e) {
        const subres = await this._repository.createSubmission(submission);
        const r = await this._repository.updateSubmissionStateById(
          subres.id,
          "",
          "IE"
        );
        console.log(r);
        return r;
      }
      return;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async allSubmissions() {
    return await this._repository.findAllSubmissions();
  }

  async getSubmission(id: string) {
    return await this._repository.findSubmissionById(id);
  }

  private isContestStarted(T: Date): boolean {
    return T < new Date();
  }

  private isHqResponse = (arg: unknown): arg is HqResponse =>
    typeof arg === "object" && arg !== null;
}
