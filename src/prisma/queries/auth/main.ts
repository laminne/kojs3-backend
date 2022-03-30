import { prisma } from "../../client";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { DBConnectionError } from "../../error";

export async function createNewAccount(name: string, hashed: string) {
  try {
    return await prisma.user.create({
      data: {
        name: name,
        password: hashed,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientInitializationError) {
      console.log(e);
      throw new DBConnectionError();
    }
    throw e;
  }
}
