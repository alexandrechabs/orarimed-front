import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const KontaktPage = () => {
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
                Na kontaktoni
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Keni pyetje? Jemi këtu për t'ju ndihmuar.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-8 card-shadow border border-border/50"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Dërgoni një mesazh
                </h2>
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Emri i plotë
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Emri juaj"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="email@shembull.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mesazhi
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder="Si mund t'ju ndihmojmë?"
                    />
                  </div>
                  <Button size="lg" variant="hero" className="w-full">
                    <Send className="w-5 h-5" />
                    Dërgo mesazhin
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Informacione kontakti
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <p className="text-muted-foreground">kontakt@orarimed.al</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Telefon</h3>
                        <p className="text-muted-foreground">+355 69 XXX XXXX</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Adresa</h3>
                        <p className="text-muted-foreground">Tiranë, Shqipëri</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-border/30">
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    Orari i punës
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    E hënë - E premte: 09:00 - 18:00<br />
                    E shtunë: 10:00 - 14:00<br />
                    E diel: Mbyllur
                  </p>
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
