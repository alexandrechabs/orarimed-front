import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CookiesPage = () => {
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
              <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">
                Cookies
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Gestion des cookies sur OrariMed
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Nous utilisons des cookies pour améliorer votre expérience et
                assurer le bon fonctionnement de la plateforme.
              </p>
            </motion.div>

            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  1. Que sont les cookies ?
                </h2>
                <p className="text-muted-foreground leading-8">
                  Les cookies sont de petits fichiers déposés sur votre appareil
                  lorsque vous visitez un site. Ils nous aident à mémoriser vos
                  préférences et à analyser l’usage de notre service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  2. Pourquoi nous utilisons des cookies
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-8">
                  <li>
                    pour assurer le fonctionnement des fonctionnalités du site,
                  </li>
                  <li>pour mémoriser vos choix de langue et de session,</li>
                  <li>
                    pour analyser l’utilisation du site et améliorer nos
                    services,
                  </li>
                  <li>pour garantir une navigation fluide et sécurisée.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  3. Types de cookies utilisés
                </h2>
                <div className="space-y-4 text-muted-foreground leading-8">
                  <p>
                    <strong>Cookies strictement nécessaires :</strong>{" "}
                    indispensables pour le fonctionnement du site.
                  </p>
                  <p>
                    <strong>Cookies de performance :</strong> utilisés pour
                    analyser l’utilisation du site et en améliorer les
                    performances.
                  </p>
                  <p>
                    <strong>Cookies fonctionnels :</strong> permettent de
                    mémoriser vos préférences et d’optimiser l’expérience
                    utilisateur.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  4. Gestion des cookies
                </h2>
                <p className="text-muted-foreground leading-8">
                  Vous pouvez configurer votre navigateur pour accepter ou
                  refuser les cookies. Attention : certaines fonctionnalités
                  peuvent être limitées si vous bloquez les cookies essentiels.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  5. Contact
                </h2>
                <p className="text-muted-foreground leading-8">
                  Si vous avez des questions concernant notre politique de
                  cookies, contactez-nous à :
                </p>
                <p className="text-muted-foreground font-medium">
                  contact@orarimed.com
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPage;
