import { Request, Response } from "express";
import { UsersUseCase } from "../../service/users/main";

export class UsersController {
  private _usersUsecase: UsersUseCase;
  constructor(repo: any) {
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
}
