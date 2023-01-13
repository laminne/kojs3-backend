import { EncodedPassword, IPasswordEncoder } from "./passwordEncoder";
import argon2 from "argon2";

export class Argon2PasswordEncoder implements IPasswordEncoder {
  async EncodePassword(raw: string): Promise<EncodedPassword> {
    // ToDo: ここのパラメーターをちゃんと指定する
    return await argon2.hash(raw);
  }

  async IsMatchPassword(
    raw: string,
    encoded: EncodedPassword
  ): Promise<boolean> {
    let res: boolean;
    try {
      res = await argon2.verify(encoded, raw);
    } catch {
      return false;
    }
    return res;
  }
}
