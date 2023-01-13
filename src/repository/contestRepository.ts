export interface ContestsRepository {
  /* findAllContests
     全コンテストを取得
   */
  findAllContests(): Promise<Array<any>>;

  /* findAllSubmissions
   * システム上の全提出を取得
   * */
  findAllSubmissions(): Promise<Array<any>>;

  /* findSubmissionByID
   * 指定した提出IDの提出を取得
   * */
  findSubmissionByID(id: string): Promise<any>;

  /*  findByID
   * 指定したIDのコンテストを取得
   * */
  findByID(id: string): Promise<any>;

  /*  findTaskByID
   * 指定したIDの問題を取得
   * */
  findTaskByID(id: string): Promise<any>;

  /* findAllContestTasks
   * 指定したIDのコンテストの問題をすべて取得
   */
  findAllContestTasks(contestId: string): Promise<Array<any>>;
}
