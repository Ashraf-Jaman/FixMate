import { About } from "@/components/home/about";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-page">
      <Hero />
      <About />
      <HowItWorks />
    </main>
  );
}
