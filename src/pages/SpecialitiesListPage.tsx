import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SpecialitiesSection from '@/components/SpecialitiesSection';

const SpecialitiesListPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 lg:pt-24">
        <section className="py-16 lg:py-24">
          <SpecialitiesSection />
        </section>
      </main>
      <div className="mt-20"></div>
      <Footer />
    </div>
  );
};

export default SpecialitiesListPage;
