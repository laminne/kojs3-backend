import { prisma } from "../../client";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { DBConnectionError } from "../../error";

export async function SearchContestTasksById(id: string) {
  try {
    return await prisma.tasks.findMany({
      where: {
        contestId: id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientInitializationError) {
      throw new DBConnectionError();
    }
    throw e;
  }
}
