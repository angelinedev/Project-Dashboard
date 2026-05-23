import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { createHttpError } from "../utils/createHttpError.js";

const extractBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice(7).trim();
};

export const requireAuth = async (request, _response, next) => {
  try {
    const token =
      extractBearerToken(request.headers.authorization) || request.cookies?.token;

    if (!token) {
      throw createHttpError(401, "Authentication token is required.");
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub);

    if (!user) {
      throw createHttpError(401, "The authenticated user no longer exists.");
    }

    request.user = user;
    request.auth = decoded;
    next();
  } catch (error) {
    next(
      error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"
        ? createHttpError(401, "Invalid or expired authentication token.")
        : error,
    );
  }
};
