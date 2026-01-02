import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
} from 'lucide-react';
import SpecialtiesSection from '@/components/SpecialtiesSection';

const SpecialitiesListPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 lg:pt-24">
        <section className="py-16 lg:py-24">
          <SpecialtiesSection />
        </section>
      </main>
      <div className="mt-20"></div>
      <Footer />
    </div>
  );
};

export default SpecialitiesListPage;
