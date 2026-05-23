import { asyncHandler } from "../../utils/asyncHandler.js";

import { getTeamMessages, sendTeamMessage } from "./messages.service.js";

export const getMessagesController = asyncHandler(async (request, response) => {
  const messages = await getTeamMessages({
    userId: request.user._id,
    teamId: request.params.teamId,
  });

  response.status(200).json({
    success: true,
    data: messages,
  });
});

export const sendMessageController = asyncHandler(async (request, response) => {
  const message = await sendTeamMessage({
    userId: request.user._id,
    teamId: request.params.teamId,
    content: request.body.content,
  });

  response.status(201).json({
    success: true,
    data: message,
  });
});
