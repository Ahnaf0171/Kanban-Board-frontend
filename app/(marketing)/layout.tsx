import { Header } from "@/components/organisms/shared/Header";
import { Footer } from "@/components/organisms/shared/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
