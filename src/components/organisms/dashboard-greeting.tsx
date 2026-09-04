import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { FileTextIcon, LayersIcon, PlusIcon } from "@/components/atoms/icons";
import type { DashboardAction } from "@/lib/dashboard";

const ACTION_ICONS = {
  plus: PlusIcon,
  file: FileTextIcon,
  layers: LayersIcon,
} as const;

export function DashboardGreeting({
  greeting,
  actions,
}: {
  greeting: { name: string; subtitle: string; meta?: string };
  actions: DashboardAction[];
}) {
  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Bonjour {greeting.name}
      </h1>
      {greeting.meta && (
        <p className="mt-1 text-sm font-medium text-primary">{greeting.meta}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
        {greeting.subtitle}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {actions.map((action) => {
          const Icon = action.icon ? ACTION_ICONS[action.icon] : undefined;
          return (
            <Button
              key={action.label}
              href={action.href}
              variant={action.variant ?? "outline"}
              className="sm:w-auto"
            >
              {Icon && <Icon />}
              {action.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
