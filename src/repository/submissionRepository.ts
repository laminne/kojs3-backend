import { Submission, SubmissionState } from "./prisma/submissions.js";

export interface SubmissionsRepository {
  createSubmission(body: Submission): Promise<any>;
  updateSubmissionStateByHqId(
    id: string,
    res: string,
    state: SubmissionState
  ): Promise<any>;
  updateSubmissionStateById(
    id: string,
    res: string,
    state: SubmissionState
  ): Promise<any>;
}
