import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserPlus, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const ProfessionalCTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-hero-gradient">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 text-sm font-medium mb-6">
              {t.professional.badge}
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              {t.professional.title}
            </h2>

            <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              {t.professional.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="flex items-center gap-3 text-primary-foreground/90">
                <Calendar className="w-5 h-5" />
                <span>{t.professional.manageSchedules}</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/90">
                <TrendingUp className="w-5 h-5" />
                <span>{t.professional.growPatients}</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/90">
                <UserPlus className="w-5 h-5" />
                <span>{t.professional.freeRegistration}</span>
              </div>
            </div>

            <Button
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl"
              asChild
            >
              <Link to="/professionals">
                <UserPlus className="w-5 h-5" />
                {t.professional.cta}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalCTASection;
