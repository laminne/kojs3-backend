import { Result } from "../common/result.js";
import { Submission, SubmissionState } from "../models/submissions.js";

export interface SubmissionsRepository {
  createSubmission(arg: {
    id: string;
    contestID: string;
    contestantID: string;
    problemID: string;
    code: string;
    language: string;
    status: SubmissionState;
    point: number;
  }): Promise<Result<Submission, Error>>;

  updateSubmission(
    id: string,
    arg: Partial<{
      code: string;
      language: string;
      status: SubmissionState;
      point: number;
    }>
  ): Promise<Result<Submission, Error>>;

  findSubmissionByID(submissionID: string): Promise<Result<Submission, Error>>;
  findSubmissionByContestantID(
    contestantID: string
  ): Promise<Result<Array<Submission>, Error>>;
  findSubmissionByProblemID(
    problemID: string
  ): Promise<Result<Array<Submission>, Error>>;
}
