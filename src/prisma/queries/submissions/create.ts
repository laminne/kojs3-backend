import { prisma } from "../../client";

export type Submission = {
  code: string;
  taskId: string;
  userId: string;
  compilerType: string;
  state?: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC" | "WJ";
};

export async function createSubmission(body: Submission) {
  // ToDo: ユーザーIDの固定をやめる
  return await prisma.submissions.create({
    data: {
      code: body.code,
      tasks: { connect: { id: body.taskId } },
      User: { connect: { id: "12312312" } },
      state: "WJ", // 実行開始時は必ず WJ (Waiting for Judge)
      response: "",
    },
  });
}
