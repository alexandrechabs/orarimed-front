import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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
                <form className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t.contact.form.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder={t.contact.form.name}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t.contact.form.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="email@gmail.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t.contact.form.message}
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder={t.contact.form.messagePlaceholder}
                      required
                    ></textarea>
                  </div>
                  <Button size="lg" variant="hero" className="w-full">
                    <Send className="w-5 h-5" />
                    {t.contact.form.submit}
                  </Button>
                </form>
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
                      <h3 className="font-semibold text-foreground mb-1">
                        {t.contact.info.address_label}
                      </h3>
                      <p className="text-muted-foreground">
                        {t.contact.info.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t.contact.info.phone_label}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t.contact.info.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">
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
    </div>
  );
};

export default KontaktPage;
