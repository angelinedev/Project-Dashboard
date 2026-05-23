import { dashboardSections } from "@/utils/navigation.js";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const Sidebar = ({ user, memberships, selectedTeamId, onSelectTeam, onOpenJoinTeam }) => (
  <aside className="rounded-[36px] bg-slate-950 p-6 text-white shadow-panel">
    <div>
      <p className="text-sm uppercase tracking-[0.32em] text-teal-200/70">
        Workspace
      </p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight">
        Project Dashboard
      </h1>
      <p className="mt-3 max-w-xs text-sm text-slate-300">
        Protected team operations, assignment tracking, and collaboration in a
        single MERN workspace.
      </p>
    </div>

    <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500 font-semibold text-slate-950">
          {getInitials(user?.fullName || "PD")}
        </div>
        <div>
          <p className="font-semibold">{user?.fullName || "Project member"}</p>
          <p className="text-sm text-slate-300">{user?.email || "No email loaded"}</p>
        </div>
      </div>
    </div>

    <nav className="mt-8 space-y-3">
      {dashboardSections.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-left"
        >
          <span className="font-medium text-slate-100">{item.label}</span>
          <span className="text-xs uppercase tracking-[0.2em] text-teal-200/70">
            {item.hint}
          </span>
        </div>
      ))}
    </nav>

    <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-200/70">
        Teams
      </p>
      <div className="mt-4 space-y-3">
        {memberships.length > 0 ? (
          memberships.map((membership) => {
            const isSelected = membership.team?.id === selectedTeamId;

            return (
              <button
                key={membership.id}
                type="button"
                onClick={() => onSelectTeam(membership.team?.id || "")}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                  isSelected
                    ? "border-teal-300 bg-teal-500 text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{membership.team?.teamName || "Unknown team"}</span>
                  <span className="text-[11px] uppercase tracking-[0.18em]">
                    {membership.role}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    isSelected ? "text-slate-900/80" : "text-slate-300"
                  }`}
                >
                  Invite code: {membership.team?.inviteCode || "N/A"}
                </p>
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-4 py-5 text-sm text-slate-300">
            No team memberships yet. Join with an invitation code to unlock the
            live board.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenJoinTeam}
        className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
      >
        Join Team
      </button>
    </div>
  </aside>
);

export default Sidebar;
