import { prisma } from "../../client";

export async function updateSubmissionStateByHqId(
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

export async function updateSubmissionStateById(
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
