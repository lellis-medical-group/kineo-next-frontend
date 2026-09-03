import type { ComponentType, ReactNode, SVGProps } from "react";
import { Card } from "@/components/atoms/card";

export interface StatCardProps {
  title: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Contenu libre sous la valeur : badges, note, sous-titre… */
  footer?: ReactNode;
}

export function StatCard({ title, value, icon: Icon, footer }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm text-muted">{title}</h3>
        <Icon className="text-xl text-primary" />
      </div>

      <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>

      {footer && (
        <div className="flex flex-wrap items-center gap-2">{footer}</div>
      )}
    </Card>
  );
}
