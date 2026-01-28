import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import * as LucideIcons from 'lucide-react';
import { useSpecialities } from '@/hooks/useSpecialities';

const SpecialitiesSection = () => {
  const { specialities, isLoading, error } = useSpecialities();
  const { t, language } = useLanguage();

  return (
    <section className="py-5 lg:py-5 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.specialities.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.specialities.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {specialities &&
            specialities.map((speciality, index) => (
              <motion.div
                key={speciality.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/specialities/${speciality.slug}`}
                  className="group block bg-card rounded-xl p-5 lg:p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border/50"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${speciality.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {(() => {
                      const Icon = LucideIcons[speciality.icon];
                      return (
                        <div className="flex items-center relative">
                          {Icon && <Icon className="h-4 w-4 text-white" />}
                        </div>
                      );
                    })()}
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {speciality.translations.find((t) => t.locale === language)
                      ?.name || speciality.slug}
                  </h3>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialitiesSection;
