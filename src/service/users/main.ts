import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { UserRepository } from "../../repository/userRepository.js";

export class UsersUseCase {
  private _repository: UserRepository;

  constructor(repo: UserRepository) {
    this._repository = repo;
  }

  async allUsers() {
    return await this._repository.findAll();
  }

  async getUser(userId: string) {
    return await this._repository.findByID(userId);
  }

  async createUser(name: string, password: string) {
    const hashed_password = await bcrypt.hash(password, 10);
    const res = await this._repository.create(name, hashed_password);
    if (!res) {
      throw new Error("CreateUserAccountFailError");
    }
    return await this.genJWTToken(name, password);
  }

  async genJWTToken(name: string, password: string) {
    const user = await this._repository.findByName(name);
    if (!user) {
      throw new Error("UserNotFoundError");
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw new Error("PasswordCompareError");
    }
    const data = {
      uid: user.id,
    };
    return jsonwebtoken.sign(data, "123", { algorithm: "HS256" });
  }
}

export const isTokenValid = (token: string): boolean => {
  const r = jsonwebtoken.verify(token, "123");
  if (!r) {
    return false;
  } else {
    return true;
  }
};
