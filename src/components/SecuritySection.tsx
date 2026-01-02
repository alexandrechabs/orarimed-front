import { motion } from "framer-motion";
import { Shield, Lock, FileCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const SecuritySection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 lg:p-12 border border-border/50"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-hero-gradient flex items-center justify-center glow-accent">
                  <Shield className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {t.security.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t.security.description}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Lock className="w-4 h-4 text-accent" />
                    <span>{t.security.features[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <FileCheck className="w-4 h-4 text-accent" />
                    <span>{t.security.features[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
