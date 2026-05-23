import { Task } from "../../models/Task.js";
import { User } from "../../models/User.js";
import {
  TEAM_ROLE,
  canManageTeamTasks,
  getTeamAccess,
} from "../../utils/accessControl.js";
import { TeamMember } from "../../models/TeamMember.js";
import { createHttpError } from "../../utils/createHttpError.js";

export const createTask = async ({
  actor,
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

  const access = await getTeamAccess({
    teamId,
    user: actor,
  });

  if (!canManageTeamTasks(access)) {
    throw createHttpError(403, "Only a team leader or mega leader can create tasks.");
  }

  if (assignedTo) {
    const assignedMember = await TeamMember.findOne({
      team: teamId,
      user: assignedTo,
    });

    if (!assignedMember) {
      throw createHttpError(400, "The selected assignee is not part of this team.");
    }
  }

  return Task.create({
    team: teamId,
    title: title.trim(),
    description: description?.trim() ?? "",
    createdBy: actor._id,
    assignedTo: assignedTo || null,
    dueDate: dueDate || null,
    priority: priority || "medium",
  });
};

export const getTasksForUser = async ({ user, teamId }) => {
  if (!teamId) {
    return Task.find({
      $or: [{ assignedTo: user._id }, { createdBy: user._id }],
    })
      .populate("team", "teamName inviteCode")
      .populate("assignedTo", "fullName email avatarUrl")
      .populate("createdBy", "fullName email avatarUrl")
      .sort({ createdAt: -1 });
  }

  const access = await getTeamAccess({
    teamId,
    user,
  });
  const query = { team: teamId };

  if (!canManageTeamTasks(access)) {
    query.assignedTo = user._id;
  }

  return Task.find(query)
    .populate("team", "teamName inviteCode")
    .populate("assignedTo", "fullName email avatarUrl")
    .populate("createdBy", "fullName email avatarUrl")
    .sort({ createdAt: -1 });
};

export const updateTaskStatus = async ({ user, taskId, status }) => {
  if (!status) {
    throw createHttpError(400, "Task status is required.");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw createHttpError(404, "Task not found.");
  }

  const access = await getTeamAccess({
    teamId: task.team,
    user,
  });
  const isLeader = canManageTeamTasks(access);
  const isAssignee =
    task.assignedTo && task.assignedTo.toString() === user._id.toString();

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
