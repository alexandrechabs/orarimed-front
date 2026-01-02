import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import WhyOrariMedSection from "@/components/WhyOrariMedSection";
import SecuritySection from "@/components/SecuritySection";
import ProfessionalCTASection from "@/components/ProfessionalCTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <SpecialtiesSection />
        <WhyOrariMedSection />
        <SecuritySection />
        <ProfessionalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
