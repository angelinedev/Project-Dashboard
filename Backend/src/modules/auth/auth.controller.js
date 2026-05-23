import { asyncHandler } from "../../utils/asyncHandler.js";
import { env } from "../../config/env.js";

import { joinTeamByCode, loginUser, registerUser } from "./auth.service.js";

const writeAuthResponse = (response, statusCode, payload) => {
  response
    .status(statusCode)
    .cookie("token", payload.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.nodeEnv === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      data: payload,
    });
};

export const register = asyncHandler(async (request, response) => {
  const payload = await registerUser(request.body);
  writeAuthResponse(response, 201, payload);
});

export const login = asyncHandler(async (request, response) => {
  const payload = await loginUser(request.body);
  writeAuthResponse(response, 200, payload);
});

export const joinTeam = asyncHandler(async (request, response) => {
  const payload = await joinTeamByCode({
    userId: request.user._id,
    inviteCode: request.body.inviteCode,
  });

  writeAuthResponse(response, 200, payload);
});
