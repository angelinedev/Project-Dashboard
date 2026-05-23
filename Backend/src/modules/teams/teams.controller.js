import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  createTeam,
  getTeamMembers,
  getTeamsForUser,
  updateTeamLeader,
} from "./teams.service.js";

export const createTeamController = asyncHandler(async (request, response) => {
  const team = await createTeam({
    actor: request.user,
    teamName: request.body.teamName,
    description: request.body.description,
    leaderId: request.body.leaderId,
  });

  response.status(201).json({
    success: true,
    data: team,
  });
});

export const getMyTeamsController = asyncHandler(async (request, response) => {
  const teams = await getTeamsForUser(request.user);

  response.status(200).json({
    success: true,
    data: teams,
  });
});

export const getTeamMembersController = asyncHandler(async (request, response) => {
  const members = await getTeamMembers({
    viewer: request.user,
    teamId: request.params.teamId,
  });

  response.status(200).json({
    success: true,
    data: members,
  });
});

export const updateTeamLeaderController = asyncHandler(async (request, response) => {
  const team = await updateTeamLeader({
    actor: request.user,
    teamId: request.params.teamId,
    leaderUserId: request.body.leaderUserId,
  });

  response.status(200).json({
    success: true,
    data: team,
  });
});
