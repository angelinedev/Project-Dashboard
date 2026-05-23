const TopBar = () => (
  <header className="flex flex-col gap-4 border-b border-slate-200/70 pb-6 xl:flex-row xl:items-center xl:justify-between">
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
        Dashboard
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-900">
        Project control center
      </h2>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500">
        Modular MERN foundation
      </div>
      <div className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
        Step 1 in progress
      </div>
    </div>
  </header>
);

export default TopBar;
