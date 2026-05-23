import { navigationItems } from "@/utils/navigation.js";

const Sidebar = () => (
  <aside className="rounded-[36px] bg-slate-950 p-6 text-white shadow-panel">
    <div>
      <p className="text-sm uppercase tracking-[0.32em] text-teal-200/70">
        Workspace
      </p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight">
        Smart Kanban Dashboard
      </h1>
      <p className="mt-3 max-w-xs text-sm text-slate-300">
        A scalable MERN foundation for the board, analytics, and audit trail
        experience.
      </p>
    </div>

    <nav className="mt-10 space-y-3">
      {navigationItems.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
            item.active
              ? "bg-teal-500 text-slate-950"
              : "bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
        >
          <span className="font-medium">{item.label}</span>
          <span className="text-xs uppercase tracking-[0.2em]">{item.hint}</span>
        </button>
      ))}
    </nav>

    <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-5">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-200/70">
        Step 1
      </p>
      <h2 className="mt-3 text-xl font-semibold">Scaffold complete</h2>
      <p className="mt-2 text-sm text-slate-300">
        Backend modules, Mongoose models, and the Vite shell are ready for the
        CRUD layer next.
      </p>
    </div>
  </aside>
);

export default Sidebar;
