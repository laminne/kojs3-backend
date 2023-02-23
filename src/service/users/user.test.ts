import { describe, expect, it } from "vitest";
import { UsersUseCase } from "./main";
import { InmemoryUserRepository } from "../../repository/memory/users";

describe("UsersUseCase", async () => {
  const users = new UsersUseCase(new InmemoryUserRepository([]), "");

  it("ユーザー作成できる", async () => {
    const res = await users.createUser(
      "laminne",
      "password",
      "https://example.jp/test.jpg",
      0,
      "me@example.jp"
    );

    expect(res).toBeTruthy();
  });

  it("ユーザー情報の重複があるときは登録できない", async () => {
    await users.createUser(
      "test",
      "password",
      "https://example.jp/test.jpg",
      0,
      "me@example.jp"
    );
    const res = await users.createUser(
      "test",
      "password",
      "https://example.jp/test.jpg",
      0,
      "me@example.jp"
    );

    expect(res.value).toStrictEqual(new Error("CreateUserAccountFailError"));
  });

  it("全ユーザーを取得できる", async () => {
    const res = await users.allUsers();
    expect(res).toBeTruthy();
  });
});
