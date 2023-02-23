import { UserRepository } from "../../repository/userRepository.js";
import { IPasswordEncoder } from "../../common/password/passwordEncoder.js";
import { Argon2PasswordEncoder } from "../../common/password/argon2.js";
import { SnowflakeIDGenerator } from "../../common/id/snowflakeIDGenerator.js";
import { Failure, Result, Success } from "../../common/result.js";
import { User, userUpdateArgs } from "../../models/users.js";
import { Snowflake } from "../../common/id/snowflakeID.js";
import {
  JWTTokenGenerator,
  TokenGenerator,
} from "../../common/token/tokenGenerator.js";

export class UsersUseCase {
  private readonly _repository: UserRepository;
  private readonly _passwordEncoder: IPasswordEncoder;
  private readonly _idGenerator: SnowflakeIDGenerator;
  private readonly _tokenGenerator: TokenGenerator;

  constructor(repo: UserRepository, key: string) {
    this._repository = repo;
    this._passwordEncoder = new Argon2PasswordEncoder();
    this._idGenerator = new SnowflakeIDGenerator();
    this._tokenGenerator = new JWTTokenGenerator(key);
  }

  async allUsers(): Promise<Result<Array<User>, Error>> {
    return await this._repository.findAllUsers();
  }

  async getUser(userId: string): Promise<Result<User, Error>> {
    return await this._repository.findUserByID(userId);
  }

  async createUser(
    name: string,
    password: string,
    icon: string,
    type: number,
    email: string
  ): Promise<Result<User, Error>> {
    const hashed_password = await this._passwordEncoder.EncodePassword(
      password
    );
    const id = this._idGenerator.newID(new Date());
    const res = await this._repository.createUser(
      id,
      name,
      hashed_password,
      icon,
      type,
      email
    );

    if (res.isFailure()) {
      return new Failure(new Error("CreateUserAccountFailError"));
    }

    return new Success(res.value);
  }

  async updateUser(
    id: Snowflake,
    args: userUpdateArgs
  ): Promise<Result<User, Error>> {
    const res = await this._repository.updateUser(id, args);

    if (res.isFailure()) {
      return new Failure(res.value);
    }

    return new Success(res.value);
  }

  async login(name: string, pass: string): Promise<Result<string, Error>> {
    // ユーザー情報を取ってくる
    const u = await this._repository.findUserByName(name);
    if (u.isFailure()) {
      return new Failure(u.value);
    }
    // pwを比較
    const p = await this._passwordEncoder.IsMatchPassword(
      pass,
      u.value.password
    );
    if (!p) {
      return new Failure(new Error("password is not matched"));
    }
    // OKならトークン返す
    const token = await this._tokenGenerator.generate(u.value.id as Snowflake);
    if (token.isFailure()) {
      return new Failure(new Error("failed to generate access token"));
    }
    return new Success(token.value);
  }
}
