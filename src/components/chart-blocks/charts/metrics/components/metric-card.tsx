import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { chartTitle } from "@/components/primitives";
import { cn } from "@/lib/utils";

export default function MetricCard({
  title,
  value,
  change,
  className,
  showChange = true,
  showTarget = false, // add this
}: {
  title: string;
  value: string;
  change?: number;
  className?: string;
  showChange?: boolean;
  showTarget?: boolean;
}) {
  return (
    <section className={cn("flex flex-col", className)}>
      <h2 className={cn(chartTitle({ color: "mute", size: "sm" }), "mb-1")}>
        {title}
      </h2>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-semibold">{value}</span>
        {showChange && typeof change === "number" && <ChangeIndicator change={change} />}
      </div>
      {showTarget && (
        <div className="text-xs text-muted-foreground">Compare to target</div>
      )}
    </section>
  );
}

function ChangeIndicator({ change }: { change: number }) {
  return (
    <span
      className={cn(
        "flex items-center rounded-sm px-1 py-0.5 text-xs text-muted-foreground",
        change > 0
          ? "bg-green-50 text-green-600 dark:bg-green-950"
          : "bg-red-50 text-red-600 dark:bg-red-950",
      )}
    >
      {change > 0 ? "+" : ""}
      {Math.round(change * 100)}%
      {change > 0 ? (
        <ArrowUpRight className="ml-0.5 inline-block h-3 w-3" />
      ) : (
        <ArrowDownRight className="ml-0.5 inline-block h-3 w-3" />
      )}
    </span>
  );
}
