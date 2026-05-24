import AvatarBadge from "@/components/common/AvatarBadge.jsx";

const MemberManagementPanel = ({ members, tasks }) => {
  return (
    <section className="rounded-[30px] bg-white p-6 border border-slate-100 shadow-panel flex flex-col h-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Management
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Members Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review workload and task assignments for team members
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 max-h-[70vh] pr-2">
        {members.map((member) => {
          const memberTasks = tasks.filter(
            (task) => task.assignedTo?.id === member.user?.id
          );
          const todoCount = memberTasks.filter((t) => t.status === "todo").length;
          const progressCount = memberTasks.filter((t) => t.status === "in_progress").length;
          const reviewCount = memberTasks.filter((t) => t.status === "review").length;
          const doneCount = memberTasks.filter((t) => t.status === "done").length;

          return (
            <div
              key={member.id}
              className="rounded-[24px] border border-slate-100 bg-slate-50 p-5 transition-all hover:bg-slate-50/80"
            >
              <div className="flex items-center gap-3">
                <AvatarBadge user={member.user} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900 truncate">
                      {member.user?.fullName}
                    </p>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 border border-slate-100 flex-shrink-0">
                      {member.isPrimaryLeader ? "Leader" : member.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{member.user?.email}</p>
                </div>
              </div>

              {/* Status Counters */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl bg-sky-50/50 p-2 border border-sky-100/50">
                  <p className="font-bold text-sky-700">{todoCount}</p>
                  <p className="text-[10px] text-sky-600 font-medium mt-0.5">Todo</p>
                </div>
                <div className="rounded-xl bg-amber-50/50 p-2 border border-amber-100/50">
                  <p className="font-bold text-amber-700">{progressCount}</p>
                  <p className="text-[10px] text-amber-600 font-medium mt-0.5">Active</p>
                </div>
                <div className="rounded-xl bg-fuchsia-50/50 p-2 border border-fuchsia-100/50">
                  <p className="font-bold text-fuchsia-700">{reviewCount}</p>
                  <p className="text-[10px] text-fuchsia-600 font-medium mt-0.5">Review</p>
                </div>
                <div className="rounded-xl bg-emerald-50/50 p-2 border border-emerald-100/50">
                  <p className="font-bold text-emerald-700">{doneCount}</p>
                  <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Done</p>
                </div>
              </div>

              {/* Task list for this user */}
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-2">
                  Assigned Work ({memberTasks.length})
                </p>
                {memberTasks.length > 0 ? (
                  <ul className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {memberTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between gap-3 text-xs bg-white border border-slate-100 rounded-lg p-2 text-slate-600"
                      >
                        <span className="truncate font-medium">{task.title}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase flex-shrink-0 ${
                            task.status === "done"
                              ? "bg-emerald-50 text-emerald-600"
                              : task.status === "in_progress"
                              ? "bg-amber-50 text-amber-600"
                              : task.status === "review"
                              ? "bg-fuchsia-50 text-fuchsia-600"
                              : "bg-sky-50 text-sky-600"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No tasks currently assigned.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MemberManagementPanel;
