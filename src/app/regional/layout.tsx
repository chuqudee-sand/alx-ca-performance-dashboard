import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function RegionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Regions" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
