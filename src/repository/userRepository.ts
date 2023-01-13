import { User } from "./prisma/users.js";

export interface UserRepository {
  findAll(): Promise<Array<User>>;
  findByID(id: string): Promise<User | undefined>;
  findByName(Name: string): Promise<any>;
  getUser(id: string): Promise<any>;
  create(name: string, hashed: string): Promise<any>;
}
