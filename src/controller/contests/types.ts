export type CreateContestRequestJSON = {
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
};

export type CreateContestResponseJSON = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt?: string;
};

export type GetContestResponseJSON = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt?: string;
};

export type GetAllContestsResponseJSON = Array<GetContestResponseJSON>;

export type CreateProblemSubmissionRequestJSON = {
  problemID: string;
  code: string;
  language: string;
};

export type UpdateContestRequestJSON = {
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
};

export type UpdateContestResponseJSON = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  createdAt: string;
  updatedAt?: string;
};

export type CommonProblemJSON = {
  title: string;
  text: string;
  limits: {
    memory: number;
    time: number;
  };
};

export type CreateProblemRequestJSON = CommonProblemJSON;
export type CreateProblemResponseJSON = {
  id: string;
  title: string;
  text: string;
  limits: {
    memory: number;
    time: number;
  };
};

export type GetContestProblemsResponseJSON = {
  problems: Array<CreateProblemResponseJSON>;
};

export type GetProblemResponseJSON = {
  id: string;
  title: string;
  text: string;
  limits: {
    memory: number;
    time: number;
  };
};

export type UpdateProblemRequestJSON = {
  title: string;
  text: string;
  limits: {
    memory: number;
    time: number;
  };
};
export type UpdateProblemResponseJSON = {
  id: string;
  title: string;
  text: string;
  limits: {
    memory: number;
    time: number;
  };
};

export type CreateProblemTestCaseRequestJSON = {
  input: string;
  output: string;
};
export type CreateProblemTestCaseResponseJSON = {
  id: string;
  input: string;
  output: string;
};

export type UpdateProblemTestCaseRequestJSON = {
  input: string;
  output: string;
};
export type UpdateProblemTestCaseResponseJSON = {
  id: string;
  input: string;
  output: string;
};

export type GetContestSubmissionResponseJSON = {
  id: string;
  submittedAt: string;
  user: {
    id: string;
    name: string;
  };
  problemID: string;
  lang: string;
  score: number;
  status: string;
  execTime: number;
  memoryUsage: number;
};
export type GetContestSubmissionsResponseJSON = {
  submissions: Array<GetContestSubmissionResponseJSON>;
};
