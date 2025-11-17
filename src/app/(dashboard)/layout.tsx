import { TopNav } from "@/components/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="CA Programs Overview" />
      <main>{children}</main>
    </>
  );
}
