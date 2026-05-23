import mongoose from "mongoose";

import { Team } from "../../models/Team.js";
import { TeamMember } from "../../models/TeamMember.js";
import { createHttpError } from "../../utils/createHttpError.js";
import { generateInviteCode } from "../../utils/generateInviteCode.js";

const ensureUniqueInviteCode = async (session) => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const inviteCode = generateInviteCode();
    const existingTeam = await Team.findOne({ inviteCode }).session(session);

    if (!existingTeam) {
      return inviteCode;
    }
  }

  throw createHttpError(500, "Unable to generate a unique invitation code.");
};

export const createTeam = async ({ userId, teamName, description }) => {
  if (!teamName?.trim()) {
    throw createHttpError(400, "Team name is required.");
  }

  const session = await mongoose.startSession();
  let createdTeam;

  try {
    await session.withTransaction(async () => {
      const inviteCode = await ensureUniqueInviteCode(session);

      const [team] = await Team.create(
        [
          {
            teamName: teamName.trim(),
            description: description?.trim() ?? "",
            inviteCode,
            leader: userId,
          },
        ],
        { session },
      );

      await TeamMember.create(
        [
          {
            team: team._id,
            user: userId,
            role: "leader",
          },
        ],
        { session },
      );

      createdTeam = team;
    });
  } finally {
    await session.endSession();
  }

  return createdTeam;
};

export const getTeamsForUser = async (userId) => {
  const memberships = await TeamMember.find({ user: userId })
    .populate({
      path: "team",
      select: "teamName inviteCode leader memberCount description createdAt updatedAt",
    })
    .sort({ joinedAt: -1 });

  return memberships.map((membership) => ({
    id: membership._id.toString(),
    role: membership.role,
    joinedAt: membership.joinedAt,
    team: membership.team,
  }));
};

export const getTeamMembers = async ({ userId, teamId }) => {
  const membership = await TeamMember.findOne({ team: teamId, user: userId });

  if (!membership) {
    throw createHttpError(403, "You do not have access to this team.");
  }

  return TeamMember.find({ team: teamId })
    .populate({
      path: "user",
      select: "fullName email avatarUrl createdAt updatedAt",
    })
    .sort({ joinedAt: 1 });
};
