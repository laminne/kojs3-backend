import { prisma } from "../../client";

export type User = {
  id: string;
  name: string;
};

export async function findAllUsers(): Promise<User[]> {
  const user = await prisma.user.findMany({});
  const users: User[] = [];
  for (const i in user) {
    const tmp = {
      id: user[i].id,
      name: user[i].name,
    };
    users.push(tmp);
  }
  return users;
}

export async function findUserById(id: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return undefined;
  } else {
    return {
      id: user.id,
      name: user.name,
    };
  }
}

export async function getUser(id: string) {
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
