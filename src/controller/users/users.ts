import { Request, Response } from "express";
import { allUsers, getUser } from "../../service/users/main";

export async function getAllUsers(_req: Request, res: Response) {
  const users = await allUsers();
  res.json(users);
  return;
}

export async function getUserData(req: Request, res: Response) {
  const user = await getUser(req.params.userId);
  res.json(user);
  return;
}

export function getUserHistory(req: Request, res: Response) {
  console.log(req.path);
  res.send("Hello");
}
