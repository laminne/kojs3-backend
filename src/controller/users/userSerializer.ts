import { User } from "../../models/users.js";
import { CreateUserResponseJSON } from "./types.js";

export class UserSerializer {
  parseCreateUserResponse(q: User, t: string): CreateUserResponseJSON {
    return {
      id: q.id,
      name: q.name,
      email: q.email,
      token: t,
    };
  }
}
