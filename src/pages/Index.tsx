import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import SpecialtiesSection from '@/components/SpecialtiesSection';
import WhyOrariMedSection from '@/components/WhyOrariMedSection';
import SecuritySection from '@/components/SecuritySection';
import ProfessionalCTASection from '@/components/ProfessionalCTASection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const Index = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <SpecialtiesSection />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            to="/specialitete"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
          >
            {t.specialties.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        <WhyOrariMedSection />
        <SecuritySection />
        <ProfessionalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
