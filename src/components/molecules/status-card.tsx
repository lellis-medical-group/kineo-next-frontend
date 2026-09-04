import type { ReactNode } from "react";
import { Card } from "@/components/atoms/card";

/** Centered HTTP-status card shared by error.tsx (500) and not-found.tsx (404). */
export function StatusCard({
  code,
  message,
  children,
}: {
  code: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-md p-10 text-center">
        <h1 className="text-5xl font-medium tracking-[-0.02em]">{code}</h1>
        <p className="mt-4 text-sm text-muted">{message}</p>
        {children}
      </Card>
    </main>
  );
}
