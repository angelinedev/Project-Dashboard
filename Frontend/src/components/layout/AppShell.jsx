const AppShell = ({ sidebar, topBar, children }) => (
  <div className="min-h-screen bg-transparent px-4 py-5 text-slate-900 lg:px-6">
    <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1600px] gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      {sidebar}

      <div className="rounded-[36px] border border-white/60 bg-white/65 p-5 shadow-panel backdrop-blur-xl sm:p-7">
        {topBar}
        <main className="mt-8">{children}</main>
      </div>
    </div>
  </div>
);

export default AppShell;
