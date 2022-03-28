import { getallUsers, getOneUser } from "../../repository/users/main";

export async function allUsers() {
  return await getallUsers();
}

export async function getUser(userId: string) {
  return await getOneUser(userId);
}

// export async function userHistory(userId: string) {
//   return await
// }
