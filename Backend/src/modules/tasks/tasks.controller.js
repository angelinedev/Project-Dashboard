import { asyncHandler } from "../../utils/asyncHandler.js";

import { createTask, getTasksForUser, updateTaskStatus } from "./tasks.service.js";

export const createTaskController = asyncHandler(async (request, response) => {
  const task = await createTask({
    userId: request.user._id,
    teamId: request.body.teamId,
    title: request.body.title,
    description: request.body.description,
    assignedTo: request.body.assignedTo,
    dueDate: request.body.dueDate,
    priority: request.body.priority,
  });

  response.status(201).json({
    success: true,
    data: task,
  });
});

export const getTasksController = asyncHandler(async (request, response) => {
  const tasks = await getTasksForUser({
    userId: request.user._id,
    teamId: request.query.teamId,
  });

  response.status(200).json({
    success: true,
    data: tasks,
  });
});

export const updateTaskStatusController = asyncHandler(async (request, response) => {
  const task = await updateTaskStatus({
    userId: request.user._id,
    taskId: request.params.taskId,
    status: request.body.status,
  });

  response.status(200).json({
    success: true,
    data: task,
  });
});
