import { asyncHandler } from "../../utils/asyncHandler.js";

import { getCurrentUserProfile } from "./users.service.js";

export const getMeController = asyncHandler(async (request, response) => {
  const profile = await getCurrentUserProfile(request.user._id);

  response.status(200).json({
    success: true,
    data: profile,
  });
});
