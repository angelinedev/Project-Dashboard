import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  getCurrentUserProfile,
  getUsersDirectory,
  updateCurrentUserProfile,
} from "./users.service.js";

export const getMeController = asyncHandler(async (request, response) => {
  const profile = await getCurrentUserProfile(request.user);

  response.status(200).json({
    success: true,
    data: profile,
  });
});

export const updateMeController = asyncHandler(async (request, response) => {
  const user = await updateCurrentUserProfile({
    userId: request.user._id,
    fullName: request.body.fullName,
    avatarUrl: request.body.avatarUrl,
  });

  response.status(200).json({
    success: true,
    data: user,
  });
});

export const getUsersDirectoryController = asyncHandler(async (request, response) => {
  const users = await getUsersDirectory(request.user);

  response.status(200).json({
    success: true,
    data: users,
  });
});
