import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ContactForm } from '@/components/ContactForm';

const KontaktPage = () => {
  const { t } = useLanguage();

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
                {t.contact.title}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t.contact.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Formulaire de contact */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-8 card-shadow border border-border/50"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  {t.contact.form.title}
                </h2>
                <ContactForm />
              </motion.div>

              {/* Informations de contact */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    {t.contact.info.title}
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-accent">
                        {t.contact.info.address_label}
                      </h3>
                      <p className="text-muted-foreground">
                        {t.contact.info.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-accent">
                        {t.contact.info.phone_label}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t.contact.info.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-accent">
                        {t.contact.info.email_label}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t.contact.info.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-border/30">
                    <h3 className="font-display font-semibold text-foreground mb-2">
                      {t.contact.info.hours.title}
                    </h3>
                    <p>{t.contact.info.hours.weekdays}</p>
                    <p>{t.contact.info.hours.weekend}</p>
                    <p className="text-foreground/60">
                      {t.contact.info.hours.closed}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div >
  );
};

export default KontaktPage;
