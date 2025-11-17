import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function CohortLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Cohort" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
