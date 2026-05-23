const TopBar = ({ selectedTeam, taskCount, onOpenJoinTeam, onLogout }) => (
  <header className="flex flex-col gap-4 border-b border-slate-200/70 pb-6 xl:flex-row xl:items-center xl:justify-between">
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
        Dashboard
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-900">
        {selectedTeam?.teamName || "Project control center"}
      </h2>
      <p className="mt-3 text-sm text-slate-500">
        {selectedTeam
          ? `Invite code ${selectedTeam.inviteCode} • ${selectedTeam.memberCount} collaborators`
          : "Join a team to start collaborating on assigned work."}
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
  </header>
);

export default TopBar;
