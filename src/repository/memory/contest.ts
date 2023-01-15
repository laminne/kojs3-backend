import { ContestsRepository, contestUpdateArg } from "../contestRepository";
import { Failure, Result, Success } from "../../common/result";
import { Contest } from "../../models/contest";

export class InmemoryContestsRepository implements ContestsRepository {
  private readonly _contests: Set<Contest>;

  constructor(data: Array<Contest>) {
    this._contests = new Set<Contest>(data);
  }

  async createContest(contest: Contest): Promise<Result<Contest, Error>> {
    // 追加する前と後でsizeが同じなら,すでにデータが存在する
    const sizeBeforeAdding = this._contests.size;

    this._contests.add(contest);

    const sizeAfterAdding = this._contests.size;
    if (sizeAfterAdding === sizeBeforeAdding) {
      return new Failure(new Error("AlreadyExistsError"));
    }

    return new Success(contest);
  }

  async deleteContest(id: string): Promise<Result<Contest, Error>> {
    const res = await this.findByID(id);
    // 存在しないときはエラー
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    if (!this._contests.delete(res.value)) {
      return new Failure(new Error("DataStoreError"));
    }

    return new Success(res.value);
  }

  async findAll(): Promise<Result<Array<Contest>, Error>> {
    return new Success([...this._contests]);
  }

  async findByID(id: string): Promise<Result<Contest, Error>> {
    for (const v of this._contests) {
      if (v.id === id) {
        return new Success(v);
      }
    }

    return new Failure(new Error("NotFoundError"));
  }

  async updateContest(
    id: string,
    arg: contestUpdateArg
  ): Promise<Result<Contest, Error>> {
    const res = await this.findByID(id);
    // 存在しないときはエラー
    if (res.isFailure()) {
      return new Failure(res.value);
    }

    // 一回消す
    await this.deleteContest(res.value.id);

    if (arg.title) {
      res.value.title = arg.title;
    }
    if (arg.description) {
      res.value.description = arg.description;
    }
    if (arg.startAt) {
      res.value.startAt = arg.startAt;
    }
    if (arg.endAt) {
      res.value.endAt = arg.endAt;
    }

    await this.createContest(res.value);

    return new Success(res.value);
  }
}
