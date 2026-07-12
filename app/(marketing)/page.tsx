import { Hero } from "@/components/organisms/Hero";
import { About } from "@/components/organisms/About";
import { Pricing } from "@/components/organisms/Pricing";
import { Features } from "@/components/organisms/Features";

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
