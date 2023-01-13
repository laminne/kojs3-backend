import { PrismaClientInitializationError } from "@prisma/client/runtime/index.js";
import { DBConnectionError } from "./error.js";
import { QueueRepository } from "../QueueRepository.js";
import { PrismaClient } from "@prisma/client/index.js";

export class PrismaQueueRepository implements QueueRepository {
  private readonly _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async SubmitQueue(queue: {
    status: string;
    submission: string;
    hqId: string;
  }) {
    try {
      return await this._prisma.queue.create({
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
