import { prisma } from "./client";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { DBConnectionError } from "./error";

export class PrismaQueueRepository {
  async SubmitQueue(queue: {
    status: string;
    submission: string;
    hqId: string;
  }) {
    try {
      return await prisma.queue.create({
        data: {
          status: queue.status,
          submission: { connect: { id: queue.submission } },
          hqId: queue.hqId,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientInitializationError) {
        throw new DBConnectionError();
      }
      throw e;
    }
  }
}
