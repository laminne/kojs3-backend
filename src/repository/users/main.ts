import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export type Users = {
  id: string;
  name: string;
};
/* eslint-disable */
export async function getallUsers(): Promise<Array<Users>> {
  const user = await prisma.user.findMany({});
  let users: Array<Users> = [];
  for (const i in user) {
    users[i] = {
      id: user[i].id,
      name: user[i].name,
    };
  }
  return users;
}

export async function getOneUser(id: string): Promise<Users | undefined> {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return undefined;
  } else {
    const users: Users = {
      id: user.id,
      name: user.name,
    };
    return users;
  }
}

export async function getUser(id: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return undefined;
  } else {
    return user;
  }
}

// ToDo: 過去の成績表示
// export async function getUserHistory(id: string): Promise<Array<Users>>{
//   const user = await prisma.
// }
