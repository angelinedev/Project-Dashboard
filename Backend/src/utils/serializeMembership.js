export const serializeTeam = (team) => ({
  id: team._id.toString(),
  teamName: team.teamName,
  inviteCode: team.inviteCode,
  leader: team.leader && typeof team.leader === "object" && team.leader._id
    ? {
        id: team.leader._id.toString(),
        fullName: team.leader.fullName,
        email: team.leader.email,
        avatarUrl: team.leader.avatarUrl,
        platformRole: team.leader.platformRole,
      }
    : (team.leader?.toString?.() ?? team.leader),
  createdBy: team.createdBy?.toString?.() ?? team.createdBy,
  memberCount: team.memberCount,
  description: team.description,
  createdAt: team.createdAt,
  updatedAt: team.updatedAt,
});

export const serializeMembership = (membership) => ({
  id: membership._id.toString(),
  role: membership.role,
  joinedAt: membership.joinedAt,
  team: membership.team ? serializeTeam(membership.team) : null,
});

export const serializeMembershipCollection = (memberships) =>
  memberships.map(serializeMembership);

export const serializeTeamAccessCollection = (teams, role = "mega_leader") =>
  teams.map((team) => ({
    id: `team-access-${team._id.toString()}`,
    role,
    joinedAt: team.createdAt,
    team: serializeTeam(team),
  }));
