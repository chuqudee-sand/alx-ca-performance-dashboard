// src/components/chart-with-insight.tsx
export default function ChartWithInsight({
  children,
  insight,
}: {
  children: React.ReactNode;
  insight: React.ReactNode;
}) {
  return (
    <section className="chart-with-insight">
      {children}
      <p className="mt-3 text-sm text-gray-400 font-normal">
        {insight}
      </p>
    </section>
  );
}
