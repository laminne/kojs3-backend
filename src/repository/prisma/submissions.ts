import { prisma } from "./client.js";
import { PrismaClientInitializationError } from "@prisma/client/runtime/index.js";
import { DBConnectionError } from "./error.js";
import { SubmissionsRepository } from "../submissionRepository.js";

// ToDo: これらの型を別ファイルにまとめる
export type SubmissionState =
  | "CE"
  | "MLE"
  | "TLE"
  | "RE"
  | "OLE"
  | "IE"
  | "WA"
  | "AC"
  | "WJ";

export type Submission = {
  code: string;
  taskId: string;
  userId: string;
  compilerType: string;
  state?: SubmissionState;
};

export class PrismaSubmissionsRepository implements SubmissionsRepository {
  public createSubmission = async (body: Submission) => {
    try {
      return await prisma.submissions.create({
        data: {
          code: body.code,
          tasks: { connect: { id: body.taskId } },
          User: { connect: { id: body.userId } },
          state: "WJ", // 実行開始時は必ず WJ (Waiting for Judge)
          response: "",
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientInitializationError) {
        throw new DBConnectionError();
      }
      throw e;
    }
  };

  public updateSubmissionStateByHqId = async (
    id: string,
    res: string,
    state: SubmissionState
  ) => {
    // hqが発行するIDから提出を探す
    const q = await prisma.queue.findUnique({
      where: {
        hqId: id,
      },
    });

    if (!q || !q.submissionId) {
      return;
    }
    return await prisma.submissions.update({
      where: {
        id: q.submissionId,
      },
      data: {
        response: res,
        state: state,
      },
    });
  };

  public updateSubmissionStateById = async (
    id: string,
    res: string,
    state: SubmissionState
  ) => {
    return await prisma.submissions.update({
      where: {
        id: id,
      },
      data: {
        response: res,
        state: state,
      },
    });
  };
}
