const priorityRows = [
  { label: "Critical", count: 4, tone: "bg-rose-500" },
  { label: "High", count: 7, tone: "bg-amber-400" },
  { label: "Medium", count: 12, tone: "bg-emerald-400" },
  { label: "Low", count: 6, tone: "bg-sky-400" },
];

const PriorityHeatmapCard = () => (
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
        Recharts next
      </span>
    </div>

    <div className="space-y-4">
      {priorityRows.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <span>{item.label}</span>
            <span>{item.count} tasks</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${item.tone}`}
              style={{ width: `${item.count * 7}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default PriorityHeatmapCard;
