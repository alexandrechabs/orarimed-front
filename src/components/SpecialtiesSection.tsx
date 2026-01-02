import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  ArrowRight,
} from 'lucide-react';

const specialties = [
  {
    icon: Stethoscope,
    slug: 'mjek-pergjithshem',
    color: 'from-blue-500 to-blue-600',
  },
  { icon: Heart, slug: 'kardiologji', color: 'from-red-500 to-red-600' },
  { icon: Sparkles, slug: 'dermatologji', color: 'from-pink-500 to-pink-600' },
  { icon: Baby, slug: 'pediatri', color: 'from-yellow-500 to-yellow-600' },
  { icon: Users, slug: 'gjinekologji', color: 'from-purple-500 to-purple-600' },
  { icon: Bone, slug: 'ortopedi', color: 'from-orange-500 to-orange-600' },
  { icon: Brain, slug: 'psikiatri', color: 'from-indigo-500 to-indigo-600' },
  {
    icon: Utensils,
    slug: 'gastroenterologji',
    color: 'from-green-500 to-green-600',
  },
  { icon: Ear, slug: 'orl', color: 'from-cyan-500 to-cyan-600' },
  { icon: Activity, slug: 'urologji', color: 'from-teal-500 to-teal-600' },
  { icon: Smile, slug: 'dentiste', color: 'from-sky-500 to-sky-600' },
  {
    icon: FlaskConical,
    slug: 'laboratore',
    color: 'from-emerald-500 to-emerald-600',
  },
];

const SpecialtiesSection = () => {
  const { t } = useLanguage();

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
            {t.specialties.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.specialties.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/specialitete/${specialty.slug}`}
                className="group block bg-card rounded-xl p-5 lg:p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border/50"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${specialty.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <specialty.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t.specialtyNames[specialty.slug] || specialty.slug}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
