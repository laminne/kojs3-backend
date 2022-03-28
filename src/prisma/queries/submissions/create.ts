import { prisma } from "../../client";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { DBConnectionError } from "../../error";

export type Submission = {
  code: string;
  taskId: string;
  userId: string;
  compilerType: string;
  state?: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC" | "WJ";
};

export async function createSubmission(body: Submission) {
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
