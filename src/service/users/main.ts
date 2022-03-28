import * as db from "../../prisma/queries/users/find";

export async function allUsers() {
  return await db.findAllUsers();
}

export async function getUser(userId: string) {
  return await db.findUserById(userId);
}
