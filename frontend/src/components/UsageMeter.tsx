import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UsageMetric } from "@/lib/types";

const LABEL: Record<string, string> = {
  interviews: "Interviews",
  resumes: "Resumes",
  cover_letters: "Cover letters",
  job_logs: "Job search entries",
};

/** Compact "X / Y remaining" chip for a monthly AI or activity cap. */
export default function UsageMeter({
  metric,
  testId,
  showIcon = true,
}: {
  metric: UsageMetric;
  testId: string;
  showIcon?: boolean;
}) {
  const exhausted = metric.remaining === 0;
  return (
    <Badge
      variant={exhausted ? "destructive" : "secondary"}
      className="gap-1.5 font-mono text-[11px]"
      data-testid={testId}
    >
      {showIcon && <Sparkles className="h-3 w-3" aria-hidden="true" />}
      {LABEL[metric.kind] ?? metric.kind} remaining: {metric.remaining}/{metric.limit}
      {metric.granted_extra > 0 ? ` (+${metric.granted_extra} granted)` : ""}
    </Badge>
  );
}
