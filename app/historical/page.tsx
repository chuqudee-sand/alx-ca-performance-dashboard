"use client";

import { useState, useEffect } from 'react';
import { BarChart, Title, Subtitle, Card, Text } from "@tremor/react";

export default function HistoricalView() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (!API_URL) return;

    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10">Calculating Funnel Metrics...</div>;

  // AGGREGATE TOTALS FOR FUNNEL
  const totalEnrolled = data.reduce((acc, row) => acc + parseInt(row.Current_Enrolled || 0), 0);
  const totalActivated = data.reduce((acc, row) => acc + parseInt(row.Current_Activated || 0), 0);
  const totalProjectedGrads = data.reduce((acc, row) => acc + parseInt(row.Projected_Grads || 0), 0);

  const funnelData = [
    { name: "Total Enrolled", count: totalEnrolled },
    { name: "Total Activated", count: totalActivated },
    { name: "Projected Grads", count: totalProjectedGrads },
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <Title className="text-[#002B56]">Program Retention Funnel</Title>
      <Subtitle>Aggregated conversion across all 2026 cohorts</Subtitle>
      
      <BarChart
        className="mt-6 h-80"
        data={funnelData}
        index="name"
        categories={["count"]}
        colors={["emerald"]} 
        valueFormatter={(number: number) => Intl.NumberFormat("us").format(number)}
      />

      <div className="mt-6 p-4 bg-slate-50 rounded-md border-l-4 border-[#FF5347]">
        <p className="text-[#002B56] font-bold">System Insight:</p>
        <p className="text-[#002B56] mt-1 italic">
          Current activation-to-enrollment ratio is {Math.round((totalActivated/totalEnrolled)*100)}%. 
          Target remains 80% to avoid revenue shortfall.
        </p>
      </div>
    </Card>
  );
}
