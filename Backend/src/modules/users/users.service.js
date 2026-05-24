import { Team } from "../../models/Team.js";
import { TeamMember } from "../../models/TeamMember.js";
import { User } from "../../models/User.js";
import { PLATFORM_ROLE, isMegaLeader } from "../../utils/accessControl.js";
import { createHttpError } from "../../utils/createHttpError.js";
import {
  serializeMembershipCollection,
  serializeTeamAccessCollection,
} from "../../utils/serializeMembership.js";

export const getCurrentUserProfile = async (currentUser) => {
  const user = await User.findById(currentUser._id);

  if (!user) {
    throw createHttpError(404, "User not found.");
  }

  let memberships = [];

  if (isMegaLeader(user)) {
    const teams = await Team.find().sort({ createdAt: -1 });
    memberships = serializeTeamAccessCollection(teams, PLATFORM_ROLE.MEGA_LEADER);
  } else {
    const teamMemberships = await TeamMember.find({ user: currentUser._id })
      .populate({
        path: "team",
        select:
          "teamName inviteCode leader createdBy memberCount description createdAt updatedAt",
      })
      .sort({ joinedAt: -1 });

    memberships = serializeMembershipCollection(teamMemberships);
  }

  return {
    user: user.toSafeObject(),
    memberships,
  };
};

export const updateCurrentUserProfile = async ({ userId, fullName, avatarUrl }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, "User not found.");
  }

  if (fullName?.trim()) {
    user.fullName = fullName.trim();
  }

  if (typeof avatarUrl === "string") {
    user.avatarUrl = avatarUrl.trim();
  }

  await user.save();
  return user.toSafeObject();
};

export const getUsersDirectory = async (currentUser) => {
  if (!isMegaLeader(currentUser)) {
    throw createHttpError(403, "Only the mega leader can view the user directory.");
  }

  const users = await User.find().sort({ fullName: 1, createdAt: 1 });
  return users.map((user) => user.toSafeObject());
};
