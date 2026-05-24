import { useEffect } from "react";
import { useForm } from "react-hook-form";

import AvatarBadge from "@/components/common/AvatarBadge.jsx";

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const TaskStudioPanel = ({
  selectedTeam,
  members,
  isSubmitting,
  errorMessage,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    },
  });

  const selectedAssignee = watch("assignedTo");

  useEffect(() => {
    reset({
      title: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    });
  }, [selectedTeam?.id, reset]);

  const submitTask = async (values) => {
    const didSucceed = await onSubmit(values);

    if (didSucceed) {
      reset({
        title: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });
    }
  };

  return (
    <section className="rounded-[30px] bg-white p-6 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
            Assignment studio
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Assign work for {selectedTeam?.teamName || "your team"}
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          {members.length} team members
        </span>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(submitTask)}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">
            Task title
          </span>
          <input
            type="text"
            placeholder="Launch landing page review"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
            {...register("title", {
              required: "Task title is required.",
            })}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-rose-500">{errors.title.message}</p>
          )}
        </label>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Assign to</span>
            {selectedAssignee && (
              <button
                type="button"
                onClick={() => setValue("assignedTo", "")}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {members.map((member) => {
              const isSelected = selectedAssignee === member.user?.id;

              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setValue("assignedTo", member.user?.id || "")}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    isSelected
                      ? "border-teal-300 bg-teal-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <AvatarBadge user={member.user} size="sm" />
                  <div>
                    <p className="font-medium text-slate-800">{member.user?.fullName}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      {member.isPrimaryLeader ? "Team leader" : member.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register("assignedTo")} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Priority
            </span>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
              {...register("priority")}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Due date
            </span>
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
              {...register("dueDate")}
            />
          </label>
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Assigning..." : "Create and assign task"}
        </button>
      </form>
    </section>
  );
};

export default TaskStudioPanel;
