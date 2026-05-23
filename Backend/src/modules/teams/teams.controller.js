import { asyncHandler } from "../../utils/asyncHandler.js";

import { createTeam, getTeamMembers, getTeamsForUser } from "./teams.service.js";

export const createTeamController = asyncHandler(async (request, response) => {
  const team = await createTeam({
    userId: request.user._id,
    teamName: request.body.teamName,
    description: request.body.description,
  });

  response.status(201).json({
    success: true,
    data: team,
  });
});

export const getMyTeamsController = asyncHandler(async (request, response) => {
  const teams = await getTeamsForUser(request.user._id);

  response.status(200).json({
    success: true,
    data: teams,
  });
});

export const getTeamMembersController = asyncHandler(async (request, response) => {
  const members = await getTeamMembers({
    userId: request.user._id,
    teamId: request.params.teamId,
  });

  response.status(200).json({
    success: true,
    data: members,
  });
});
