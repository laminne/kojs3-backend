import { PrismaClientInitializationError } from "@prisma/client/runtime/index.js";
import { DBConnectionError } from "./error.js";
import { UserRepository } from "../userRepository.js";
import { PrismaClient } from "@prisma/client/index.js";

export type User = {
  id: string;
  name: string;
};

export class PrismaUsersRepository implements UserRepository {
  private readonly _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  public findAll = async (): Promise<User[]> => {
    const user = await this._prisma.user.findMany({});
    const users: User[] = [];
    for (const i in user) {
      const tmp = {
        id: user[i].id,
        name: user[i].name,
      };
      users.push(tmp);
    }
    return users;
  };

  // ToDo: 一つ下のメソッドと統合する
  public findByID = async (id: string): Promise<User | undefined> => {
    const user = await this._prisma.user.findUnique({
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
  };

  public getUser = async (id: string) => {
    const user = await this._prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return undefined;
    } else {
      return user;
    }
  };

  public findByName = async (Name: string) => {
    try {
      const res = await this._prisma.user.findMany({
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
  };

  public create = async (name: string, hashed: string) => {
    try {
      return await this._prisma.user.create({
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
  };
}
