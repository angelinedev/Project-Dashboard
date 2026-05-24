import TeamCard from "./TeamCard.jsx";

const TeamGrid = ({ analyticsData }) => {
  if (!analyticsData || analyticsData.length === 0) {
    return (
      <div className="rounded-[30px] border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-panel">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
          Teams Grid
        </p>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">
          No teams found in this workspace
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Create a team from the Leadership panel to start tracking progress.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-[30px] bg-slate-50/50 p-6 border border-slate-100">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Team Overview
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Active Workspace Teams
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {analyticsData.map((item) => (
          <TeamCard
            key={item.team.id}
            team={item.team}
            taskStats={item.taskStats}
            progress={item.progress}
          />
        ))}
      </div>
    </section>
  );
};

export default TeamGrid;
