import { Request, Response } from "express";
import { UsersUseCase } from "../../service/users/main.js";
import { UserRepository } from "../../repository/userRepository.js";
import { readFileSync } from "fs";
import { JWTTokenGenerator } from "../../common/token/tokenGenerator.js";
import { UserSerializer } from "./userSerializer.js";
import { Snowflake } from "../../common/id/snowflakeID";

export class UsersController {
  private _usersUsecase: UsersUseCase;
  private _tokenGenerator: JWTTokenGenerator;
  private _serializer: UserSerializer;

  constructor(repo: UserRepository) {
    // ToDo: 設定ファイルを読むようにする
    const a = readFileSync("./private.pem");
    this._tokenGenerator = new JWTTokenGenerator(a.toString());
    this._usersUsecase = new UsersUseCase(repo, a.toString());
    this._serializer = new UserSerializer();
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
    if (token.isFailure()) {
      return res.status(400).send("");
    }

    const resBody = {
      token: token.value,
    };

    return res.json(resBody);
  };

  public register = async (req: Request, res: Response) => {
    // ToDo: Resultをunwrapする
    const user = await this._usersUsecase.createUser(
      req.body.name,
      req.body.password,
      req.body.icon ?? "",
      req.body.type ?? 0, // ToDo: ユーザーの権限設定
      req.body.email
    );

    if (user.isFailure()) {
      return res.status(400).send("");
    }

    const token = await this._tokenGenerator.generate(
      user.value.id as Snowflake
    );
    if (token.isFailure()) {
      return res.status(400).send("");
    }

    // ToDo: シリアライザ書く
    // ToDo: モック実装する
    return res
      .status(201)
      .json(this._serializer.parseCreateUserResponse(user.value, token.value));
  };
}
