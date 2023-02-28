import { describe, expect, it } from "vitest";
import { ContestUseCase } from "./main.js";
import {
  InmemoryContestsRepository,
  InmemoryProblemRepository,
} from "../../repository/memory/contest.js";
import { InmemorySubmissionsRepository } from "../../repository/memory/submission.js";
import { Contest } from "../../models/contest.js";
import { Problem } from "../../models/problems.js";
import { DummyQueue } from "./jobqueuemanager.js";

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
    new InmemoryProblemRepository(
      [
        new Problem(
          "514",
          "256",
          "A - S+Q+L",
          "標準入力で与えられる...",
          300,
          2000,
          2000
        ),
        new Problem(
          "321",
          "123",
          "C - 登校時間",
          "Aさんは自分の学校に電車を使って...",
          100,
          1000,
          200
        ),
      ],
      []
    ),
    new DummyQueue(),
    ""
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
    const res = await contest.getContestByID("123");

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

  it("開催前のコンテストの問題は取得できない", async () => {
    const res = await contest.getContestProblemsByID("256");
    expect(res.value).toStrictEqual(new Error("ContestIsNotStarted"));
  });

  it("開催後のコンテストの問題を取得できる", async () => {
    const res = await contest.getContestProblemsByID("123");
    expect(res.value).toStrictEqual([
      new Problem(
        "321",
        "123",
        "C - 登校時間",
        "Aさんは自分の学校に電車を使って...",
        100,
        1000,
        200
      ),
    ]);
  });

  it("開催前のコンテストを取得できる", async () => {
    const res = await contest.getContestByID("256");
    expect(res.value).toStrictEqual(
      new Contest(
        "256",
        "未来のコンテスト",
        "未来に開催されるコンテスト",
        new Date("2100/12/31 12:59:59.000"),
        new Date("2100/01/01 00:00:00.000")
      )
    );
  });

  it("開催前のコンテストの問題を1つ取得することはできない", async () => {
    const res = await contest.getContestProblem("514");
    expect(res.value).toStrictEqual(new Error("ContestIsNotStarted"));
  });

  it("開催後のコンテストの問題を1つ取得することはできる", async () => {
    const res = await contest.getContestProblem("321");
    expect(res.value).not.toStrictEqual(new Error("ContestIsNotStarted"));
  });
});
