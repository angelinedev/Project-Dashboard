import mongoose from "mongoose";

import { Team } from "../../models/Team.js";
import { TeamMember } from "../../models/TeamMember.js";
import { User } from "../../models/User.js";
import { Task } from "../../models/Task.js";
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

      if (assignedLeader.platformRole === "member") {
        assignedLeader.platformRole = "team_leader";
        await assignedLeader.save({ session });
      }

      createdTeam = await Team.findById(team._id).session(session);
    });
  } finally {
    await session.endSession();
  }

  return createdTeam;
};

export const getTeamsForUser = async (currentUser) => {
  if (isMegaLeader(currentUser)) {
    const teams = await Team.find().populate("leader", "fullName email avatarUrl platformRole").sort({ createdAt: -1 });
    return serializeTeamAccessCollection(teams, PLATFORM_ROLE.MEGA_LEADER);
  }

  const memberships = await TeamMember.find({ user: currentUser._id })
    .populate({
      path: "team",
      populate: {
        path: "leader",
        select: "fullName email avatarUrl platformRole",
      },
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

      const oldLeaderId = team.leader;

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

      // Demote old leader if they don't lead any other teams and are not mega_leader
      if (oldLeaderId && oldLeaderId.toString() !== nextLeader._id.toString()) {
        const otherTeamsLedCount = await Team.countDocuments({
          leader: oldLeaderId,
          _id: { $ne: team._id },
        }).session(session);

        if (otherTeamsLedCount === 0) {
          const oldLeaderUser = await User.findById(oldLeaderId).session(session);
          if (oldLeaderUser && oldLeaderUser.platformRole === "team_leader") {
            oldLeaderUser.platformRole = "member";
            await oldLeaderUser.save({ session });
          }
        }
      }

      // Upgrade new leader to team_leader if they are currently a member
      if (nextLeader.platformRole === "member") {
        nextLeader.platformRole = "team_leader";
        await nextLeader.save({ session });
      }

      updatedTeam = team;
    });
  } finally {
    await session.endSession();
  }

  return updatedTeam;
};

export const getTeamsAnalytics = async (actor) => {
  if (!isMegaLeader(actor)) {
    throw createHttpError(403, "Only the mega leader can view analytics.");
  }

  const teams = await Team.find().populate("leader", "fullName email avatarUrl platformRole");
  const analytics = [];

  for (const team of teams) {
    const tasks = await Task.find({ team: team._id });
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const review = tasks.filter((t) => t.status === "review").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;

    analytics.push({
      team: {
        id: team._id.toString(),
        teamName: team.teamName,
        inviteCode: team.inviteCode,
        description: team.description,
        memberCount: team.memberCount,
        leader: team.leader
          ? {
              id: team.leader._id.toString(),
              fullName: team.leader.fullName,
              email: team.leader.email,
              avatarUrl: team.leader.avatarUrl,
              platformRole: team.leader.platformRole,
            }
          : null,
      },
      taskStats: {
        total,
        done,
        review,
        inProgress,
        todo,
      },
      progress: total > 0 ? Math.round((done / total) * 100) : 0,
    });
  }

  return analytics;
};
