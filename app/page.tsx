"use client";

import { useState, useEffect } from 'react';
import { Card, Metric, Text, ProgressBar, Grid, Title, Flex, Badge } from "@tremor/react";

export default function Dashboard() {
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
      })
      .catch(err => console.error("Error fetching Master_Lake:", err));
  }, []);

  if (loading) return <div className="p-10 text-[#002B56] animate-pulse">Loading Revenue Data...</div>;

  // DYNAMIC CALCULATIONS
  const totalProjected = data.reduce((acc, row) => {
    const val = parseFloat(row.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0);
    return acc + val;
  }, 0);

  const totalCurrent = data.reduce((acc, row) => {
    const val = parseFloat(row.Current_Revenue?.replace(/[^0-9.-]+/g,"") || 0);
    return acc + val;
  }, 0);

  const goal = 6000000;
  const progressPercent = (totalProjected / goal) * 100;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#002B56]">Executive Overview</h1>
        <p className="text-slate-500">Live 2026 Revenue Pipeline</p>
      </header>

      {/* Main $6M Goal Card */}
      <Card className="ring-t-4 ring-[#05F283]">
        <Flex justifyContent="between">
          <Text className="font-medium text-[#002B56]">Progress to $6.0M Access Fee Goal</Text>
          <Badge color="emerald">{Math.round(progressPercent)}%</Badge>
        </Flex>
        <Metric className="text-[#002B56] mt-2">
          ${totalProjected.toLocaleString()} Projected
        </Metric>
        <ProgressBar value={progressPercent} color="emerald" className="mt-4" />
        <p className="text-xs mt-3 text-slate-400 font-semibold uppercase tracking-wider">
          Total Realized (Month 1): ${totalCurrent.toLocaleString()}
        </p>
      </Card>

      {/* Country/Program Breakdown */}
      <Grid numItemsLg={3} className="gap-6 mt-6">
        {data.slice(0, 6).map((item, idx) => (
          <Card key={idx} decoration="top" decorationColor={parseFloat(item.Activation_Health) < 80 ? "red" : "emerald"}>
            <Text className="text-xs uppercase text-slate-400">{item.Program} - {item.Country}</Text>
            <Metric className="text-[#002B56] text-xl">{item.Projected_Revenue}</Metric>
            <Flex className="mt-4">
              <Text className="text-xs">Activation Health</Text>
              <Text className="text-xs font-bold">{item.Activation_Health}</Text>
            </Flex>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
