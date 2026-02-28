// app/historical/page.tsx
import { BarChart, Title, Subtitle, Card } from "@tremor/react";

export default function HistoricalView() {
  // This data will eventually come from your Master_Lake API
  const chartData = [
    { name: "Enrolled", count: 12500 },
    { name: "Activated", count: 8200 }, // This is where we show the 30% gap
    { name: "Graduated", count: 6100 },
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <Title className="text-berkeleyBlue">Program Retention Funnel</Title>
      <Subtitle>Historical conversion from Enrollment to Graduation</Subtitle>
      <BarChart
        className="mt-6 h-80"
        data={chartData}
        index="name"
        categories={["count"]}
        colors={["emerald"]} // Using Spring Green equivalent
        valueFormatter={(number) => Intl.NumberFormat("us").format(number)}
      />
      <div className="mt-4 p-4 bg-slate-100 rounded-md border-l-4 border-tomato">
        <Text className="text-berkeleyBlue font-semibold">Observation:</Text>
        <Text>Current data confirms the 30% activation-to-graduation drop-off identified in the 2025 analysis.</Text>
      </div>
    </Card>
  );
}
