import { motion } from "framer-motion";
import { Clock, MapPin, Bell, Shield, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const WhyOrariMedSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Clock,
      key: 'booking' as const,
    },
    {
      icon: MapPin,
      key: 'local' as const,
    },
    {
      icon: Bell,
      key: 'reminders' as const,
    },
    {
      icon: Shield,
      key: 'secure' as const,
    },
    {
      icon: X,
      key: 'cancel' as const,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.whyOrariMed.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.whyOrariMed.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-4 p-6 bg-card rounded-xl card-shadow border border-border/30"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {t.whyOrariMed.features[feature.key].title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t.whyOrariMed.features[feature.key].description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyOrariMedSection;
