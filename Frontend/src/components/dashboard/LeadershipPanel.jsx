import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const LeadershipPanel = ({
  teams,
  users,
  isCreatingTeam,
  isUpdatingLeader,
  createError,
  leadershipError,
  onCreateTeam,
  onAssignLeader,
}) => {
  const [leaderSelections, setLeaderSelections] = useState({});
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teamName: "",
      description: "",
      leaderId: "",
    },
  });

  const defaultLeaderId = useMemo(() => users[0]?.id || "", [users]);

  const submitCreateTeam = async (values) => {
    await onCreateTeam({
      ...values,
      leaderId: values.leaderId || defaultLeaderId,
    });
    reset({
      teamName: "",
      description: "",
      leaderId: values.leaderId || defaultLeaderId,
    });
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <article className="rounded-[30px] bg-white p-6 shadow-panel">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
          Leadership studio
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Create a new team
        </h2>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(submitCreateTeam)}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Team name
            </span>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
              {...register("teamName", {
                required: "Team name is required.",
              })}
            />
            {errors.teamName && (
              <p className="mt-2 text-sm text-rose-500">{errors.teamName.message}</p>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Team description
            </span>
            <textarea
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
              {...register("description")}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Assign team leader
            </span>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
              {...register("leaderId")}
            >
              <option value="">Select a leader</option>
              {users.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.fullName}
                </option>
              ))}
            </select>
          </label>

          {createError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {createError}
            </div>
          )}

          <button
            type="submit"
            disabled={isCreatingTeam}
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCreatingTeam ? "Creating team..." : "Create team"}
          </button>
        </form>
      </article>

      <article className="rounded-[30px] bg-white p-6 shadow-panel">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              Team leaders
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Assign team-specific leaders
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {teams.length} teams
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {teams.map((entry) => {
            const selectedLeaderId =
              leaderSelections[entry.team?.id] ?? entry.team?.leader ?? "";

            return (
              <div
                key={entry.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {entry.team?.teamName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Invite code {entry.team?.inviteCode}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {entry.team?.memberCount} members
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-3 md:flex-row">
                  <select
                    value={selectedLeaderId}
                    onChange={(event) =>
                      setLeaderSelections((current) => ({
                        ...current,
                        [entry.team?.id]: event.target.value,
                      }))
                    }
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400"
                  >
                    <option value="">Select leader</option>
                    {users.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.fullName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      onAssignLeader({
                        teamId: entry.team?.id,
                        leaderUserId: selectedLeaderId,
                      })
                    }
                    disabled={isUpdatingLeader || !selectedLeaderId}
                    className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isUpdatingLeader ? "Updating..." : "Assign leader"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {leadershipError && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {leadershipError}
          </div>
        )}
      </article>
    </section>
  );
};

export default LeadershipPanel;
