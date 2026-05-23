import PriorityHeatmapCard from "@/components/analytics/PriorityHeatmapCard.jsx";
import AuditTrailPreview from "@/components/audit/AuditTrailPreview.jsx";
import KanbanPreviewCard from "@/components/dashboard/KanbanPreviewCard.jsx";
import AppShell from "@/components/layout/AppShell.jsx";

const DashboardPage = () => (
  <AppShell>
    <section className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.9fr)]">
        <KanbanPreviewCard />
        <AuditTrailPreview />
      </div>

      <PriorityHeatmapCard />
    </section>
  </AppShell>
);

export default DashboardPage;
