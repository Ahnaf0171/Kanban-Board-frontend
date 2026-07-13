import { Hero } from "@/components/organisms/marketing/Hero";
import { About } from "@/components/organisms/marketing/About";
import { Pricing } from "@/components/organisms/marketing/Pricing";
import { Features } from "@/components/organisms/marketing/Features";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Pricing />
    </>
  );
}
