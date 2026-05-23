import { TeamMember } from "../models/TeamMember.js";
import { User } from "../models/User.js";
import { createHttpError } from "./createHttpError.js";

export const PLATFORM_ROLE = {
  MEGA_LEADER: "mega_leader",
  MEMBER: "member",
};

export const TEAM_ROLE = {
  LEADER: "leader",
  MEMBER: "member",
};

export const isMegaLeader = (user) => user?.platformRole === PLATFORM_ROLE.MEGA_LEADER;

export const ensurePlatformRole = async (user) => {
  if (!user) {
    return null;
  }

  if (user.platformRole) {
    return user;
  }

  const megaLeaderCount = await User.countDocuments({
    platformRole: PLATFORM_ROLE.MEGA_LEADER,
  });

  user.platformRole =
    megaLeaderCount === 0 ? PLATFORM_ROLE.MEGA_LEADER : PLATFORM_ROLE.MEMBER;
  await user.save({ validateBeforeSave: false });

  return user;
};

export const getTeamMembership = ({ teamId, userId }) =>
  TeamMember.findOne({
    team: teamId,
    user: userId,
  });

export const getTeamAccess = async ({ teamId, user, allowMegaLeader = true }) => {
  if (allowMegaLeader && isMegaLeader(user)) {
    return {
      role: PLATFORM_ROLE.MEGA_LEADER,
      membership: null,
    };
  }

  const membership = await getTeamMembership({
    teamId,
    userId: user._id ?? user,
  });

  if (!membership) {
    throw createHttpError(403, "You do not have access to this team.");
  }

  return {
    role: membership.role,
    membership,
  };
};

export const canManageTeamTasks = (access) =>
  access?.role === PLATFORM_ROLE.MEGA_LEADER || access?.role === TEAM_ROLE.LEADER;
