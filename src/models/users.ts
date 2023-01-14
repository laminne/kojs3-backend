export class User {
  private readonly _id: string;
  private _name: string;
  private _password: string;
  private _type: number;
  private _email: string;
  private _icon: string;

  constructor(
    id: string,
    name: string,
    password: string,
    type: number,
    email: string,
    icon: string
  ) {
    this._id = id;
    this._name = name;
    this._password = password;
    this._type = type;
    this._email = email;
    this._icon = icon;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get type(): number {
    return this._type;
  }

  set type(value: number) {
    this._type = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }
}
