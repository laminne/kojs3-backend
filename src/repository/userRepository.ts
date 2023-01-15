import { Result } from "../common/result.js";
import { User, userUpdateArgs } from "../models/users.js";

export interface UserRepository {
  /* createUser ユーザー作成
    ユーザー名が使われている場合はAlreadyExistsErrorを返す
    Repositoryの操作に失敗した場合RepositoryErrorを返す */
  createUser(
    id: string,
    name: string,
    password: string,
    icon: string,
    type: number,
    email: string
  ): Promise<Result<User, Error>>;
  /* findAllUsers 全ユーザー取得
    一人も存在しない場合はNotFoundErrorを返す
    Repositoryの操作に失敗した場合RepositoryErrorを返す*/
  findAllUsers(): Promise<Result<Array<User>, Error>>;
  /* findUserByID 指定したユーザーIDのユーザーを取得
    存在しない場合はNotFoundErrorを返す
    Repositoryの操作に失敗した場合RepositoryErrorを返す*/
  findUserByID(id: string): Promise<Result<User, Error>>;
  /* findUserByUserName 指定したユーザー名のユーザーを取得
    存在しない場合はNotFoundErrorを返す
    Repositoryの操作に失敗した場合RepositoryErrorを返す*/
  findUserByName(name: string): Promise<Result<User, Error>>;
  /* updateUser 指定したユーザーIDのユーザー情報を更新
    存在しない場合はNotFoundErrorを返す
    Repositoryの操作に失敗した場合RepositoryErrorを返す */
  updateUser(id: string, args: userUpdateArgs): Promise<Result<User, Error>>;
}
