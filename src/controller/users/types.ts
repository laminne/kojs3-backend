export type LoginRequestJSON = {
  name: string;
  password: string;
};

export type LoginResponseJSON = {
  token: string;
};

export type CreateUserRequestJSON = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserResponseJSON = {
  id: string;
  name: string;
  email: string;
  token: string;
};
