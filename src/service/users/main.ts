import * as db from "../../prisma/users";

export async function allUsers() {
  return await db.findAllUsers();
}

export async function getUser(userId: string) {
  return await db.findUserById(userId);
}
