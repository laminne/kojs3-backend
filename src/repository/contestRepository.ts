import { Contest } from "../models/contest.js";
import { Result } from "../common/result.js";
import { Case, Problem } from "../models/problems.js";

export type contestUpdateArg = Partial<{
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
}>;

export interface ContestsRepository {
  // findAll 全コンテストを取得
  //
  // 一つも存在しない場合NotFoundErrorを返す
  // Repositoryの操作に失敗した場合RepositoryErrorを返す
  findAll(): Promise<Result<Array<Contest>, Error>>;
  // findByID 指定したIDのコンテストを取得
  //
  // 存在しない場合NotFoundErrorを返す
  // Repositoryの操作に失敗した場合RepositoryErrorを返す
  findByID(id: string): Promise<Result<Contest, Error>>;
  // createContest コンテストを作成
  //
  // 存在しない場合NotFoundErrorを返す
  // Repositoryの操作に失敗した場合RepositoryErrorを返す
  createContest(contest: Contest): Promise<Result<Contest, Error>>;
  // updateContest コンテストを更新
  //
  // 存在しない場合NotFoundErrorを返す
  // Repositoryの操作に失敗した場合RepositoryErrorを返す
  updateContest(
    id: string,
    arg: contestUpdateArg
  ): Promise<Result<Contest, Error>>;
  // deleteContest コンテストを削除
  //
  // 存在しない場合NotFoundErrorを返す
  // Repositoryの操作に失敗した場合RepositoryErrorを返す
  deleteContest(id: string): Promise<Result<Contest, Error>>;
}

export type problemUpdateArgs = Partial<{
  title: string;
  text: string;
  point: number;
  memoryLimit: number;
  timeLimit: number;
}>;
export type caseUpdateArgs = {
  input: string;
  output: string;
};
export interface ProblemRepository {
  createProblem(problem: Problem): Promise<Result<Problem, Error>>;
  updateProblem(
    id: string,
    args: problemUpdateArgs
  ): Promise<Result<Problem, Error>>;
  deleteProblem(id: string): Promise<Result<Problem, Error>>;
  findProblemByID(problemID: string): Promise<Result<Problem, Error>>;
  findProblemsByContestID(
    contestID: string
  ): Promise<Result<Array<Problem>, Error>>;

  createCase(c: Case): Promise<Result<Case, Error>>;
  updateCase(id: string, args: caseUpdateArgs): Promise<Result<Case, Error>>;
  findCasesByProblemID(id: string): Promise<Result<Array<Case>, Error>>;
}
