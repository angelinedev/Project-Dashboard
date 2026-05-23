import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTasks = asyncHandler(async (_request, response) => {
  const tasks = await Task.find().sort({ sortOrder: 1, createdAt: -1 });

  response.status(200).json({
    success: true,
    data: tasks,
  });
});
