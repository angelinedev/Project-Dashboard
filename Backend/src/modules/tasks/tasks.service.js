import { Task } from "../../models/Task.js";
import { TeamMember } from "../../models/TeamMember.js";
import { createHttpError } from "../../utils/createHttpError.js";

const getMembership = async (teamId, userId) => {
  const membership = await TeamMember.findOne({ team: teamId, user: userId });

  if (!membership) {
    throw createHttpError(403, "You do not have access to this team.");
  }

  return membership;
};

export const createTask = async ({
  userId,
  teamId,
  title,
  description,
  assignedTo,
  dueDate,
  priority,
}) => {
  if (!teamId || !title?.trim()) {
    throw createHttpError(400, "Team and title are required.");
  }

  const membership = await getMembership(teamId, userId);

  if (membership.role !== "leader") {
    throw createHttpError(403, "Only a team leader can create tasks.");
  }

  return Task.create({
    team: teamId,
    title: title.trim(),
    description: description?.trim() ?? "",
    createdBy: userId,
    assignedTo: assignedTo || null,
    dueDate: dueDate || null,
    priority: priority || "medium",
  });
};

export const getTasksForUser = async ({ userId, teamId }) => {
  if (!teamId) {
    return Task.find({
      $or: [{ assignedTo: userId }, { createdBy: userId }],
    })
      .populate("team", "teamName inviteCode")
      .populate("assignedTo", "fullName email avatarUrl")
      .populate("createdBy", "fullName email avatarUrl")
      .sort({ createdAt: -1 });
  }

  const membership = await getMembership(teamId, userId);
  const query = { team: teamId };

  if (membership.role !== "leader") {
    query.assignedTo = userId;
  }

  return Task.find(query)
    .populate("team", "teamName inviteCode")
    .populate("assignedTo", "fullName email avatarUrl")
    .populate("createdBy", "fullName email avatarUrl")
    .sort({ createdAt: -1 });
};

export const updateTaskStatus = async ({ userId, taskId, status }) => {
  if (!status) {
    throw createHttpError(400, "Task status is required.");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw createHttpError(404, "Task not found.");
  }

  const membership = await getMembership(task.team, userId);
  const isLeader = membership.role === "leader";
  const isAssignee =
    task.assignedTo && task.assignedTo.toString() === userId.toString();

  if (!isLeader && !isAssignee) {
    throw createHttpError(403, "You cannot update this task.");
  }

  task.status = status;
  await task.save();

  return task.populate([
    { path: "team", select: "teamName inviteCode" },
    { path: "assignedTo", select: "fullName email avatarUrl" },
    { path: "createdBy", select: "fullName email avatarUrl" },
  ]);
};
