import axios from "axios";

export const hqURL = "http://localhost:19900/job";
export type Job = {
  url: string;
  payload: {
    task_id: string;
    code: string;
    compiler_type: string;
  };
};

export type HqResponse = {
  canceled: boolean;
  comment: string;
  createdAt: Date;
  err: string;
  failure: boolean;
  finishedAt: Date;
  headers?: object;
  id: string;
  name: string;
  output: string;
  payload: object;
  running: boolean;
  startedAt?: Date;
  status: string;
  statusCode?: number;
  success: boolean;
  timeout: number;
  url: string;
  waiting: boolean;
};

export async function enqueue(job: Job): Promise<HqResponse | Error> {
  try {
    const res = await axios.post<HqResponse>(hqURL, JSON.stringify(job), {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.data.status) {
      console.error("API RESPONSE ERROR");
    }
    return res.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    }
    throw e;
  }
}
