import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useEffect, useState } from "react";
import { ArticleTranslation } from "@/types/article";

const API_URL = import.meta.env.VITE_API_URL;

const Actualities = () => {
  const { t, language } = useLanguage();
  // get locale in query ?locale=x
  const [searchParams] = useSearchParams();
  const locale = searchParams.get("locale");
  const [articles, setArticles] = useState<ArticleTranslation[]>([]);

  // get articles from API
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await fetch(
          `${API_URL}/articles?locale=${locale ? locale : language}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!res.ok) throw new Error("Failed to fetch articles");
        const result = await res.json();
        setArticles(result.data);
      } catch (err) {
        console.error("Error loading articles:", err);
      }
    };
    loadArticles();
  }, [locale, language]);
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
                {t.actualities.title}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t.actualities.subtitle}
              </p>
            </motion.div>

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
                      {article.category.translations[0]?.name}
                    </span>
                    <h2 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    -
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar className="w-3 h-3" />
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : "-"}
                      </span>
                      <Link
                        to={`/actualities/${locale ? locale : language}/${article.slug}`}
                        className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all"
                      >
                        {t.actualities.readMore}
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
                {t.actualities.disclaimer}
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Actualities;
