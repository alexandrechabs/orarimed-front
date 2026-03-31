import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Search, UserPlus } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import heroImage from '@/assets/hero-doctor.jpg';
import { Input } from './ui/input';
import AddressAutocomplete from './Autocomplete';
import { DoctorAutocomplete } from './DoctorAutocomplete';
import { useState } from 'react';
import { SearchDoctor } from './search';

const HeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState({
    address: '',
    lat: 0,
    lng: 0,
  });
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const search = () => {
    navigate(
      `/search?q=${encodeURIComponent(selectedDoctor)}&city=${encodeURIComponent(selectedCity.address)}&lat=${selectedCity.lat}&lng=${selectedCity.lng}`,
    );
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional doctor in Albania"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 rounded-full bg-accent/20 text-white border border-white text-sm font-medium mb-6"
          >
            {t.hero.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            {t.hero.h1}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 relative z-0"
          >
            <SearchDoctor
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedDoctor={selectedDoctor}
              setSelectedDoctor={setSelectedDoctor}
              search={search}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button
              size="xl"
              variant="heroOutline"
              className="z-[-1] bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link to="/professionals">
                <UserPlus className="w-5 h-5" />
                {t.hero.imProfessional}
              </Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-6 text-primary-foreground/70 text-sm"
          >
            <div className="flex items-center gap-2 z-[-1]">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              <span>{t.hero.verifiedDoctors}</span>
            </div>
            <div className="flex items-center gap-2 z-[-1]">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              <span>{t.hero.booking247}</span>
            </div>
            <div className="flex items-center gap-2 z-[-1]">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              <span>{t.hero.freeForPatients}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </section>
  );
};

export default HeroSection;
