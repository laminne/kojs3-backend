import { prisma } from "../../client";

export async function updateSubmissionState(
  id: string,
  res: string,
  state: "CE" | "MLE" | "TLE" | "RE" | "OLE" | "IE" | "WA" | "AC"
) {
  // ToDo: State固定やめろ

  // hqが発行するIDから提出を探す
  const q = await prisma.queue.findUnique({
    where: {
      hqId: id,
    },
  });

  if (!q || !q.submissionId) {
    return;
  }
  await prisma.submissions.update({
    where: {
      id: q.submissionId,
    },
    data: {
      response: res,
      state: state,
    },
  });
}
