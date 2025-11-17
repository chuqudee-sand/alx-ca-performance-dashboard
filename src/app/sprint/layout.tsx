import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function SprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Sprints" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
