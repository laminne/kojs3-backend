import { SnowflakeIDGenerator } from "./snowflakeIDGenerator";
import { describe, it, expect } from "vitest";
import { Snowflake } from "./snowflakeID";

describe("正しくID生成できる", () => {
  const exp = "264543141888000000" as Snowflake;
  process.env.TZ = "UTC";
  const generator = new SnowflakeIDGenerator();
  it("正しく生成できる", () => {
    const res = generator.newID(new Date("2022-04-01T00:00:00.000"));
    expect(res).toBe(exp);
  });
});
