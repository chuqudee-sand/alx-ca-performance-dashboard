"use client";

import { useAtomValue } from "jotai";
import { FilePlus2 } from "lucide-react";
import { ticketChartDataAtom } from "@/lib/atoms";
import type { TicketMetric } from "@/types/types";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";
/*import MetricCard from "./components/metric-card";*/

const _calMetricCardValue = (
  data: TicketMetric[],
  type: "activated" | "graduated"
) => {
  const filteredData = data.filter((item) => item.type === type);
  return Math.round(
    filteredData.reduce((acc, curr) => acc + curr.count, 0) /
      filteredData.length
  );
};

export default function ActivationGraduation() {
  const _ticketChartData = useAtomValue(ticketChartDataAtom);
  /*const avgActivated = calMetricCardValue(ticketChartData, "activated");
  const avgGraduated = calMetricCardValue(ticketChartData, "graduated");*/

  return (
    <section className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <ChartTitle title="Activation vs Graduation" icon={FilePlus2} />
      </div>
      <div className="flex flex-wrap">
        {/* 
        <div className="my-4 flex w-52 shrink-0 flex-col justify-center gap-6">
          <MetricCard
            title="Avg. Activated"
            value={avgActivated}
            color="#60C2FB"
          />
          <MetricCard
            title="Avg. Graduated"
            value={avgGraduated}
            color="#14349aff"
          />
        </div> 
        */}
        <div className="relative h-96 min-w-[320px] flex-1">
          <Chart />
        </div>
      </div>
    </section>
  );
}

