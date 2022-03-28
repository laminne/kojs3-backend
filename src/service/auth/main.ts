import bcrypt from "bcrypt";
// import * as fs from "fs";
import jsonwebtoken from "jsonwebtoken";
import { createNewAccount } from "../../prisma/queries/auth/main";
import { getUser } from "../../prisma/queries/users/find";

export async function registerUser(name: string, password: string) {
  const hashed_password = await bcrypt.hash(password, 10);
  return await createNewAccount(name, hashed_password);
}

export async function genJWTToken(id: string, password: string) {
  const user = await getUser(id);
  if (!user) {
    return;
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return;
  }
  const data = {
    uid: user.id,
  };
  jsonwebtoken.sign(data, "123", { algorithm: "HS256" });
}
