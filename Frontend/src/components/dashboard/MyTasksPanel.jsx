const priorityToneMap = {
  low: "bg-sky-50 text-sky-600 border-sky-100",
  medium: "bg-emerald-50 text-emerald-600 border-emerald-100",
  high: "bg-amber-50 text-amber-600 border-amber-100",
  urgent: "bg-rose-50 text-rose-600 border-rose-100",
};

const formatDueDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
      }).format(new Date(value))
    : "No due date";

const MyTasksPanel = ({ tasks, userId, updatingTaskId, onStatusChange }) => {
  const myTasks = tasks.filter((task) => task.assignedTo?.id === userId);

  return (
    <section className="rounded-[30px] bg-white p-6 border border-slate-100 shadow-panel flex flex-col h-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Workplace
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">My Personal Tasks</h2>
          <p className="text-xs text-slate-500 mt-1">
            Focus list of tasks explicitly assigned to you
          </p>
        </div>
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700">
          {myTasks.length} left
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 max-h-[70vh] pr-2">
        {myTasks.length > 0 ? (
          myTasks.map((task) => (
            <article
              key={task.id}
              className="rounded-[24px] border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-slate-100/50"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-semibold text-slate-800 text-sm leading-snug">{task.title}</h4>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${
                    priorityToneMap[task.priority] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              {task.description && (
                <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Due: {formatDueDate(task.dueDate)}</span>
                <span className="capitalize">Status: {task.status.replace("_", " ")}</span>
              </div>

              <div className="mt-4 border-t border-slate-200/60 pt-3">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Status Update
                  </span>
                  <select
                    value={task.status}
                    disabled={updatingTaskId === task.id}
                    onChange={(event) => onStatusChange(task.id, event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-teal-400"
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </label>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">
            No personal tasks assigned. Good job!
          </div>
        )}
      </div>
    </section>
  );
};

export default MyTasksPanel;
