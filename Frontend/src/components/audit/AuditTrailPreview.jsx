const formatRelativeDate = (value) => {
  if (!value) {
    return "No recent updates";
  }

  const deltaHours = Math.max(
    1,
    Math.round((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60)),
  );

  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  return `${Math.round(deltaHours / 24)}d ago`;
};

const AuditTrailPreview = ({ tasks, selectedTeam }) => {
  const entries = [...tasks]
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
    .slice(0, 4);

  return (
  <section className="rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-200/70">
          Activity
        </p>
          <h2 className="mt-2 text-xl font-semibold">Team pulse</h2>
      </div>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100">
          {selectedTeam ? selectedTeam.inviteCode : "No team"}
      </span>
    </div>

    <div className="space-y-4">
        {entries.length > 0 ? (
          entries.map((task) => (
        <div
              key={task.id}
          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-300" />
          <div>
                <p className="font-medium">
                  {task.title} is currently in {task.status.replace("_", " ")}
                </p>
            <p className="mt-1 text-sm text-slate-300">
                  Updated {formatRelativeDate(task.updatedAt)} by{" "}
                  {task.assignedTo?.fullName || task.createdBy?.fullName || "the team"}.
            </p>
          </div>
        </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-8 text-sm text-slate-300">
            Join a team or create a few tasks to light up the collaboration feed.
          </div>
        )}
    </div>
  </section>
  );
};

export default AuditTrailPreview;
