export class Contest {
  private readonly _id: string;
  private _title: string;
  private _description: string;
  private _startAt: Date;
  private _endAt: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    startAt: Date,
    endAt: Date
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._startAt = startAt;
    this._endAt = endAt;
  }

  get id(): string {
    return this._id;
  }
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get startAt(): Date {
    return this._startAt;
  }

  set startAt(value: Date) {
    this._startAt = value;
  }

  get endAt(): Date {
    return this._endAt;
  }

  set endAt(value: Date) {
    this._endAt = value;
  }
}

export class Contestant {
  private readonly _id: string;
  private readonly _userID: string;
  private readonly _contestID: string;
  private _type: number;

  constructor(id: string, userID: string, contestID: string, type: number) {
    this._id = id;
    this._userID = userID;
    this._contestID = contestID;
    this._type = type;
  }

  get id(): string {
    return this._id;
  }

  get userID(): string {
    return this._userID;
  }

  get contestID(): string {
    return this._contestID;
  }

  get type(): number {
    return this._type;
  }

  set type(value: number) {
    this._type = value;
  }
}
