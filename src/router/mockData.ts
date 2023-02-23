import { Contest } from "../models/contest.js";
import { ISODateToObject } from "../common/time.js";
import { Submission } from "../models/submissions.js";
import { Case, Problem } from "../models/problems.js";
import { User } from "../models/users.js";

export const ContestsMockData = [
  new Contest(
    "123123123",
    "テストコンテスト1",
    "hello\nworld",
    ISODateToObject("2020-02-02T00:00:00+09:00"),
    ISODateToObject("2020-02-02T03:00:00+09:00")
  ),
  new Contest(
    "456456456",
    "テストコンテスト2",
    "こんにちは\n",
    ISODateToObject("2020-02-03T00:00:00+09:00"),
    ISODateToObject("2020-04-02T03:00:00+09:00")
  ),
];

export const SubmissionMockData = [
  new Submission(
    "888888888",
    "123123123",
    "000",
    "333333333",
    "cHJpbnQgImhlbGxvIg==",
    "Ruby",
    "WJ",
    100
  ),
  new Submission(
    "555555555",
    "456456456",
    "111",
    "222222222",
    "cHJpbnQgImhlbGxvIg==",
    "Ruby",
    "IE",
    500
  ),
];

export const ProblemMockData = [
  new Problem(
    "333333333",
    "123123123",
    "足し算",
    "これが問題です.",
    200,
    1024,
    2000
  ),
  new Problem(
    "222222222",
    "456456456",
    "引き算",
    "これが問題です.",
    500,
    256,
    1000
  ),
];
export const CaseMockData = [
  new Case("695", "333333333", "hello\n", "world\n"),
  new Case("889", "222222222", "foo\n", "bar\n"),
];

export const UserMockData = [
  new User(
    "123",
    "user1",
    "$argon2id$v=19$m=65536,t=3,p=4$ntLv+XgYYzQgND6TVFcwww$TJLFjY+BquITMuLR/MpfVUZxB/lxAtoR4sdxjv+FqUQ",
    0,
    "j2000@matsue-ct.jp",
    ""
  ),
  new User(
    "456",
    "user2",
    "$argon2id$v=19$m=65536,t=3,p=4$ntLv+XgYYzQgND6TVFcwww$TJLFjY+BquITMuLR/MpfVUZxB/lxAtoR4sdxjv+FqUQ",
    0,
    "j2999@matsue-ct.jp",
    ""
  ),
];
