import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { Sidebar } from "@/components/organisms/shared/Sidebar";
import { Header } from "@/components/organisms/shared/Header";

export const maxDuration = 60;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
