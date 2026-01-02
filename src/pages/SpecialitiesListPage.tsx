import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Stethoscope, Heart, Sparkles, Baby, Users, Bone, 
  Brain, Utensils, Ear, Activity, Smile, FlaskConical
} from "lucide-react";

const specialties = [
  { icon: Stethoscope, name: "Mjek i përgjithshëm", slug: "mjek-pergjithshem", color: "from-blue-500 to-blue-600" },
  { icon: Heart, name: "Kardiologji", slug: "kardiologji", color: "from-red-500 to-red-600" },
  { icon: Sparkles, name: "Dermatologji", slug: "dermatologji", color: "from-pink-500 to-pink-600" },
  { icon: Baby, name: "Pediatri", slug: "pediatri", color: "from-yellow-500 to-yellow-600" },
  { icon: Users, name: "Obstetrikë & Gjinekologji", slug: "gjinekologji", color: "from-purple-500 to-purple-600" },
  { icon: Bone, name: "Ortopedi", slug: "ortopedi", color: "from-orange-500 to-orange-600" },
  { icon: Brain, name: "Psikiatri & Psikologji", slug: "psikiatri", color: "from-indigo-500 to-indigo-600" },
  { icon: Utensils, name: "Gastroenterologji", slug: "gastroenterologji", color: "from-green-500 to-green-600" },
  { icon: Ear, name: "ORL (Vesh-Hundë-Fyt)", slug: "orl", color: "from-cyan-500 to-cyan-600" },
  { icon: Activity, name: "Urologji", slug: "urologji", color: "from-teal-500 to-teal-600" },
  { icon: Smile, name: "Stomatologji (Dentistë)", slug: "dentiste", color: "from-sky-500 to-sky-600" },
  { icon: FlaskConical, name: "Laboratorë analizash", slug: "laboratore", color: "from-emerald-500 to-emerald-600" },
];

const SpecialitiesListPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 lg:pt-28">
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Të gjitha specialitetet
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Gjeni mjekë të specializuar për çdo nevojë shëndetësore në Tiranë dhe në të gjithë Shqipërinë.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {specialties.map((specialty, index) => (
                <motion.div
                  key={specialty.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    to={`/specialitete/${specialty.slug}`}
                    className="group block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border/50 h-full"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${specialty.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <specialty.icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {specialty.name}
                    </h2>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SpecialitiesListPage;
