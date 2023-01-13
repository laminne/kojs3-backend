import { Request, Response } from "express";
import { UsersUseCase } from "../../service/users/main.js";
import { UserRepository } from "../../repository/userRepository.js";

export class UsersController {
  private _usersUsecase: UsersUseCase;

  constructor(repo: UserRepository) {
    this._usersUsecase = new UsersUseCase(repo);
  }

  public getAllUsers = async (_req: Request, res: Response) => {
    const users = await this._usersUsecase.allUsers();
    res.json(users);
    return;
  };

  public getUserData = async (req: Request, res: Response) => {
    const user = await this._usersUsecase.getUser(req.params.userId);
    res.json(user);
    return;
  };

  public login = async (req: Request, res: Response) => {
    const users = await this._usersUsecase.genJWTToken(
      req.body.name,
      req.body.password
    );
    const resBody = {
      token: users,
    };
    res.json(resBody);
    return;
  };

  public register = async (req: Request, res: Response) => {
    const user = await this._usersUsecase.createUser(
      req.body.name,
      req.body.password
    );
    const resBody = {
      token: user,
    };
    res.json(resBody);
    return;
  };
}
