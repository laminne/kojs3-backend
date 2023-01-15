import jsonwebtoken from "jsonwebtoken";
import { UserRepository } from "../../repository/userRepository.js";
import { IPasswordEncoder } from "../../common/password/passwordEncoder.js";
import { Argon2PasswordEncoder } from "../../common/password/argon2.js";
import { SnowflakeIDGenerator } from "../../common/id/snowflakeIDGenerator.js";
import { Result } from "../../common/result";
import { User } from "../../models/users";

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
  ): Promise<string | Error> {
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
      return new Error("CreateUserAccountFailError");
    }
    // ToDo: トークンの発行をControllerに移植する
    return await this.genJWTToken(name, password);
  }

  // ToDo: commonに移植する
  async genJWTToken(name: string, password: string) {
    const user = await this._repository.findUserByName(name);
    if (user.isFailure()) {
      throw new Error("");
    }
    const checkPassword = await this._passwordEncoder.IsMatchPassword(
      password,
      user.value.password
    );
    if (!checkPassword) {
      throw new Error("PasswordCompareError");
    }
    const data = {
      uid: user.value.id,
    };
    return jsonwebtoken.sign(data, "123", { algorithm: "HS256" });
  }
}

// ToDo: commonに移植する
export const isTokenValid = (token: string): boolean => {
  const r = jsonwebtoken.verify(token, "123");
  if (!r) {
    return false;
  } else {
    return true;
  }
};
