import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-[20px] border border-slate-100 bg-white/90 p-4 shadow-panel backdrop-blur-md">
        <p className="font-semibold text-slate-900">{label}</p>
        <div className="mt-2 space-y-1 text-xs">
          {payload.map((entry) => (
            <p key={entry.name} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value} tasks
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const PerformanceAnalytics = ({ analyticsData }) => {
  if (!analyticsData || analyticsData.length === 0) {
    return null;
  }

  const chartData = analyticsData.map((item) => ({
    name: item.team.teamName,
    Todo: item.taskStats.todo || 0,
    "In Progress": item.taskStats.inProgress || 0,
    "In Review": item.taskStats.review || 0,
    Done: item.taskStats.done || 0,
  }));

  return (
    <section className="rounded-[30px] bg-white p-6 border border-slate-100 shadow-panel">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Analytics
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Performance Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated task distribution and status breakdowns across all teams
          </p>
        </div>
      </div>

      <div className="h-[360px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px", color: "#64748b" }}
            />
            <Bar dataKey="Todo" stackId="a" fill="#38bdf8" radius={[0, 0, 0, 0]} />
            <Bar dataKey="In Progress" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
            <Bar dataKey="In Review" stackId="a" fill="#e879f9" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Done" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default PerformanceAnalytics;
