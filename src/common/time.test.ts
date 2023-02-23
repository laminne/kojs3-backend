import { describe, expect, it } from "vitest";
import { DateObjectToISODate, ISODateToObject } from "./time";

describe("", () => {
  it("時刻を正しくパースできる", () => {
    process.env.TZ = "UTC";
    expect(ISODateToObject("2023-02-23T00:00:00+09:00")).toStrictEqual(
      new Date(2023, 1, 23, 0, 0, 0, 0)
    );
  });

  it("時刻を正しく文字列にできる", () => {
    process.env.TZ = "UTC";
    expect(
      DateObjectToISODate(new Date("2023-02-23T00:00:00+09:00"))
    ).toStrictEqual("2023-02-23T00:00:00+09:00");
  });
});
