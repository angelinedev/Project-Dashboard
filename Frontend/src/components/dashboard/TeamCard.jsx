import AvatarBadge from "@/components/common/AvatarBadge.jsx";

const TeamCard = ({ team, taskStats, progress }) => {
  const leaderUser = team.leader;

  return (
    <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-panel transition-all hover:shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{team.teamName}</h3>
            {team.inviteCode && (
              <span className="mt-1.5 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Code: {team.inviteCode}
              </span>
            )}
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            {team.memberCount === 1 ? "1 member" : `${team.memberCount} members`}
          </span>
        </div>

        <p className="mt-4 text-sm text-slate-500 line-clamp-2">
          {team.description || "No description provided for this team."}
        </p>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <AvatarBadge
            user={leaderUser ? { ...leaderUser } : null}
            size="sm"
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Team Leader
            </p>
            <p className="text-sm font-medium text-slate-800">
              {leaderUser ? leaderUser.fullName : "Unassigned"}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Aggregated Progress</span>
            <span>{progress}% ({taskStats?.done || 0}/{taskStats?.total || 0} done)</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
