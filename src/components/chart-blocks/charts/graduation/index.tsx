import { CirclePercent } from "lucide-react";
import { graduation } from "@/data/graduation";
import { addThousandsSeparator } from "@/lib/utils";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";

export default function Graduation() {
  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Graduation" icon={CirclePercent} />
      <Indicator />
      <div className="relative max-h-80 flex-grow">
        <Chart />
      </div>
    </section>
  );
}

function Indicator() {
  return (
    <div className="mt-3">
      <span className="mr-1 text-2xl font-medium">
        {addThousandsSeparator(
          graduation.reduce((acc, curr) => acc + curr.value, 0),
        )}
      </span>
      <span className="text-muted-foreground/60">Learners</span>
    </div>
  );
}
