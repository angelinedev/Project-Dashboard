const priorityConfig = [
  { key: "urgent", label: "Urgent", tone: "bg-rose-500" },
  { key: "high", label: "High", tone: "bg-amber-400" },
  { key: "medium", label: "Medium", tone: "bg-emerald-400" },
  { key: "low", label: "Low", tone: "bg-sky-400" },
];

const PriorityHeatmapCard = ({ tasks }) => {
  const highestCount = Math.max(
    1,
    ...priorityConfig.map(
      (item) => tasks.filter((task) => task.priority === item.key).length,
    ),
  );

  return (
  <section className="rounded-[28px] bg-white p-6 shadow-panel">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
          Analytics
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          Priority heatmap
        </h2>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
        Live distribution
      </span>
    </div>

    <div className="space-y-4">
        {priorityConfig.map((item) => {
          const count = tasks.filter((task) => task.priority === item.key).length;
          const width = `${Math.max(12, (count / highestCount) * 100)}%`;

          return (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <span>{item.label}</span>
                <span>{count} tasks</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${item.tone}`}
                  style={{ width: count > 0 ? width : "0%" }}
            />
          </div>
        </div>
          );
        })}
    </div>
  </section>
  );
};

export default PriorityHeatmapCard;
