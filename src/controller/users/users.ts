import { Request, Response } from "express";
import { UsersUseCase } from "../../service/users/main.js";
import { PrismaUsersRepository } from "../../prisma/users.js";

export class UsersController {
  private _usersUsecase: UsersUseCase;

  constructor(repo: PrismaUsersRepository) {
    this._usersUsecase = new UsersUseCase(repo);
  }

  async getAllUsers(_req: Request, res: Response) {
    const users = await this._usersUsecase.allUsers();
    res.json(users);
    return;
  }

  async getUserData(req: Request, res: Response) {
    const user = await this._usersUsecase.getUser(req.params.userId);
    res.json(user);
    return;
  }

  async login(req: Request, res: Response) {
    const users = await this._usersUsecase.genJWTToken(
      req.body.name,
      req.body.password
    );
    const resBody = {
      token: users,
    };
    res.json(resBody);
    return;
  }

  async register(req: Request, res: Response) {
    const user = await this._usersUsecase.createUser(
      req.body.name,
      req.body.password
    );
    const resBody = {
      token: user,
    };
    res.json(resBody);
    return;
  }
}
