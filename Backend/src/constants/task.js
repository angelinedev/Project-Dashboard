export const TASK_STATUS = {
  BACKLOG: "backlog",
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  REVIEW: "review",
  DONE: "done",
};

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

export const TASK_STATUS_OPTIONS = Object.freeze(Object.values(TASK_STATUS));
export const TASK_PRIORITY_OPTIONS = Object.freeze(Object.values(TASK_PRIORITY));
