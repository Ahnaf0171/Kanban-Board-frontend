import type { Metadata } from "next";
import { Providers } from "@/components/providers/Providers";
import "@/app/global.css";

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "Task management and image annotation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
