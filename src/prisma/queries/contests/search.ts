import { prisma } from "../../client";

export async function SearchContestTasksById(id: string) {
  return await prisma.tasks.findMany({
    where: {
      contestId: id,
    },
  });
}
