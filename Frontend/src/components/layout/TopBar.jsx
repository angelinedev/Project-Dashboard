const TopBar = ({
  memberships,
  selectedTeamId,
  selectedTeam,
  taskCount,
  onSelectTeam,
  onOpenJoinTeam,
  onLogout,
}) => (
  <header className="border-b border-slate-200/70 pb-6">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
          Dashboard
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          {selectedTeam?.teamName || "Project control center"}
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          {selectedTeam
            ? `Invite code ${selectedTeam.inviteCode} | ${selectedTeam.memberCount} collaborators`
            : "Join or create a team to start assigning work and tracking progress."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500">
          {taskCount} tracked tasks
        </div>
        <button
          type="button"
          onClick={onOpenJoinTeam}
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Join Team
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </div>

    <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
      {memberships.length > 0 ? (
        memberships.map((membership) => {
          const isSelected = membership.team?.id === selectedTeamId;

          return (
            <button
              key={membership.id}
              type="button"
              onClick={() => onSelectTeam(membership.team?.id || "")}
              className={`min-w-fit rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isSelected
                  ? "border-teal-300 bg-teal-500 text-slate-950"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {membership.team?.teamName}
            </button>
          );
        })
      ) : (
        <div className="rounded-full border border-dashed border-slate-200 px-4 py-2 text-sm text-slate-400">
          No teams yet
        </div>
      )}
    </div>
  </header>
);

export default TopBar;
