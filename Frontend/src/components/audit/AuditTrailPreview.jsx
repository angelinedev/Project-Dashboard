const entries = [
  "Design system moved to Review",
  "Marketing page moved to In Progress",
  "Sprint retrospective moved to Done",
];

const AuditTrailPreview = () => (
  <section className="rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-200/70">
          Activity
        </p>
        <h2 className="mt-2 text-xl font-semibold">Audit trail</h2>
      </div>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100">
        Live feed
      </span>
    </div>

    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div
          key={entry}
          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-300" />
          <div>
            <p className="font-medium">{entry}</p>
            <p className="mt-1 text-sm text-slate-300">
              Auto-log entry #{index + 1} will be backed by MongoDB in Step 2.
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AuditTrailPreview;
