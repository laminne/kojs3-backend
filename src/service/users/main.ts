import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export class UsersUseCase {
  private _repository: any;

  constructor(repo: any) {
    this._repository = repo;
  }

  async allUsers() {
    return await this._repository.findAllUsers();
  }

  async getUser(userId: string) {
    return await this._repository.findUserById(userId);
  }

  async createUser(name: string, password: string) {
    const hashed_password = await bcrypt.hash(password, 10);
    const res = await this._repository.createNewAccount(name, hashed_password);
    if (!res) {
      throw new Error("CreateUserAccountFailError");
    }
    return await this.genJWTToken(name, password);
  }

  async genJWTToken(name: string, password: string) {
    const user = await this._repository.findUserByName(name);
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
