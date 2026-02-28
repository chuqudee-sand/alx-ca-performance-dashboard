"use client"; // <--- THIS IS THE FIX

import { Card, Metric, Text, ProgressBar, Grid, Title, Flex } from "@tremor/react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#002B56]">Executive Overview</h1>
        <p className="text-slate-500">Real-time progress toward the $6M Access Fee Goal</p>
      </header>

      {/* The $6M Progress Tracker */}
      <Card className="ring-t-4 ring-[#05F283]">
        <Text className="font-medium text-[#002B56]">Strategic Revenue Realization</Text>
        <Metric className="text-[#002B56] mt-2">$2,450,000 / $6,000,000</Metric>
        <ProgressBar value={41} color="emerald" className="mt-4" />
        <p className="text-xs mt-3 text-slate-400 font-semibold uppercase tracking-wider">
          41% of annual target achieved
        </p>
      </Card>

      <Grid numItemsLg={3} className="gap-6 mt-6">
        <Card decoration="top" decorationColor="indigo">
          <Text className="text-[#002B56]">Current Activation Rate</Text>
          <Metric className="text-[#002B56]">68%</Metric>
          <p className="text-[#FF5347] text-xs mt-2 font-bold uppercase">
            ⚠️ 30% Gap Identified
          </p>
        </Card>
        
        <Card decoration="top" decorationColor="emerald">
          <Text className="text-[#002B56]">Current Realized Revenue</Text>
          <Metric className="text-[#002B56]">$485,200</Metric>
          <p className="text-[#05F283] text-xs mt-2 font-bold uppercase">
            ✅ Month 1 Payments
          </p>
        </Card>

        <Card decoration="top" decorationColor="yellow">
          <Text className="text-[#002B56]">Retention Risk</Text>
          <Metric className="text-[#002B56]">$112,000</Metric>
          <p className="text-slate-400 text-xs mt-2 font-bold uppercase">
            Based on 80% Target
          </p>
        </Card>
      </Grid>
    </div>
  );
}
