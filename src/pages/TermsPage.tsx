import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsPage = () => {
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
                Conditions d'utilisation
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Conditions générales d'utilisation d'OrariMed
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Ces conditions définissent l’usage de la plateforme OrariMed et
                les engagements de l’utilisateur et du service.
              </p>
            </motion.div>

            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  1. Objet
                </h2>
                <p className="text-muted-foreground leading-8">
                  OrariMed met à votre disposition un service de prise de
                  rendez-vous médicaux en ligne. L’accès au site implique
                  l’acceptation de ces conditions d’utilisation.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  2. Accès et inscription
                </h2>
                <p className="text-muted-foreground leading-8">
                  L’accès aux fonctionnalités de réservation est soumis à la
                  création d’un compte et à l’acceptation des présentes
                  conditions. Vous vous engagez à fournir des informations
                  exactes et mises à jour.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  3. Comportement de l’utilisateur
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-8">
                  <li>
                    Vous acceptez d’utiliser le service de manière loyale et
                    conforme à la loi;
                  </li>
                  <li>
                    Vous n’utiliserez pas le site pour des activités
                    frauduleuses ou abusives;
                  </li>
                  <li>
                    Vous respecterez la confidentialité des données de vos
                    rendez-vous et des professionnels.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  4. Contenu et responsabilité
                </h2>
                <p className="text-muted-foreground leading-8">
                  OrariMed fournit des informations sur les professionnels et
                  les centres. Nous nous efforçons de garantir leur exactitude,
                  mais nous ne pouvons pas garantir l’absence d’erreurs. La
                  prise de rendez-vous reste une relation entre le patient et le
                  professionnel de santé.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  5. Propriété intellectuelle
                </h2>
                <p className="text-muted-foreground leading-8">
                  L’ensemble des contenus publiés sur OrariMed (textes, logos,
                  images, graphismes) est protégé par le droit d’auteur. Toute
                  reproduction non autorisée est interdite.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  6. Modification des conditions
                </h2>
                <p className="text-muted-foreground leading-8">
                  OrariMed se réserve le droit de modifier ces conditions
                  d’utilisation à tout moment. Les modifications prennent effet
                  dès leur publication sur le site.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  7. Contact
                </h2>
                <p className="text-muted-foreground leading-8">
                  Pour toute question sur ces conditions, contactez-nous à :
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

export default TermsPage;
