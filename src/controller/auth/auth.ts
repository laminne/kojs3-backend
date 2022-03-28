import { Request, Response } from "express";
import { genJWTToken, registerUser } from "../../service/auth/main";

export async function login(req: Request, res: Response) {
  const users = await genJWTToken(req.body.name, req.body.password);
  res.json(users);
  return;
}

export async function register(req: Request, res: Response) {
  const user = await registerUser(req.body.name, req.body.password);
  res.json(user);
  return;
}
