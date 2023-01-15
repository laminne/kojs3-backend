import { describe, expect, it } from "vitest";
import { ContestUseCase } from "./main";
import {
  InmemoryContestsRepository,
  InmemoryProblemRepository,
} from "../../repository/memory/contest";
import { InmemorySubmissionsRepository } from "../../repository/memory/submission";
import { Contest } from "../../models/contest";

describe("コンテスト", () => {
  const contest = new ContestUseCase(
    new InmemoryContestsRepository([
      new Contest(
        "123",
        "test",
        "テスト",
        new Date("2020/07/13 13:00:00.000"),
        new Date("2020/07/13 13:00:00.000")
      ),
      new Contest(
        "256",
        "未来のコンテスト",
        "未来に開催されるコンテスト",
        new Date("2100/12/31 12:59:59.000"),
        new Date("2100/01/01 00:00:00.000")
      ),
    ]),
    new InmemorySubmissionsRepository([]),
    new InmemoryProblemRepository([], [])
  );

  it("コンテストをすべて取得できる", async () => {
    const res = await contest.allContests();

    expect(res.value).toStrictEqual([
      new Contest(
        "123",
        "test",
        "テスト",
        new Date("2020/07/13 13:00:00.000"),
        new Date("2020/07/13 13:00:00.000")
      ),
      new Contest(
        "256",
        "未来のコンテスト",
        "未来に開催されるコンテスト",
        new Date("2100/12/31 12:59:59.000"),
        new Date("2100/01/01 00:00:00.000")
      ),
    ]);
  });

  it("コンテストを1件取得できる", async () => {
    const res = await contest.oneContest("123");

    expect(res.value).toStrictEqual(
      new Contest(
        "123",
        "test",
        "テスト",
        new Date("2020/07/13 13:00:00.000"),
        new Date("2020/07/13 13:00:00.000")
      )
    );
  });
});
