import { CustomCursor } from "@/components/ui/CustomCursor";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { HeroSection } from "@/components/hero/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { LookbookSection } from "@/components/sections/LookbookSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Floating contact buttons */}
      {/* <FloatingActions /> */}

      {/* Page content */}
      <main>
        <HeroSection />
        <CollectionSection />
        <LookbookSection />
        <StatsSection />
        <ManifestoSection />
      </main>

      <Footer />
    </>
  );
}
