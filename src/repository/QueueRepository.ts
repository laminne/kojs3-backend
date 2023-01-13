// ToDo: そもそもこれ必要か？
export interface QueueRepository {
  SubmitQueue(queue: {
    status: string;
    submission: string;
    hqId: string;
  }): Promise<any>;
}
