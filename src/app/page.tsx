import { About } from "@/components/about";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-page">
      <Hero />
      <About />
      <HowItWorks />
    </main>
  );
}
