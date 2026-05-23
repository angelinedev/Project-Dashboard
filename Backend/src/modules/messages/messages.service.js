import { Message } from "../../models/Message.js";
import { TeamMember } from "../../models/TeamMember.js";
import { createHttpError } from "../../utils/createHttpError.js";

const ensureTeamAccess = async (teamId, userId) => {
  const membership = await TeamMember.findOne({ team: teamId, user: userId });

  if (!membership) {
    throw createHttpError(403, "You do not have access to this team chat.");
  }
};

export const getTeamMessages = async ({ userId, teamId }) => {
  await ensureTeamAccess(teamId, userId);

  return Message.find({ team: teamId })
    .populate("sender", "fullName email avatarUrl")
    .sort({ createdAt: 1 });
};

export const sendTeamMessage = async ({ userId, teamId, content }) => {
  if (!content?.trim()) {
    throw createHttpError(400, "Message content is required.");
  }

  await ensureTeamAccess(teamId, userId);

  const message = await Message.create({
    team: teamId,
    sender: userId,
    content: content.trim(),
  });

  return message.populate("sender", "fullName email avatarUrl");
};
