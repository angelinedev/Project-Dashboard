const columns = [
  {
    name: "Todo",
    accent: "bg-sky-100 text-sky-700",
    cards: ["Draft onboarding flow", "QA smart filters"],
  },
  {
    name: "In Progress",
    accent: "bg-amber-100 text-amber-700",
    cards: ["Refine revenue widgets", "Sync audit activity panel"],
  },
  {
    name: "Done",
    accent: "bg-emerald-100 text-emerald-700",
    cards: ["Ship starter boilerplate"],
  },
];

const KanbanPreviewCard = () => (
  <section className="rounded-[32px] bg-white p-6 shadow-panel">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
          Board
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Kanban workflow preview
        </h2>
      </div>
      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
        dnd-kit next
      </span>
    </div>

    <div className="grid gap-4 xl:grid-cols-3">
      {columns.map((column) => (
        <div key={column.name} className="rounded-[24px] bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">{column.name}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${column.accent}`}>
              {column.cards.length} cards
            </span>
          </div>

          <div className="space-y-3">
            {column.cards.map((card) => (
              <article
                key={card}
                className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm"
              >
                <p className="font-medium text-slate-800">{card}</p>
                <p className="mt-2 text-sm text-slate-500">
                  Initial visual placeholder for the production Kanban engine.
                </p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default KanbanPreviewCard;
