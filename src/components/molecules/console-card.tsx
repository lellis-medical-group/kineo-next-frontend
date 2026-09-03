import { Badge } from "@/components/atoms/badge";
import { Card } from "@/components/atoms/card";

export interface ConsoleContract {
  reference: string;
  status: string;
  practice: string;
  doctor: string;
  period: string;
}

export function ConsoleCard({ contract }: { contract: ConsoleContract }) {
  return (
    <Card className="p-5">
      <div
        aria-hidden="true"
        className="mb-4 flex items-center justify-between gap-3"
      >
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
        </span>
        <span className="font-mono text-[0.65rem] tracking-wider text-muted">
          kineo-live-console
        </span>
      </div>

      <div className="rounded-xl border border-border bg-background/60 p-4">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <p className="text-sm font-bold">
            Contrat Généré {contract.reference}
          </p>
          <Badge tone="success">{contract.status}</Badge>
        </div>

        <dl className="mt-3 space-y-1.5 text-xs text-muted">
          <div className="flex gap-2">
            <dt className="sr-only">Cabinet et praticien :</dt>
            <dd>
              {contract.practice} · {contract.doctor}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="sr-only">Période :</dt>
            <dd>Période : {contract.period}</dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
