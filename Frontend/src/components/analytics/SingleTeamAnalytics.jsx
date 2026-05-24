import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-[20px] border border-slate-100 bg-white/95 p-4 shadow-panel backdrop-blur-md">
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

const SingleTeamAnalytics = ({ selectedTeam, members, tasks }) => {
  if (!selectedTeam) {
    return (
      <div className="rounded-[30px] bg-white p-6 border border-slate-100 shadow-panel text-center text-slate-500 py-12">
        Select a team from the tabs above to view detailed member analytics.
      </div>
    );
  }

  // Calculate statistics for each member of the selected team
  const chartData = members.map((member) => {
    const memberTasks = tasks.filter((t) => t.assignedTo?.id === member.user?.id);
    const todo = memberTasks.filter((t) => t.status === "todo").length;
    const active = memberTasks.filter((t) => t.status === "in_progress" || t.status === "review").length;
    const completed = memberTasks.filter((t) => t.status === "done").length;
    const total = memberTasks.length;

    return {
      name: getMemberAbbreviation(member.user?.fullName),
      fullName: member.user?.fullName || "Unknown",
      Pending: todo,
      Active: active,
      Completed: completed,
      Total: total,
    };
  });

  return (
    <section className="rounded-[30px] bg-white p-6 border border-slate-100 shadow-panel">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Team Details
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {selectedTeam.teamName} Member Workloads
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare active, completed, and pending tasks for each team collaborator
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          {members.length} members loaded
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-[320px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
              <Line
                type="monotone"
                dataKey="Pending"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Active"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Completed"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Total"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-slate-400 py-12 text-sm italic">
          No member data available. Add members to this team to populate analytics.
        </div>
      )}
    </section>
  );
};

export default SingleTeamAnalytics;
