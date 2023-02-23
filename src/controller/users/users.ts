import { Request, Response } from "express";
import { UsersUseCase } from "../../service/users/main.js";
import { UserRepository } from "../../repository/userRepository.js";
import { readFileSync } from "fs";

export class UsersController {
  private _usersUsecase: UsersUseCase;

  constructor(repo: UserRepository) {
    // ToDo: 設定ファイルを読むようにする
    const a = readFileSync("./private.pem");
    this._usersUsecase = new UsersUseCase(repo, a.toString());
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
    // 方針: pw検証 -> OKならトークン生成
    const token = await this._usersUsecase.login(
      req.body.name,
      req.body.password
    );
    const resBody = {
      token: token,
    };

    res.json(resBody);
    return;
  };

  public register = async (req: Request, res: Response) => {
    // ToDo: Resultをunwrapする
    const user = await this._usersUsecase.createUser(
      req.body.name,
      req.body.password,
      req.body.icon,
      req.body.type, // ToDo: ユーザーの権限設定
      req.body.email
    );
    const resBody = {
      token: user,
    };
    res.json(resBody);
    return;
  };
}
