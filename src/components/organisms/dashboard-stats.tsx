import type { ComponentType, SVGProps } from "react";
import { Badge } from "@/components/atoms/badge";
import { CalendarIcon, LayersIcon, UsersIcon } from "@/components/atoms/icons";
import { StatCard } from "@/components/molecules/stat-card";
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
  if (stat.chips?.length) {
    return (
      <>
        {stat.chips.map((chip) => (
          <Badge key={chip.label} tone={chip.tone ?? "neutral"}>
            {chip.label}
          </Badge>
        ))}
      </>
    );
  }

  if (stat.note) {
    return <p className="text-xs text-muted">{stat.note}</p>;
  }

  return null;
}

export function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = STAT_ICONS[stat.icon];
        return (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={Icon}
            footer={<StatFooter stat={stat} />}
          />
        );
      })}
    </div>
  );
}
