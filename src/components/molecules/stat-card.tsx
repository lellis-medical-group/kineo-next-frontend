import type { ComponentType, ReactNode, SVGProps } from "react";
import { Card } from "@/components/atoms/card";

export interface StatCardProps {
  title: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Légende discrète expliquant la valeur. */
  label?: string;
  /** Contenu libre sous la valeur : badges, note, légende… */
  footer?: ReactNode;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  label,
  footer,
}: StatCardProps) {
  return (
    <Card className="flex flex-col gap-1.5 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm text-muted">{title}</h3>
        <Icon className="text-xl text-primary" />
      </div>

      <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>

      {label && <p className="text-sm text-muted">{label}</p>}

      {footer && (
        <div className="mt-2 flex flex-wrap items-center gap-2">{footer}</div>
      )}
    </Card>
  );
}
