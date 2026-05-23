const columns = [
  {
    key: "todo",
    name: "Todo",
    accent: "bg-sky-100 text-sky-700",
  },
  {
    key: "in_progress",
    name: "In Progress",
    accent: "bg-amber-100 text-amber-700",
  },
  {
    key: "review",
    name: "Review",
    accent: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    key: "done",
    name: "Done",
    accent: "bg-emerald-100 text-emerald-700",
  },
];

const priorityToneMap = {
  low: "bg-sky-100 text-sky-700",
  medium: "bg-emerald-100 text-emerald-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-rose-100 text-rose-700",
};

const formatDueDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
      }).format(new Date(value))
    : "No due date";

const KanbanPreviewCard = ({
  tasks,
  isLoading,
  selectedTeam,
  updatingTaskId,
  onStatusChange,
}) => (
  <section className="rounded-[32px] bg-white p-6 shadow-panel">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
          Board
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Live Kanban workflow
        </h2>
      </div>
      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
        MongoDB connected
      </span>
    </div>

    <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
        {selectedTeam ? `Team: ${selectedTeam.teamName}` : "My assigned tasks"}
      </span>
      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
        {tasks.length} visible cards
      </span>
    </div>

    {isLoading ? (
      <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-500">
        Loading task board...
      </div>
    ) : (
      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.key);

          return (
            <div key={column.name} className="rounded-[24px] bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">{column.name}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${column.accent}`}>
                  {columnTasks.length} cards
            </span>
          </div>

          <div className="space-y-3">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
              <article
                      key={task.id}
                className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm"
              >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-slate-800">{task.title}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                            priorityToneMap[task.priority] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                <p className="mt-2 text-sm text-slate-500">
                        {task.description || "No description added yet."}
                </p>
                      <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                        <span>{task.assignedTo?.fullName || "Unassigned"}</span>
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>
                      <label className="mt-4 block">
                        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Move card
                        </span>
                        <select
                          value={task.status}
                          disabled={updatingTaskId === task.id}
                          onChange={(event) => onStatusChange(task.id, event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-teal-400"
                        >
                          {columns.map((statusColumn) => (
                            <option key={statusColumn.key} value={statusColumn.key}>
                              {statusColumn.name}
                            </option>
                          ))}
                        </select>
                      </label>
              </article>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-400">
                    No tasks in {column.name.toLowerCase()}.
                  </div>
                )}
          </div>
        </div>
          );
        })}
      </div>
    )}
  </section>
);

export default KanbanPreviewCard;
