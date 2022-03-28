import { prisma } from "../../client";

export async function createNewAccount(name: string, hashed: string) {
  return await prisma.user.create({
    data: {
      name: name,
      password: hashed,
    },
  });
}
