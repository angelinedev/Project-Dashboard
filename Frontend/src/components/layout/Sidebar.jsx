import AvatarBadge from "@/components/common/AvatarBadge.jsx";

const Sidebar = ({
  user,
  activeView,
  sections,
  selectedTeam,
  onChangeView,
  onOpenProfile,
  onOpenJoinTeam,
  onOpenCreateTeam,
}) => (
  <aside className="rounded-[36px] bg-slate-950 p-6 text-white shadow-panel">
    <div>
      <p className="text-sm uppercase tracking-[0.32em] text-teal-200/70">
        Workspace
      </p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight">
        Project Dashboard
      </h1>
      <p className="mt-3 max-w-xs text-sm text-slate-300">
        Multi-team leadership, task assignment, and progress tracking in one
        modular workspace.
      </p>
    </div>

    <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-4">
        <AvatarBadge user={user} size="md" interactive onClick={onOpenProfile} />
        <div>
          <p className="font-semibold">{user?.fullName || "Project member"}</p>
          <p className="text-sm capitalize text-slate-300">
            {(user?.platformRole || "member").replace("_", " ")}
          </p>
        </div>
      </div>
    </div>

    <nav className="mt-8 space-y-3">
      {sections.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChangeView(item.id)}
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
            activeView === item.id
              ? "bg-teal-500 text-slate-950"
              : "bg-white/5 text-slate-100 hover:bg-white/10"
          }`}
        >
          <span className="font-medium">{item.label}</span>
          <span className="text-xs uppercase tracking-[0.2em]">{item.hint}</span>
        </button>
      ))}
    </nav>

    <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-200/70">
        Focus team
      </p>
      <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold">{selectedTeam?.teamName || "No team selected"}</span>
          {selectedTeam?.inviteCode && (
            <span className="text-[11px] uppercase tracking-[0.18em] text-teal-200/70">
              {selectedTeam.inviteCode}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-slate-300">
          {selectedTeam?.description || "Switch teams from the tabs at the top."}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenJoinTeam}
        className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
      >
        Join Team
      </button>

      {user?.platformRole === "mega_leader" && (
        <button
          type="button"
          onClick={onOpenCreateTeam}
          className="mt-3 w-full rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Create Team
        </button>
      )}
    </div>
  </aside>
);

export default Sidebar;
