import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowLeft, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '@/services/auth/useAuth';
import { useSpecialities } from '@/hooks/useSpecialities';

const SpecialtyPage = () => {
  const { specialities, isLoading, error } = useSpecialities();
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const specialty = slug ? specialities.find((s) => s.slug === slug) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!specialty || !slug) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl font-bold mb-4">
              {t.specialities.notFound}
            </h1>
            <Link to="/specialitete" className="text-primary hover:underline">
              {t.specialities.backToSpecialities}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const IconComponent = LucideIcons[specialty.icon];
  const name =
    specialty.translations.find((t) => t.locale === language)?.name ||
    specialty.slug;
  const description = '';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 lg:pt-28">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-secondary/50 to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <Link
              to="/specialities"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.specialities.backToSpecialities}
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row items-start gap-8"
            >
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${specialty.color} flex items-center justify-center shadow-lg`}
              >
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {name}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mb-8">
                  {description}
                </p>
                <Button size="lg" variant="hero">
                  <Search className="w-5 h-5" />
                  {t.specialities.findButton} {name.toLowerCase()}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Consultation Reasons */}
        {specialty.subSpecialities.length > 0 && (
          <section className="py-16 lg:py-20">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                {t.specialities.consultationReasons}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...specialty.subSpecialities].map((subspeciality, index) => (
                  <motion.div
                    key={subspeciality.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 bg-card rounded-xl border border-border/50 card-shadow hover:card-shadow-hover transition-all cursor-pointer hover:-translate-y-1"
                  >
                    <span className="text-foreground font-medium">
                      {subspeciality.translations.find(
                        (t) => t.locale === language,
                      )?.name || subspeciality.slug}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SpecialtyPage;
