import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  UserPlus,
  Calendar,
  TrendingUp,
  Clock,
  Shield,
  Smartphone,
  CheckCircle,
  Users,
  BarChart3,
  Bell,
  CreditCard,
  HeartHandshake,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ProfessionalPage = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Calendar,
      title: t.professionalsPage.benefits.scheduling.title,
      description: t.professionalsPage.benefits.scheduling.description,
    },
    {
      icon: Users,
      title: t.professionalsPage.benefits.visibility.title,
      description: t.professionalsPage.benefits.visibility.description,
    },
    {
      icon: Bell,
      title: t.professionalsPage.benefits.reminders.title,
      description: t.professionalsPage.benefits.reminders.description,
    },
    {
      icon: Smartphone,
      title: t.professionalsPage.benefits.mobile.title,
      description: t.professionalsPage.benefits.mobile.description,
    },
    {
      icon: BarChart3,
      title: t.professionalsPage.benefits.analytics.title,
      description: t.professionalsPage.benefits.analytics.description,
    },
    {
      icon: Shield,
      title: t.professionalsPage.benefits.security.title,
      description: t.professionalsPage.benefits.security.description,
    },
  ];

  const steps = [
    {
      number: '1',
      title: t.professionalsPage.steps.register.title,
      description: t.professionalsPage.steps.register.description,
    },
    {
      number: '2',
      title: t.professionalsPage.steps.profile.title,
      description: t.professionalsPage.steps.profile.description,
    },
    {
      number: '3',
      title: t.professionalsPage.steps.schedule.title,
      description: t.professionalsPage.steps.schedule.description,
    },
    {
      number: '4',
      title: t.professionalsPage.steps.receive.title,
      description: t.professionalsPage.steps.receive.description,
    },
  ];

  const faqs = [
    {
      question: t.professionalsPage.faq.cost.question,
      answer: t.professionalsPage.faq.cost.answer,
    },
    {
      question: t.professionalsPage.faq.time.question,
      answer: t.professionalsPage.faq.time.answer,
    },
    {
      question: t.professionalsPage.faq.cancel.question,
      answer: t.professionalsPage.faq.cancel.answer,
    },
    {
      question: t.professionalsPage.faq.support.question,
      answer: t.professionalsPage.faq.support.answer,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-hero-gradient">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 text-sm font-medium mb-6">
                {t.professionalsPage.badge}
              </span>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                {t.professionalsPage.hero.title}
              </h1>

              <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                {t.professionalsPage.hero.subtitle}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl"
                  asChild
                >
                  <Link to="/contact">
                    <UserPlus className="w-5 h-5" />
                    {t.professionalsPage.hero.cta}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.professionalsPage.benefits.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.professionalsPage.benefits.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.professionalsPage.howItWorks.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.professionalsPage.howItWorks.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.professionalsPage.pricing.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.professionalsPage.pricing.subtitle}
            </p>
          </motion.div>

          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="border-primary shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {t.professionalsPage.pricing.recommended}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {t.professionalsPage.pricing.plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {t.professionalsPage.pricing.plan.price}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {t.professionalsPage.pricing.plan.period}
                  </p>

                  <ul className="space-y-3 text-left mb-8">
                    {t.professionalsPage.pricing.plan.features.map(
                      (feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      )
                    )}
                  </ul>

                  <Button size="xl" className="w-full" asChild>
                    <Link to="/contact">
                      <UserPlus className="w-5 h-5" />
                      {t.professionalsPage.pricing.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.professionalsPage.faq.title}
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28 bg-hero-gradient">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <HeartHandshake className="w-16 h-16 text-primary-foreground/80 mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              {t.professionalsPage.finalCta.title}
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              {t.professionalsPage.finalCta.subtitle}
            </p>
            <Button
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl"
              asChild
            >
              <Link to="/contact">
                <UserPlus className="w-5 h-5" />
                {t.professionalsPage.finalCta.cta}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfessionalPage;
