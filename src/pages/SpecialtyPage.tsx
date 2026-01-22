import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Stethoscope,
  Heart,
  Sparkles,
  Baby,
  Users,
  Bone,
  Brain,
  Utensils,
  Ear,
  Activity,
  Smile,
  FlaskConical,
  ArrowLeft,
  Search,
} from 'lucide-react';

const specialtiesData: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
  }
> = {
  'mjek-pergjithshem': {
    icon: Stethoscope,
    color: 'from-blue-500 to-blue-600',
  },
  kardiologji: {
    icon: Heart,
    color: 'from-red-500 to-red-600',
  },
  dermatologji: {
    icon: Sparkles,
    color: 'from-pink-500 to-pink-600',
  },
  pediatri: {
    icon: Baby,
    color: 'from-yellow-500 to-yellow-600',
  },
  gjinekologji: {
    icon: Users,
    color: 'from-purple-500 to-purple-600',
  },
  ortopedi: {
    icon: Bone,
    color: 'from-orange-500 to-orange-600',
  },
  psikiatri: {
    icon: Brain,
    color: 'from-indigo-500 to-indigo-600',
  },
  gastroenterologji: {
    icon: Utensils,
    color: 'from-green-500 to-green-600',
  },
  orl: {
    icon: Ear,
    color: 'from-cyan-500 to-cyan-600',
  },
  urologji: {
    icon: Activity,
    color: 'from-teal-500 to-teal-600',
  },
  dentiste: {
    icon: Smile,
    color: 'from-sky-500 to-sky-600',
  },
  laboratore: {
    icon: FlaskConical,
    color: 'from-emerald-500 to-emerald-600',
  },
};

const SpecialtyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const specialty = slug ? specialtiesData[slug] : null;

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

  const IconComponent = specialty.icon;
  const name = t.specialityNames[slug] || slug;
  const description = t.specialityDescriptions[slug] || '';
  const reasons = t.consultationReasons[slug] || [];

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
        {reasons.length > 0 && (
          <section className="py-16 lg:py-20">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                {t.specialities.consultationReasons}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...reasons, t.other].map((reason, index) => (
                  <motion.div
                    key={reason}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 bg-card rounded-xl border border-border/50 card-shadow hover:card-shadow-hover transition-all cursor-pointer hover:-translate-y-1"
                  >
                    <span className="text-foreground font-medium">
                      {reason}
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
