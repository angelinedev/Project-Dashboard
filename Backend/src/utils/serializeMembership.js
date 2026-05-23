export const serializeMembership = (membership) => ({
  id: membership._id.toString(),
  role: membership.role,
  joinedAt: membership.joinedAt,
  team: membership.team
    ? {
        id: membership.team._id.toString(),
        teamName: membership.team.teamName,
        inviteCode: membership.team.inviteCode,
        leader: membership.team.leader,
        memberCount: membership.team.memberCount,
        description: membership.team.description,
        createdAt: membership.team.createdAt,
        updatedAt: membership.team.updatedAt,
      }
    : null,
});

export const serializeMembershipCollection = (memberships) =>
  memberships.map(serializeMembership);
