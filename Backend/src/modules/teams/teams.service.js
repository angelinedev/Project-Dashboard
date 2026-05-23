import mongoose from "mongoose";

import { Team } from "../../models/Team.js";
import { TeamMember } from "../../models/TeamMember.js";
import { User } from "../../models/User.js";
import {
  PLATFORM_ROLE,
  TEAM_ROLE,
  getTeamAccess,
  isMegaLeader,
} from "../../utils/accessControl.js";
import { createHttpError } from "../../utils/createHttpError.js";
import { generateInviteCode } from "../../utils/generateInviteCode.js";
import {
  serializeMembershipCollection,
  serializeTeamAccessCollection,
} from "../../utils/serializeMembership.js";

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

export const createTeam = async ({ actor, teamName, description, leaderId }) => {
  if (!teamName?.trim()) {
    throw createHttpError(400, "Team name is required.");
  }

  if (!isMegaLeader(actor)) {
    throw createHttpError(403, "Only the mega leader can create new teams.");
  }

  const session = await mongoose.startSession();
  let createdTeam;

  try {
    await session.withTransaction(async () => {
      const inviteCode = await ensureUniqueInviteCode(session);
      const assignedLeaderId = leaderId || actor._id.toString();
      const assignedLeader = await User.findById(assignedLeaderId).session(session);

      if (!assignedLeader) {
        throw createHttpError(404, "The selected team leader was not found.");
      }

      const [team] = await Team.create(
        [
          {
            teamName: teamName.trim(),
            description: description?.trim() ?? "",
            inviteCode,
            leader: assignedLeader._id,
            createdBy: actor._id,
          },
        ],
        { session },
      );

      await TeamMember.create(
        [
          {
            team: team._id,
            user: assignedLeader._id,
            role: TEAM_ROLE.LEADER,
          },
        ],
        { session },
      );

      createdTeam = await Team.findById(team._id).session(session);
    });
  } finally {
    await session.endSession();
  }

  return createdTeam;
};

export const getTeamsForUser = async (currentUser) => {
  if (isMegaLeader(currentUser)) {
    const teams = await Team.find().sort({ createdAt: -1 });
    return serializeTeamAccessCollection(teams, PLATFORM_ROLE.MEGA_LEADER);
  }

  const memberships = await TeamMember.find({ user: currentUser._id })
    .populate({
      path: "team",
      select:
        "teamName inviteCode leader createdBy memberCount description createdAt updatedAt",
    })
    .sort({ joinedAt: -1 });

  return serializeMembershipCollection(memberships);
};

export const getTeamMembers = async ({ viewer, teamId }) => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw createHttpError(404, "Team not found.");
  }

  await getTeamAccess({
    teamId,
    user: viewer,
  });

  const members = await TeamMember.find({ team: teamId })
    .populate({
      path: "user",
      select: "fullName email avatarUrl platformRole createdAt updatedAt",
    })
    .sort({ joinedAt: 1 });

  return members.map((member) => ({
    id: member._id.toString(),
    role: member.role,
    joinedAt: member.joinedAt,
    isPrimaryLeader: team.leader?.toString() === member.user?._id?.toString(),
    user: member.user
      ? {
          id: member.user._id.toString(),
          fullName: member.user.fullName,
          email: member.user.email,
          avatarUrl: member.user.avatarUrl,
          platformRole: member.user.platformRole || PLATFORM_ROLE.MEMBER,
        }
      : null,
  }));
};

export const updateTeamLeader = async ({ actor, teamId, leaderUserId }) => {
  if (!isMegaLeader(actor)) {
    throw createHttpError(403, "Only the mega leader can assign team leaders.");
  }

  const session = await mongoose.startSession();
  let updatedTeam;

  try {
    await session.withTransaction(async () => {
      const team = await Team.findById(teamId).session(session);

      if (!team) {
        throw createHttpError(404, "Team not found.");
      }

      const nextLeader = await User.findById(leaderUserId).session(session);

      if (!nextLeader) {
        throw createHttpError(404, "The selected leader was not found.");
      }

      await TeamMember.updateMany(
        {
          team: team._id,
          role: TEAM_ROLE.LEADER,
        },
        {
          role: TEAM_ROLE.MEMBER,
        },
        { session },
      );

      const existingMembership = await TeamMember.findOne({
        team: team._id,
        user: nextLeader._id,
      }).session(session);

      if (existingMembership) {
        existingMembership.role = TEAM_ROLE.LEADER;
        await existingMembership.save({ session });
      } else {
        await TeamMember.create(
          [
            {
              team: team._id,
              user: nextLeader._id,
              role: TEAM_ROLE.LEADER,
            },
          ],
          { session },
        );

        team.memberCount += 1;
      }

      team.leader = nextLeader._id;
      await team.save({ session });

      updatedTeam = team;
    });
  } finally {
    await session.endSession();
  }

  return updatedTeam;
};
