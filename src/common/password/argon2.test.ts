import { IPasswordEncoder } from "./passwordEncoder";
import { Argon2PasswordEncoder } from "./argon2";
import { describe, it, expect } from "vitest";

describe("Argon2で正しく検証できる", async () => {
  const raw = "HELLO-WORLD!";
  const encoder: IPasswordEncoder = new Argon2PasswordEncoder();

  const encoded = await encoder.EncodePassword("HELLO-WORLD!");
  it("正しく検証できる", async () => {
    const res = await encoder.IsMatchPassword(raw, encoded);
    expect(res).toBe(true);
  });

  it("正しくなければ失敗する", async () => {
    const res = await encoder.IsMatchPassword(raw, "$argon2id$v=$m=,t=,p=$");
    expect(res).toBeFalsy;
  });
});
