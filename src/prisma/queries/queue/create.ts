import { prisma } from "../../client";

export async function SubmitQueue(queue: {
  status: string;
  submission: string;
  hqId: string;
}) {
  return await prisma.queue.create({
    data: {
      status: queue.status,
      submission: { connect: { id: queue.submission } },
      hqId: queue.hqId,
    },
  });
}
