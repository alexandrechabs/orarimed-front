import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPage = () => {
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
                Politique de confidentialité
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Protection de vos données personnelles
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                OrariMed s’engage à respecter votre vie privée et à protéger vos
                informations personnelles lorsque vous utilisez notre
                plateforme.
              </p>
            </motion.div>

            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  1. Données collectées
                </h2>
                <p className="text-muted-foreground leading-8">
                  Nous collectons uniquement les données nécessaires pour offrir
                  un service de prise de rendez-vous médical fiable : nom,
                  email, téléphone, informations de connexion, ainsi que les
                  données liées à vos demandes de rendez-vous et à vos
                  consultations.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  2. Finalités du traitement
                </h2>
                <p className="text-muted-foreground leading-8">
                  Vos données sont utilisées pour :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-8">
                  <li>gérer vos réservations et rendez-vous,</li>
                  <li>communiquer avec vous au sujet de vos consultations,</li>
                  <li>améliorer le service et la qualité de la plateforme,</li>
                  <li>respecter les obligations légales et de sécurité.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  3. Durée de conservation
                </h2>
                <p className="text-muted-foreground leading-8">
                  Nous conservons vos informations aussi longtemps que
                  nécessaire pour fournir nos services ou pour respecter nos
                  obligations légales. Lorsque les données ne sont plus
                  nécessaires, elles sont supprimées ou rendues anonymes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  4. Cookies et technologies similaires
                </h2>
                <p className="text-muted-foreground leading-8">
                  Nous utilisons des cookies et des technologies similaires pour
                  garantir le fonctionnement du site, améliorer l’expérience
                  utilisateur et analyser l’usage de la plateforme. Vous pouvez
                  gérer vos préférences de cookies dans votre navigateur.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  5. Sécurité
                </h2>
                <p className="text-muted-foreground leading-8">
                  Vos données sont protégées par des mesures de sécurité
                  techniques et organisationnelles appropriées. Nous utilisons
                  des connexions sécurisées et limitons l’accès aux informations
                  seules aux personnes autorisées.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  6. Vos droits
                </h2>
                <p className="text-muted-foreground leading-8">
                  Vous pouvez demander l’accès, la rectification, la suppression
                  ou la limitation du traitement de vos données personnelles.
                  Pour exercer ces droits, contactez-nous à l’adresse email
                  indiquée dans le pied de page.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  7. Contact
                </h2>
                <p className="text-muted-foreground leading-8">
                  Pour toute question relative à cette politique de
                  confidentialité, veuillez nous contacter à :
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

export default PrivacyPage;
