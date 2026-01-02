import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  {
    id: 1,
    category: "Shëndeti në Shqipëri",
    title: "Kujdesi parandalues – pse është i rëndësishëm?",
    excerpt: "Kontrollet e rregullta mjekësore ndihmojnë në zbulimin e hershëm të sëmundjeve dhe përmirësojnë cilësinë e jetës.",
    date: "15 Dhjetor 2024",
    slug: "kujdesi-parandalues"
  },
  {
    id: 2,
    category: "Të rejat nga OrariMed",
    title: "OrariMed lançohet në Tiranë",
    excerpt: "OrariMed nis zyrtarisht shërbimin e tij në Tiranë, duke lidhur pacientët me profesionistë shëndetësorë në mënyrë digjitale.",
    date: "10 Dhjetor 2024",
    slug: "orarimed-lancohet"
  },
  {
    id: 3,
    category: "Shëndeti në Shqipëri",
    title: "Rëndësia e vaksinimit në moshë të re",
    excerpt: "Vaksinimi mbron fëmijët nga sëmundje të rrezikshme dhe ndihmon në krijimin e imunitetit kolektiv.",
    date: "5 Dhjetor 2024",
    slug: "rendessia-vaksinimit"
  },
  {
    id: 4,
    category: "Të rejat nga OrariMed",
    title: "Funksionalitete të reja në platformë",
    excerpt: "Zbuloni funksionalitetet e reja që do të lehtësojnë rezervimin e takimeve tuaja mjekësore.",
    date: "1 Dhjetor 2024",
    slug: "funksionalitete-reja"
  },
];

const AktualitetePage = () => {
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
                Aktualitete shëndetësore
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Informacione të përditësuara mbi shëndetin në Shqipëri dhe risitë në OrariMed.
              </p>
            </motion.div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                Të gjitha
              </button>
              <button className="px-5 py-2 rounded-full bg-secondary text-secondary-foreground font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                Shëndeti në Shqipëri
              </button>
              <button className="px-5 py-2 rounded-full bg-secondary text-secondary-foreground font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                Të rejat nga OrariMed
              </button>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 border border-border/50"
                >
                  <div className="p-6 lg:p-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
                      {article.category}
                    </span>
                    <h2 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                      <Link 
                        to={`/aktualitete/${article.slug}`}
                        className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all"
                      >
                        Lexo më shumë
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 max-w-3xl mx-auto text-center"
            >
              <p className="text-muted-foreground text-sm italic">
                Artikujt janë informues dhe nuk zëvendësojnë këshillën mjekësore profesionale.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AktualitetePage;
