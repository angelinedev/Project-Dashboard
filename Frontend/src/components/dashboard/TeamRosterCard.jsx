import AvatarBadge from "@/components/common/AvatarBadge.jsx";

const TeamRosterCard = ({
  selectedTeam,
  members,
  user,
  onOpenProfile,
}) => (
  <section className="rounded-[30px] bg-slate-950 p-6 text-white shadow-panel">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-200/70">
          Team roster
        </p>
        <h2 className="mt-2 text-2xl font-semibold">
          {selectedTeam?.teamName || "Current team"}
        </h2>
      </div>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100">
        {members.length} members
      </span>
    </div>

    <div className="mt-6 space-y-3">
      {members.length > 0 ? (
        members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <AvatarBadge user={member.user} size="sm" />
              <div>
                <p className="font-medium">{member.user?.fullName}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                  {member.isPrimaryLeader
                    ? "Team leader"
                    : member.user?.platformRole === "mega_leader"
                      ? "Mega leader"
                      : "Member"}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-100">
              {member.role}
            </span>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-8 text-sm text-slate-300">
          No team members loaded yet.
        </div>
      )}
    </div>

    <button
      type="button"
      onClick={onOpenProfile}
      className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
    >
      Edit my profile
    </button>
  </section>
);

export default TeamRosterCard;
