export class Submission {
  private readonly _id: string;
  private readonly _contestID: string;
  private readonly _contestantID: string;

  private _code: string;
  private _language: string;
  private _status: string;

  private _point: string;

  constructor(
    id: string,
    contestID: string,
    contestantID: string,
    code: string,
    language: string,
    status: string,
    point: string
  ) {
    this._id = id;
    this._contestID = contestID;
    this._contestantID = contestantID;
    this._code = code;
    this._language = language;
    this._status = status;
    this._point = point;
  }
  get id(): string {
    return this._id;
  }

  get contestID(): string {
    return this._contestID;
  }

  get contestantID(): string {
    return this._contestantID;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  get language(): string {
    return this._language;
  }

  set language(value: string) {
    this._language = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get point(): string {
    return this._point;
  }
  set point(value: string) {
    this._point = value;
  }
}

export class JudgeStatus {
  private readonly _id: string;
  private readonly _submissionID: string;
  private _memoryUsage: number;
  private _execTime: number;

  constructor(
    id: string,
    submissionID: string,
    memoryUsage: number,
    execTime: number
  ) {
    this._id = id;
    this._submissionID = submissionID;
    this._memoryUsage = memoryUsage;
    this._execTime = execTime;
  }

  get id(): string {
    return this._id;
  }

  get submissionID(): string {
    return this._submissionID;
  }

  get memoryUsage(): number {
    return this._memoryUsage;
  }

  set memoryUsage(value: number) {
    this._memoryUsage = value;
  }

  get execTime(): number {
    return this._execTime;
  }

  set execTime(value: number) {
    this._execTime = value;
  }
}
