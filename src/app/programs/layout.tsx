import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Programs" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
