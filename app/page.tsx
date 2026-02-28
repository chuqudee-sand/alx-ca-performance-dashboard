// app/page.tsx
import { Card, Metric, Text, ProgressBar, Grid, Col } from "@tremor/react";

export default function Dashboard() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-berkeleyBlue">Executive Overview</h1>
        <p className="text-slate-500">Real-time progress toward the $6M Access Fee Goal</p>
      </header>

      {/* The $6M Progress Tracker */}
      <Card className="ring-t-4 ring-springGreen">
        <Text>Strategic Revenue Realization</Text>
        <Metric className="text-berkeleyBlue">$2,450,000 / $6,000,000</Metric>
        <ProgressBar value={41} color="emerald" className="mt-4" />
        <p className="text-xs mt-2 text-slate-400">41% of annual target achieved</p>
      </Card>

      <Grid numItemsLg={3} className="gap-6 mt-6">
        {/* We will map your cleaned JSON data here into branded cards */}
        <Card decoration="top" decorationColor="iris">
          <Text>Activation Health</Text>
          <Metric>68%</Metric>
          <p className="text-tomato text-xs mt-2">⚠️ Below 80% Benchmark</p>
        </Card>
      </Grid>
    </div>
  );
}
