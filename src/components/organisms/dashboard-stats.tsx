import type { ComponentType, SVGProps } from "react";
import { CalendarIcon, LayersIcon, UsersIcon } from "@/components/atoms/icons";
import { StatCard } from "@/components/molecules/stat-card";
import { cn } from "@/lib/cn";
import type { DashboardStat } from "@/lib/dashboard";

const STAT_ICONS: Record<
  DashboardStat["icon"],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  layers: LayersIcon,
  users: UsersIcon,
  calendar: CalendarIcon,
};

function StatFooter({ stat }: { stat: DashboardStat }) {
  if (stat.detail) {
    return <p className="text-xs text-muted">{stat.detail}</p>;
  }

  return null;
}

export function DashboardStats({
  stats,
  className,
}: {
  stats: DashboardStat[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3",
        className,
      )}
    >
      {stats.map((stat) => {
        const Icon = STAT_ICONS[stat.icon];
        return (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            label={stat.label}
            icon={Icon}
            footer={<StatFooter stat={stat} />}
          />
        );
      })}
    </div>
  );
}
