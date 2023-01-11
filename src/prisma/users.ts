import { prisma } from "./client";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { DBConnectionError } from "./error";

export type User = {
  id: string;
  name: string;
};

export class PrismaUsersRepository {
  public async findAllUsers(): Promise<User[]> {
    const user = await prisma.user.findMany({});
    const users: User[] = [];
    for (const i in user) {
      const tmp = {
        id: user[i].id,
        name: user[i].name,
      };
      users.push(tmp);
    }
    return users;
  }

  async findUserById(id: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return undefined;
    } else {
      return {
        id: user.id,
        name: user.name,
      };
    }
  }

  async getUser(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return undefined;
    } else {
      return user;
    }
  }

  async findUserByName(Name: string) {
    try {
      const res = await prisma.user.findMany({
        where: {
          name: Name,
        },
      });
      console.log(res, Name);
      return res[0];
    } catch (e) {
      if (e instanceof PrismaClientInitializationError) {
        throw new DBConnectionError();
      }
      throw e;
    }
  }
}
