import { UserRepository } from "../userRepository.js";
import { User, userUpdateArgs } from "../../models/users.js";
import { Failure, Result, Success } from "../../common/result.js";

export class InmemoryUserRepository implements UserRepository {
  private readonly _users: Set<User>;

  constructor(data: Array<User> | undefined) {
    if (!data) {
      this._users = new Set<User>();
    } else {
      this._users = new Set<User>(data);
    }
  }

  async createUser(
    id: string,
    name: string,
    password: string,
    icon: string,
    type: number,
    email: string
  ): Promise<Result<User, Error>> {
    const user = new User(id, name, password, type, email, icon);

    // Uniqueな値は重複してはいけない
    for (const v of this._users) {
      if (v.id === user.id || v.name === user.name) {
        return new Failure(new Error("AlreadyExistsError"));
      }
    }

    this._users.add(user);

    return new Success(user);
  }

  async findAllUsers(): Promise<Result<Array<User>, Error>> {
    return new Success([...this._users]);
  }

  async findUserByID(id: string): Promise<Result<User, Error>> {
    for (const v of this._users) {
      if (v.id === id) {
        return new Success(v);
      }
    }
    return new Failure(new Error("NotFoundError"));
  }

  async findUserByName(name: string): Promise<Result<User, Error>> {
    for (const v of this._users) {
      if (v.name === name) {
        return new Success(v);
      }
    }
    return new Failure(new Error("NotFoundError"));
  }

  async updateUser(
    id: string,
    args: userUpdateArgs
  ): Promise<Result<User, Error>> {
    const res = await this.findUserByID(id);
    // 存在しないときはエラー
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    // 一回消す
    this._users.delete(res.value);

    if (args.name) {
      res.value.name = args.name;
    }
    if (args.password) {
      res.value.password = args.password;
    }
    if (args.icon) {
      res.value.icon = args.icon;
    }
    if (args.type) {
      res.value.type = args.type;
    }
    if (args.email) {
      res.value.email = args.email;
    }

    await this.createUser(
      res.value.id,
      res.value.name,
      res.value.password,
      res.value.icon,
      res.value.type,
      res.value.email
    );

    return new Success(res.value);
  }
}
