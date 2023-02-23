import { Contest } from "../../models/contest.js";
import {
  CreateProblemResponseJSON,
  GetAllContestsResponseJSON,
  GetContestProblemsResponseJSON,
  GetContestResponseJSON,
  GetProblemResponseJSON,
} from "./types";
import { Problem } from "../../models/problems.js";
import { DateObjectToISODate } from "../../common/time.js";

export class ContestSerializer {
  parseGetAllContestsResponse(q: Array<Contest>): GetAllContestsResponseJSON {
    return q.map((c: Contest): GetContestResponseJSON => {
      return {
        id: c.id as string,
        title: c.title,
        description: c.description,
        startAt: DateObjectToISODate(c.startAt),
        endAt: DateObjectToISODate(c.endAt),
        createdAt: "", // ToDo: CreatedAtを追加
        updatedAt: "",
      };
    });
  }

  parseGetContestResponse(q: Contest): GetContestResponseJSON {
    return {
      id: q.id,
      title: q.title,
      description: q.description,
      startAt: DateObjectToISODate(q.startAt),
      endAt: DateObjectToISODate(q.endAt),
      createdAt: "", // ToDo: CreatedAtを追加する
      updatedAt: "",
    };
  }

  parseGetContestProblemsResponse(
    q: Array<Problem>
  ): GetContestProblemsResponseJSON {
    const problems: Array<CreateProblemResponseJSON> = q.map((p: Problem) => {
      return {
        id: p.id,
        title: p.title,
        text: p.text,
        limits: {
          memory: p.memoryLimit,
          time: p.timeLimit,
        },
      };
    });

    return {
      problems: problems,
    };
  }

  parseGetContestProblem(q: Problem): GetProblemResponseJSON {
    return {
      id: q.id,
      title: q.title,
      text: q.text,
      limits: {
        memory: q.memoryLimit,
        time: q.timeLimit,
      },
    };
  }
}
