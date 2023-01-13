import { prisma } from "./client.js";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { DBConnectionError } from "./error.js";

export type Submission = {
  code: string;
  taskId: string;
  userId: string;
  compilerType: string;
  state?: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC" | "WJ";
};

export class PrismaSubmissionsRepository {
  async createSubmission(body: Submission) {
    console.log(body);
    // ToDo: ユーザーIDの固定をやめる
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
  }

  async updateSubmissionStateByHqId(
    id: string,
    res: string,
    state: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC"
  ) {
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
  }

  async updateSubmissionStateById(
    id: string,
    res: string,
    state: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC"
  ) {
    return await prisma.submissions.update({
      where: {
        id: id,
      },
      data: {
        response: res,
        state: state,
      },
    });
  }
}
