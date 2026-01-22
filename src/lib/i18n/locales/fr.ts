import { TranslationKey } from '../types';

const fr: TranslationKey = {
  nav: {
    home: 'Accueil',
    specialities: 'Spécialités',
    news: 'Actualités',
    contact: 'Contact',
    login: 'Connexion',
    register: "S'inscrire",
    account: 'Mon compte',
  },
  hero: {
    h1: 'Trouvez et réservez votre rendez-vous médical en Albanie, en ligne',
    subtitle:
      'Prenez rendez-vous avec des médecins, dentistes et laboratoires en quelques clics. Médecins vérifiés, disponibilité en temps réel.',
    searchDoctor: 'Chercher un médecin',
    imProfessional: 'Je suis professionnel de santé',
    badge: '🏥 Plateforme de rendez-vous médicaux en Albanie',
    verifiedDoctors: 'Médecins vérifiés',
    booking247: 'Réservation 24h/24',
    freeForPatients: 'Gratuit pour les patients',
  },
  specialities: {
    title: 'Spécialités',
    subtitle: 'Trouvez des médecins spécialisés pour chaque besoin de santé',
    viewAll: 'Voir toutes les spécialités',
    findButton: 'Trouver',
    typicalServices: 'Services typiques',
    consultationReasons: 'Principaux motifs de consultation',
    backToSpecialities: 'Toutes les spécialités',
    notFound: 'Spécialité non trouvée',
  },
  whyOrariMed: {
    title: 'Pourquoi OrariMed ?',
    subtitle:
      'Simple, rapide et sécurisé — voilà comment devrait être la réservation médicale',
    features: {
      booking: {
        title: 'Réservation rapide, 24h/24',
        description: 'Réservez à tout moment, même la nuit ou le week-end.',
      },
      local: {
        title: 'Focus local',
        description: "Médecins vérifiés dans toute l'Albanie.",
      },
      reminders: {
        title: 'Rappels automatiques',
        description:
          'Recevez des notifications pour vos rendez-vous par SMS ou email.',
      },
      secure: {
        title: 'Données sécurisées',
        description:
          'Vos informations sont stockées de manière confidentielle et sécurisée.',
      },
      cancel: {
        title: 'Annulation facile',
        description: 'Annulez ou reprogrammez sans problème.',
      },
    },
  },
  security: {
    title: 'Sécurité & Confidentialité',
    description:
      'OrariMed respecte les normes les plus élevées de sécurité des données de santé. Toutes les informations sont stockées et traitées de manière sécurisée, conformément à la législation en vigueur.',
    features: ['Cryptage SSL', 'Conforme RGPD', 'Données sécurisées'],
  },
  professional: {
    title: 'Vous êtes médecin, dentiste ou laboratoire ?',
    subtitle:
      'Augmentez votre visibilité et gérez vos horaires numériquement. Rejoignez les professionnels qui utilisent OrariMed.',
    cta: "S'inscrire comme professionnel",
    badge: 'Pour les professionnels de santé',
    manageSchedules: 'Gérer les horaires en ligne',
    growPatients: 'Augmenter le nombre de patients',
    freeRegistration: 'Inscription gratuite',
  },
  footer: {
    description:
      'La plateforme de rendez-vous médicaux en ligne en Albanie. Prenez rendez-vous avec des médecins vérifiés en quelques clics.',
    quickLinks: 'Liens rapides',
    legal: 'Légal',
    contact: 'Contact',
    rights: 'Tous droits réservés',
    privacy: 'Politique de confidentialité',
    terms: "Conditions d'utilisation",
    cookies: 'Cookies',
    faq: 'FAQ',
    forProfessionals: 'Pour les professionnels',
    aboutUs: "À propos d'OrariMed",
    location: 'Albanie',
  },
  specialityNames: {
    'mjek-pergjithshem': 'Médecin généraliste',
    kardiologji: 'Cardiologie',
    dermatologji: 'Dermatologie',
    pediatri: 'Pédiatrie',
    gjinekologji: 'Obstétrique & Gynécologie',
    ortopedi: 'Orthopédie',
    psikiatri: 'Psychiatrie & Psychologie',
    gastroenterologji: 'Gastro-entérologie',
    orl: 'ORL',
    urologji: 'Urologie',
    dentiste: 'Dentiste',
    laboratore: 'Laboratoire',
  },
  specialityDescriptions: {
    'mjek-pergjithshem':
      'Le médecin généraliste est le premier point de contact pour les problèmes de santé quotidiens.',
    kardiologji:
      'Prenez rendez-vous avec des cardiologues spécialisés pour le soin du cœur.',
    dermatologji:
      'Pour le soin de la peau, des cheveux et des ongles, trouvez des dermatologues vérifiés.',
    pediatri: 'Soins de santé pour nourrissons, enfants et adolescents.',
    gjinekologji:
      'Réservez des contrôles de routine, suivis de grossesse et consultations gynécologiques.',
    ortopedi: 'Traitement des problèmes osseux, articulaires et musculaires.',
    psikiatri:
      'Soutien professionnel pour la santé mentale et le bien-être émotionnel.',
    gastroenterologji: 'Pour les problèmes digestifs et examens diagnostiques.',
    orl: "Traitement de l'audition, de la respiration et des infections des voies respiratoires supérieures.",
    urologji: 'Soins pour la santé urinaire et reproductive.',
    dentiste:
      'Trouvez des dentistes pour contrôles, traitements, urgences dentaires et esthétique buccale.',
    laboratore:
      'Réservez des rendez-vous pour des analyses médicales dans des laboratoires certifiés.',
  },
  consultationReasons: {
    'mjek-pergjithshem': [
      'Maux de tête',
      'Grippe et rhume',
      'Fatigue chronique',
      'Mal de dos',
      'Bilan de santé',
      'Certificat médical',
      'Vaccination',
      'Conseil santé',
    ],
    kardiologji: [
      'Douleur thoracique',
      'Essoufflement',
      'Palpitations',
      'Hypertension',
      'Bilan cardiaque annuel',
      'Interprétation ECG',
      'Œdème des jambes',
    ],
    dermatologji: [
      'Acné',
      'Eczéma',
      'Psoriasis',
      'Grain de beauté suspect',
      'Chute de cheveux',
      'Mycose',
      'Allergies cutanées',
      'Herpès',
    ],
    pediatri: [
      'Visite de routine enfant',
      'Vaccination',
      'Fièvre',
      'Toux et grippe',
      'Mal de ventre',
      'Suivi de croissance',
      'Allergies alimentaires',
      'Otite',
    ],
    gjinekologji: [
      'Contrôle de routine',
      'Frottis',
      'Suivi de grossesse',
      'Troubles menstruels',
      'Contraception',
      'Ménopause',
      'Infections vaginales',
      'Échographie pelvienne',
    ],
    ortopedi: [
      'Douleur au genou',
      'Mal de dos',
      'Rupture de ligament',
      'Fracture',
      'Arthrite',
      'Tendinite',
      'Scoliose',
      "Douleur à l'épaule",
    ],
    psikiatri: [
      'Anxiété',
      'Dépression',
      'Stress chronique',
      'Insomnie',
      'Crises de panique',
      'Trauma',
      "Troubles de l'humeur",
      'Thérapie de couple',
    ],
    gastroenterologji: [
      'Douleur abdominale',
      'Reflux gastrique',
      'Constipation',
      'Diarrhée chronique',
      'Syndrome du côlon irritable',
      'Coloscopie',
      'Gastroscopie',
      'Hémorroïdes',
    ],
    orl: [
      'Mal de gorge',
      'Nez bouché',
      "Perte d'audition",
      'Acouphènes',
      'Sinusite',
      'Angine',
      'Vertiges',
      'Otite',
    ],
    urologji: [
      'Infection urinaire',
      'Calculs rénaux',
      'Problèmes de prostate',
      'Incontinence',
      'Dysfonction érectile',
      'Bilan urologique',
      "Analyse d'urine",
    ],
    dentiste: [
      'Rage de dents',
      'Contrôle régulier',
      'Détartrage',
      'Plombage',
      'Extraction dentaire',
      'Blanchiment',
      'Appareil orthodontique',
      'Implants dentaires',
    ],
    laboratore: [
      'Analyses de sang',
      'Bilan lipidique',
      'Glycémie',
      'Bilan hormonal',
      'Test thyroïdien',
      "Analyse d'urine",
      'Tests allergiques',
      'Marqueurs tumoraux',
    ],
  },
  contact: {
    title: 'Contactez-nous',
    subtitle: 'Des questions ? Nous sommes là pour vous aider.',
    form: {
      title: 'Envoyer un message',
      name: 'Nom complet',
      email: 'Adresse email',
      subject: 'Sujet',
      message: 'Votre message',
      messagePlaceholder: 'Comment pouvons-nous vous aider ?',
      submit: 'Envoyer un message',
      sending: 'Envoi en cours...',
      success: 'Message envoyé avec succès !',
      error: 'Une erreur est survenue. Veuillez réessayer.',
    },
    info: {
      title: 'Coordonnées',
      address: 'Rr. Deshmoret e Kombit, Tirana, Albanie',
      address_label: 'Adresse',
      phone: '+355 4X XXX XXXX',
      phone_label: 'Téléphone',
      email: 'info@orarimed.al',
      email_label: 'Email',
      hours: {
        title: "Heures d'ouverture",
        weekdays: 'Lundi - Vendredi: 08:00 - 20:00',
        weekend: 'Samedi: 09:00 - 15:00',
        closed: 'Dimanche: Fermé',
      },
    },
  },
  professionalsPage: {
    badge: 'Pour les professionnels de santé',
    hero: {
      title: 'Rejoignez OrariMed en tant que professionnel de santé',
      subtitle:
        'Gérez vos horaires, augmentez votre visibilité et accueillez plus de patients. Notre plateforme est conçue pour simplifier votre travail quotidien.',
      cta: 'Créez votre compte',
    },
    benefits: {
      title: 'Avantages pour les professionnels',
      subtitle:
        'Découvrez pourquoi des centaines de professionnels de santé ont choisi OrariMed',
      scheduling: {
        title: 'Gestion facile des horaires',
        description:
          'Créez, modifiez et gérez les rendez-vous en ligne facilement.',
      },
      visibility: {
        title: 'Visibilité accrue',
        description:
          'Devenez visible pour de nouveaux patients sur notre plateforme.',
      },
      reminders: {
        title: 'Rappels automatiques',
        description:
          'Les patients reçoivent des notifications automatiques pour leurs rendez-vous.',
      },
      mobile: {
        title: 'Accès mobile',
        description: "Gérez votre cabinet depuis n'importe quel appareil.",
      },
      analytics: {
        title: 'Statistiques et rapports',
        description: 'Suivez les performances avec des rapports détaillés.',
      },
      security: {
        title: 'Sécurité maximale',
        description: 'Données stockées avec cryptage SSL et conformes au RGPD.',
      },
    },
    howItWorks: {
      title: 'Comment ça marche ?',
      subtitle: 'En quatre étapes simples',
    },
    steps: {
      register: {
        title: 'Inscrivez-vous',
        description: 'Créez votre compte gratuit en quelques minutes.',
      },
      profile: {
        title: 'Complétez votre profil',
        description:
          'Ajoutez votre spécialité, adresse et informations professionnelles.',
      },
      schedule: {
        title: 'Définissez vos horaires',
        description:
          'Indiquez les jours et heures où vous recevez des patients.',
      },
      receive: {
        title: 'Recevez des réservations',
        description: 'Les patients réservent directement depuis la plateforme.',
      },
    },
    pricing: {
      title: 'Nos tarifs',
      subtitle: 'Commencer est gratuit et sans engagement',
      recommended: 'Recommandé',
      plan: {
        name: 'Plan Professionnel',
        price: 'Gratuit',
        period: 'pour commencer',
        features: [
          'Profil professionnel complet',
          'Calendrier en ligne 24h/24',
          'Rappels automatiques pour les patients',
          'Statistiques de base',
          'Support prioritaire',
          'Aucune commission sur les réservations',
        ],
      },
      cta: 'Commencer gratuitement',
    },
    faq: {
      title: 'Questions fréquentes',
      cost: {
        question: "Combien coûte l'inscription ?",
        answer:
          "L'inscription est entièrement gratuite. Vous pouvez commencer immédiatement sans aucun coût.",
      },
      time: {
        question: 'Combien de temps faut-il pour créer un compte ?',
        answer:
          "Le processus d'inscription prend environ 5 minutes. Une fois vérifié, vous pouvez accepter des réservations immédiatement.",
      },
      cancel: {
        question: 'Puis-je annuler à tout moment ?',
        answer:
          'Oui, vous pouvez annuler votre compte à tout moment sans pénalité.',
      },
      support: {
        question: 'Y a-t-il un support dédié ?',
        answer:
          'Oui, notre équipe est disponible pour vous aider avec toutes vos questions ou problèmes.',
      },
    },
    finalCta: {
      title: 'Prêt à commencer ?',
      subtitle:
        'Rejoignez les professionnels qui transforment la gestion des rendez-vous médicaux.',
      cta: 'Créer un compte',
    },
  },
  other: 'Autre',

  // Common translations used across the app
  common: {
    success: 'Succès',
    error: 'Erreur',
    save: 'Enregistrer',
    delete: 'Supprimer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    loading: 'Chargement...',
    generate: 'Générer',
    saveChanges: 'Enregistrer les modifications',
  },

  adminSettings: {
    title: 'Administration',
    description: "Gérez les paramètres et configurations de l'application",
    general: 'Général',
    users: 'Utilisateurs',
    specialities: 'Spécialités',
    system: 'Système',
    generalSettings: 'Paramètres généraux',
    applicationSettings: "Paramètres de l'application",
    applicationSettingsDescription:
      "Configurez les paramètres généraux de l'application",
    userManagement: 'Gestion des utilisateurs',
    manageUsers: 'Gérer les utilisateurs',
    manageUsersDescription:
      'Affichez et gérez les comptes utilisateurs et les permissions',
    specialitiesManagement: 'Gestion des spécialités',
    manageSpecialities: 'Gérer les spécialités',
    manageSpecialitiesDescription:
      'Gérez les spécialités médicales et sous-spécialités',
    systemSettings: 'Paramètres système',
    systemConfiguration: 'Configuration système',
    systemConfigurationDescription:
      'Configurez les paramètres système et la maintenance',
  },
  specialitiesManager: {
    title: 'Gestion des spécialités',
    addSpeciality: 'Ajouter une spécialité',
    addSubSpeciality: 'Ajouter',
    name: 'Nom',
    namePlaceholder: 'Ex: Cardiologie',
    slug: 'Slug',
    slugPlaceholder: 'Ex: cardiologie',
    status: 'Statut',
    active: 'Actif',
    inactive: 'Inactif',
    actions: 'Actions',
    saveChanges: 'Enregistrer les modifications',
    saving: 'Enregistrement...',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer cette spécialité ?',
    noSpecialities: 'Aucune spécialité pour le moment',
    noSubSpecialities: 'Aucune sous-spécialité pour le moment',
    subSpecialities: 'Sous-spécialités',
    untitledSpeciality: 'Nouvelle spécialité',
    slugHelper: "Version URL du nom. En minuscules, tirets au lieu d'espaces.",
    generateSlug: 'Générer le slug',
    cannotDeleteLast: 'Impossible de supprimer la dernière spécialité',
    success: {
      saved: 'Les modifications ont été enregistrées avec succès',
      created: 'Spécialité créée avec succès',
      updated: 'Spécialité mise à jour avec succès',
      deleted: 'Spécialité supprimée avec succès',
    },
    error: {
      save: "Erreur lors de l'enregistrement des modifications",
      delete: 'Erreur lors de la suppression de la spécialité',
      load: 'Erreur lors du chargement des spécialités',
    },
  },
  auth: {
    login: 'Connexion',
    loginDescription:
      'Connectez-vous à votre compte pour accéder à votre espace personnel',
    email: 'Adresse email',
    emailPlaceholder: 'votre@email.com',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié',
    loggingIn: 'Connexion en cours...',
    loginSuccess: 'Connexion réussie',
    welcomeBack: 'Content de vous revoir !',
    error: 'Erreur',
    invalidCredentials: 'Email ou mot de passe incorrect',
    orContinueWith: 'Ou continuez avec',
    noAccount: "Vous n'avez pas de compte ?",
    createAccount: 'Créer un compte',
    creatingAccount: 'Création du compte...',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Votre prénom',
    lastName: 'Nom',
    lastNamePlaceholder: 'Votre nom',
    confirmPassword: 'Confirmer le mot de passe',
    passwordRequirements:
      '8 caractères minimum, avec des lettres et des chiffres',
    passwordsDontMatch: 'Les mots de passe ne correspondent pas',
    register: 'Inscription',
    registerDescription:
      'Créez un compte pour accéder à votre espace personnel',
    registrationSuccess: 'Inscription réussie',
    registrationSuccessMessage: 'Votre compte a été créé avec succès !',
    registrationError: 'Une erreur est survenue lors de la création du compte',
    haveAccount: 'Vous avez déjà un compte ?',
    goBack: 'Retour',
  },
  onboarding: {
    step: 'Étape',
    of: 'sur',
    personalInfo: 'Informations professionnelles',
    availability: 'Disponibilités',
    // Ajoutez d'autres traductions selon vos besoins
  },
};

export default fr;
