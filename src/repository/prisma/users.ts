import { UserRepository } from "../userRepository.js";
import { PrismaClient } from "@prisma/client/index.js";
import { Failure, Result, Success } from "../../common/result.js";
import { User } from "../../models/users.js";

export class PrismaUsersRepository implements UserRepository {
  private _prisma: PrismaClient;

  constructor(prismaConnections: PrismaClient) {
    this._prisma = prismaConnections;
  }

  // PrismaのUserテーブルの型をUserオブジェクトに詰め替える
  private static typeConverter(T: any): User {
    return new User(T.id, T.name, T.password, T.type, T.email, T.icon);
  }

  async createUser(
    id: string,
    name: string,
    password: string,
    icon: string,
    type: number,
    email: string
  ): Promise<Result<User, Error>> {
    let res;
    try {
      res = await this._prisma.user.create({
        data: {
          id: id as string,
          name: name,
          password: password,
          icon: icon,
          type: type,
          email: email,
        },
      });
    } catch (e) {
      console.log(e);
      return new Failure(new Error());
    }
    return new Success(PrismaUsersRepository.typeConverter(res));
  }

  async findAllUsers(): Promise<
    Result<Array<User>, Error>
    // eslint-disable-next-line indent
  > {
    let query;
    try {
      query = await this._prisma.user.findMany({});
    } catch (e) {
      return new Failure(new Error());
    }

    const res = query.map((n: any) => {
      return PrismaUsersRepository.typeConverter(n);
    });

    return new Success(res);
  }

  async findUserByID(id: string): Promise<Result<User, Error>> {
    let res;
    try {
      res = await this._prisma.user.findUnique({
        where: {
          id: id as string,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }

    if (!res) {
      return new Failure(new Error());
    }
    return new Success(PrismaUsersRepository.typeConverter(res));
  }

  async findUserByName(name: string): Promise<Result<User, Error>> {
    let res;
    try {
      res = await this._prisma.user.findUnique({
        where: {
          name: name,
        },
      });
    } catch (e) {
      return new Failure(new Error());
    }
    // ToDo: 存在しないときのエラーを出す

    return new Success(PrismaUsersRepository.typeConverter(res));
  }

  async updateUser(
    id: string,
    args: Partial<{
      name: string;
      password: string;
      icon: string;
      type: number;
      email: string;
    }>
  ): Promise<Result<User, Error>> {
    let res;
    try {
      res = await this._prisma.user.update({
        where: {
          id: id,
        },
        data: args,
      });
    } catch (e) {
      return new Failure(new Error());
    }

    return new Success(PrismaUsersRepository.typeConverter(res));
  }
}
