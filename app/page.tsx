import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import DoubleFunnel from "@/components/double-funnel";
import CredibilitySection from "@/components/credibility-section";
import FeaturedProperties from "@/components/featured-properties";
import PrimeZones from "@/components/prime-zones";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <DoubleFunnel />
        <CredibilitySection />
        <FeaturedProperties />
        <PrimeZones />
      </main>
    </>
  );
}
