import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function createNewAccount(
  name: string,
  hashed: string
): Promise<User> {
  return await prisma.user.create({
    data: {
      name: name,
      password: hashed,
    },
  });
}
