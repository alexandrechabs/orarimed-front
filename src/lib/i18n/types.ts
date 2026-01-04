export type TranslationKey = {
  nav: {
    home: string;
    specialties: string;
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
  };
  specialties: {
    title: string;
    subtitle: string;
    viewAll: string;
    findButton: string;
    typicalServices: string;
    consultationReasons: string;
    backToSpecialties: string;
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
  specialtyNames: Record<string, string>;
  specialtyDescriptions: Record<string, string>;
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
  other: string;
};

export type LanguageCode = 'sq' | 'en' | 'fr' | 'de' | 'it' | 'el';
