export class Problem {
  private readonly _id: string;
  private readonly _contestID: string;

  private _title: string;
  private _text: string;
  private _point: number;
  private _memoryLimit: number;
  private _timeLimit: number;

  constructor(
    id: string,
    contestID: string,
    title: string,
    text: string,
    point: number,
    memoryLimit: number,
    timeLimit: number
  ) {
    this._id = id;
    this._contestID = contestID;
    this._title = title;
    this._text = text;
    this._point = point;
    this._memoryLimit = memoryLimit;
    this._timeLimit = timeLimit;
  }

  get id(): string {
    return this._id;
  }

  get contestID(): string {
    return this._contestID;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  get point(): number {
    return this._point;
  }

  set point(value: number) {
    this._point = value;
  }

  get memoryLimit(): number {
    return this._memoryLimit;
  }

  set memoryLimit(value: number) {
    this._memoryLimit = value;
  }

  get timeLimit(): number {
    return this._timeLimit;
  }

  set timeLimit(value: number) {
    this._timeLimit = value;
  }
}

export class Case {
  private readonly _id: string;
  private readonly _problemID: string;
  private _input: string;
  private _output: string;

  constructor(id: string, problemID: string, input: string, output: string) {
    this._id = id;
    this._problemID = problemID;
    this._input = input;
    this._output = output;
  }

  get id(): string {
    return this._id;
  }

  get problemID(): string {
    return this._problemID;
  }

  get input(): string {
    return this._input;
  }

  set input(value: string) {
    this._input = value;
  }

  get output(): string {
    return this._output;
  }

  set output(value: string) {
    this._output = value;
  }
}
