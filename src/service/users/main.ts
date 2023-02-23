import { UserRepository } from "../../repository/userRepository.js";
import { IPasswordEncoder } from "../../common/password/passwordEncoder.js";
import { Argon2PasswordEncoder } from "../../common/password/argon2.js";
import { SnowflakeIDGenerator } from "../../common/id/snowflakeIDGenerator.js";
import { Failure, Result, Success } from "../../common/result.js";
import { User, userUpdateArgs } from "../../models/users.js";
import { Snowflake } from "../../common/id/snowflakeID.js";

export class UsersUseCase {
  private readonly _repository: UserRepository;
  private readonly _passwordEncoder: IPasswordEncoder;
  private readonly _idGenerator: SnowflakeIDGenerator;

  constructor(repo: UserRepository) {
    this._repository = repo;
    this._passwordEncoder = new Argon2PasswordEncoder();
    this._idGenerator = new SnowflakeIDGenerator();
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
}
