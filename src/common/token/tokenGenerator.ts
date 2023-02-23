import * as jwt from "jsonwebtoken";
import { Result, Success } from "../result.js";
import { Snowflake } from "../id/snowflakeID.js";

export interface TokenGenerator {
  generate(uid: Snowflake): Promise<Result<string, Error>>;
}

export class JWTTokenGenerator implements TokenGenerator {
  private readonly privateKey: string;

  constructor(privKey: string) {
    this.privateKey = privKey;
  }

  async generate(uid: Snowflake): Promise<Result<string, Error>> {
    const payload = {
      sub: uid,
    };
    const res = jwt.sign(payload, this.privateKey, { algorithm: "RS256" });
    return new Success(res);
  }
}
