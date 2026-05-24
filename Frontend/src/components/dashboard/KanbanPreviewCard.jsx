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
    name: "In Review",
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

const getMemberAbbreviation = (name) => {
  if (!name) return "UN";
  const match = name.match(/Member\s+(\d+)\s+of\s+(\w+)/i);
  if (match) {
    return `M${match[1]}${match[2][0].toUpperCase()}`;
  }
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 3);
};

const KanbanPreviewCard = ({
  tasks,
  isLoading,
  selectedTeam,
  updatingTaskId,
  onStatusChange,
  readonly = true,
}) => (
  <section className="rounded-[32px] bg-white p-6 shadow-panel">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
          Board
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Team workflow
        </h2>
      </div>
      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
        Clean board
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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.key);

          return (
            <div key={column.key} className="rounded-[24px] bg-slate-50 p-4 flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  {column.name} ({columnTasks.length})
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${column.accent}`}
                >
                  {columnTasks.length}
                </span>
              </div>

              <div className="column-container">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <article
                      key={task.id}
                      className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm flex-shrink-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-slate-800 text-sm leading-snug">{task.title}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] flex-shrink-0 ${
                            priorityToneMap[task.priority] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                        <span className="font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
                          {getMemberAbbreviation(task.assignedTo?.fullName)}
                        </span>
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>

                      {!readonly && (
                        <div className="mt-4 border-t border-slate-200/60 pt-3">
                          <label className="block">
                            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Update status
                            </span>
                            <select
                              value={task.status}
                              disabled={updatingTaskId === task.id}
                              onChange={(event) => onStatusChange(task.id, event.target.value)}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-teal-400"
                            >
                              {columns.map((statusColumn) => (
                                <option key={statusColumn.key} value={statusColumn.key}>
                                  {statusColumn.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-xs text-slate-400">
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
