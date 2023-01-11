export class UsersUseCase {
  private _repository: any;

  constructor(repo: any) {
    this._repository = repo;
  }

  async allUsers() {
    return await this._repository.findAllUsers();
  }

  async getUser(userId: string) {
    return await this._repository.findUserById(userId);
  }
}
