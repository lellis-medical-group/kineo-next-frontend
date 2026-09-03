import { ActivityFeed } from "@/components/organisms/activity-feed";
import { DashboardGreeting } from "@/components/organisms/dashboard-greeting";
import { DashboardStats } from "@/components/organisms/dashboard-stats";
import { ReactivityPanel } from "@/components/organisms/reactivity-panel";
import type { DashboardData } from "@/lib/dashboard";

/**
 * Contenu de la page connectée — reçoit les données via props.
 * Le shell (navbar + footer) est fourni par le layout du groupe (site).
 */
export function MemberHome({ data }: { data: DashboardData }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <DashboardGreeting greeting={data.greeting} actions={data.actions} />

          <DashboardStats stats={data.stats} />

          <ActivityFeed items={data.activity} seeAllHref="/applications" />
        </div>

        <aside className="space-y-6">
          <ReactivityPanel
            title={data.reactivity.title}
            stats={data.reactivity.stats}
            tipTitle={data.reactivity.tipTitle}
            tip={data.reactivity.tip}
          />
        </aside>
      </div>
    </div>
  );
}
