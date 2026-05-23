import { TeamMember } from "../../models/TeamMember.js";
import { User } from "../../models/User.js";
import { createHttpError } from "../../utils/createHttpError.js";
import { serializeMembershipCollection } from "../../utils/serializeMembership.js";

export const getCurrentUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, "User not found.");
  }

  const memberships = await TeamMember.find({ user: userId })
    .populate({
      path: "team",
      select: "teamName inviteCode leader memberCount description createdAt updatedAt",
    })
    .sort({ joinedAt: -1 });

  return {
    user: user.toSafeObject(),
    memberships: serializeMembershipCollection(memberships),
  };
};
