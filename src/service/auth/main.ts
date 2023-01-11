import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { createNewAccount } from "../../prisma/auth";
import { findUserByName } from "../../prisma/users";

export async function registerUser(name: string, password: string) {
  const hashed_password = await bcrypt.hash(password, 10);
  const res = await createNewAccount(name, hashed_password);
  if (!res) {
    throw new Error("CreateUserAccountFailError");
  }
  return await genJWTToken(name, password);
}

export async function genJWTToken(name: string, password: string) {
  const user = await findUserByName(name);
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

export function isTokenValid(token: string): boolean {
  const r = jsonwebtoken.verify(token, "123");
  if (!r) {
    return false;
  } else {
    return true;
  }
}
