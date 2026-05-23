import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { env } from "../../config/env.js";
import { Team } from "../../models/Team.js";
import { TeamMember } from "../../models/TeamMember.js";
import { User } from "../../models/User.js";
import { createHttpError } from "../../utils/createHttpError.js";
import { serializeMembershipCollection } from "../../utils/serializeMembership.js";

const normalizeEmail = (email) => email.trim().toLowerCase();
const normalizeInviteCode = (inviteCode) => inviteCode.trim().toUpperCase();

const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );

const loadUserMemberships = async (userId, session = null) =>
  TeamMember.find({ user: userId })
    .populate({
      path: "team",
      select: "teamName inviteCode leader memberCount description createdAt updatedAt",
    })
    .session(session)
    .sort({ joinedAt: -1 });

const buildAuthPayload = async (user, session = null) => {
  const memberships = await loadUserMemberships(user._id, session);

  return {
    token: signAccessToken(user),
    user: user.toSafeObject(),
    memberships: serializeMembershipCollection(memberships),
  };
};

export const registerUser = async ({ fullName, email, password, inviteCode }) => {
  if (!fullName?.trim()) {
    throw createHttpError(400, "Full name is required.");
  }

  if (!email?.trim() || !password?.trim()) {
    throw createHttpError(400, "Email and password are required.");
  }

  const normalizedEmail = normalizeEmail(email);
  const normalizedInviteCode = inviteCode?.trim()
    ? normalizeInviteCode(inviteCode)
    : null;

  const session = await mongoose.startSession();
  let authPayload;

  try {
    await session.withTransaction(async () => {
      const existingUser = await User.findOne({ email: normalizedEmail }).session(session);

      if (existingUser) {
        throw createHttpError(409, "An account with this email already exists.");
      }

      let team = null;

      if (normalizedInviteCode) {
        team = await Team.findOne({ inviteCode: normalizedInviteCode }).session(session);

        if (!team) {
          throw createHttpError(404, "The invitation code is invalid or expired.");
        }
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const [user] = await User.create(
        [
          {
            fullName: fullName.trim(),
            email: normalizedEmail,
            passwordHash,
          },
        ],
        { session },
      );

      if (team) {
        await TeamMember.create(
          [
            {
              team: team._id,
              user: user._id,
              role: "member",
            },
          ],
          { session },
        );

        await Team.findByIdAndUpdate(team._id, { $inc: { memberCount: 1 } }, { session });
      }

      authPayload = await buildAuthPayload(user, session);
    });
  } finally {
    await session.endSession();
  }

  return authPayload;
};

export const loginUser = async ({ email, password }) => {
  if (!email?.trim() || !password?.trim()) {
    throw createHttpError(400, "Email and password are required.");
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

  if (!user) {
    throw createHttpError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password.");
  }

  return buildAuthPayload(user);
};

export const joinTeamByCode = async ({ userId, inviteCode }) => {
  if (!inviteCode?.trim()) {
    throw createHttpError(400, "Invitation code is required.");
  }

  const normalizedInviteCode = normalizeInviteCode(inviteCode);
  const session = await mongoose.startSession();
  let membershipPayload;

  try {
    await session.withTransaction(async () => {
      const team = await Team.findOne({ inviteCode: normalizedInviteCode }).session(session);

      if (!team) {
        throw createHttpError(404, "The invitation code is invalid or expired.");
      }

      const existingMembership = await TeamMember.findOne({
        team: team._id,
        user: userId,
      }).session(session);

      if (existingMembership) {
        throw createHttpError(409, "You are already a member of this team.");
      }

      await TeamMember.create(
        [
          {
            team: team._id,
            user: userId,
            role: "member",
          },
        ],
        { session },
      );

      await Team.findOneAndUpdate(
        { _id: team._id },
        { $inc: { memberCount: 1 } },
        { new: true, session },
      );

      const user = await User.findById(userId).session(session);
      membershipPayload = await buildAuthPayload(user, session);
    });
  } finally {
    await session.endSession();
  }

  return membershipPayload;
};
