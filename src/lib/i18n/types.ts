export type TranslationKey = {
  nav: {
    home: string;
    specialities: string;
    news: string;
    contact: string;
    login: string;
    register: string;
    account: string;
  };
  hero: {
    h1: string;
    subtitle: string;
    searchDoctor: string;
    imProfessional: string;
    badge: string;
    verifiedDoctors: string;
    booking247: string;
    freeForPatients: string;
    doctorPlaceholder: string;
    cityPlaceholder: string;
  };
  specialities: {
    title: string;
    subtitle: string;
    viewAll: string;
    findButton: string;
    typicalServices: string;
    consultationReasons: string;
    backToSpecialities: string;
    notFound: string;
  };
  whyOrariMed: {
    title: string;
    subtitle: string;
    features: {
      booking: { title: string; description: string };
      local: { title: string; description: string };
      reminders: { title: string; description: string };
      secure: { title: string; description: string };
      cancel: { title: string; description: string };
    };
  };
  security: {
    title: string;
    description: string;
    features: string[];
  };
  professional: {
    title: string;
    subtitle: string;
    cta: string;
    badge: string;
    manageSchedules: string;
    growPatients: string;
    freeRegistration: string;
  };

  professionalsPage: {
    badge: string;
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    benefits: {
      title: string;
      subtitle: string;
      scheduling: { title: string; description: string };
      visibility: { title: string; description: string };
      reminders: { title: string; description: string };
      mobile: { title: string; description: string };
      analytics: { title: string; description: string };
      security: { title: string; description: string };
    };
    howItWorks: {
      title: string;
      subtitle: string;
    };
    steps: {
      register: { title: string; description: string };
      profile: { title: string; description: string };
      schedule: { title: string; description: string };
      receive: { title: string; description: string };
    };
    pricing: {
      title: string;
      subtitle: string;
      recommended: string;
      plan: {
        name: string;
        price: string;
        period: string;
        features: string[];
      };
      cta: string;
    };
    faq: {
      title: string;
      cost: { question: string; answer: string };
      time: { question: string; answer: string };
      cancel: { question: string; answer: string };
      support: { question: string; answer: string };
    };
    finalCta: {
      title: string;
      subtitle: string;
      cta: string;
    };
  };
  footer: {
    description: string;
    quickLinks: string;
    legal: string;
    contact: string;
    rights: string;
    privacy: string;
    terms: string;
    cookies: string;
    faq: string;
    forProfessionals: string;
    aboutUs: string;
    location: string;
  };
  specialityNames: Record<string, string>;
  specialityDescriptions: Record<string, string>;
  consultationReasons: Record<string, string[]>;
  contact: {
    title: string;
    subtitle: string;
    form: {
      title: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
    };
    info: {
      title: string;
      address: string;
      address_label: string;
      phone: string;
      phone_label: string;
      email: string;
      email_label: string;
      hours: {
        title: string;
        weekdays: string;
        weekend: string;
        closed: string;
      };
    };
  };
  auth: {
    login: string;
    loginDescription: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    forgotPassword: string;
    loggingIn: string;
    loginSuccess: string;
    welcomeBack: string;
    error: string;
    invalidCredentials: string;
    orContinueWith: string;
    noAccount: string;
    haveAccount: string;
    createAccount: string;
    creatingAccount: string;
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    confirmPassword: string;
    passwordRequirements: string;
    passwordsDontMatch: string;
    register: string;
    registerDescription: string;
    registrationSuccess: string;
    registrationSuccessMessage: string;
    registrationError: string;
    goBack: string;
  };
  onboarding: {
    step: string;
    of: string;
    personalInfo: string;
    photo: string;
    availability: string;
    // Ajoutez d'autres traductions selon vos besoins
  };
  other: string;

  adminSettings: {
    title: string;
    description: string;
    general: string;
    users: string;
    specialities: string;
    system: string;
    generalSettings: string;
    applicationSettings: string;
    applicationSettingsDescription: string;
    userManagement: string;
    manageUsers: string;
    manageUsersDescription: string;
    specialitiesManagement: string;
    manageSpecialities: string;
    manageSpecialitiesDescription: string;
    systemSettings: string;
    systemConfiguration: string;
    systemConfigurationDescription: string;
  };

  // Common translations used across the app
  common: {
    success: string;
    error: string;
    save: string;
    delete: string;
    cancel: string;
    confirm: string;
    loading: string;
    generate: string;
    saveChanges: string;
  };

  daysOfWeek: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    0: string;
  };
  specialitiesManager: {
    title: string;
    addSpeciality: string;
    addSubSpeciality: string;
    name: string;
    namePlaceholder: string;
    slug: string;
    slugPlaceholder: string;
    status: string;
    active: string;
    inactive: string;
    actions: string;
    saveChanges: string;
    saving: string;
    deleteConfirmation: string;
    noSpecialities: string;
    noSubSpecialities: string;
    subSpecialities: string;
    untitledSpeciality: string;
    slugHelper: string;
    generateSlug: string;
    cannotDeleteLast: string;
    success: {
      saved: string;
      created: string;
      updated: string;
      deleted: string;
    };
    error: {
      save: string;
      delete: string;
      load: string;
    };
  };
};

export type LanguageCode = 'sq' | 'en' | 'fr' | 'de' | 'it' | 'el';
