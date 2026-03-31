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
    noResults: string;
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
    specialities: string;
    system: string;
    generalSettings: string;
    applicationSettings: string;
    applicationSettingsDescription: string;
    specialitiesManagement: string;
    manageSpecialities: string;
    manageSpecialitiesDescription: string;
    systemSettings: string;
    systemConfiguration: string;
    systemConfigurationDescription: string;
    addDoctor: {
      title: string;
      form: {
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
        password: string;
        speciality: string;
        submit: string;
        cancel: string;
      };
      success: string;
      error: string;
    };
  };
  createRdv: {
    searchPage: {
      viewMoreSlots: string;
      viewLessSlots: string;
      noSlots: string;
      noSlotsShort: string;
    };
    appointmentPage: {
      title: string;
      step1: string;
      step2: string;
      step3: string;
      continue: string;
      validate: string;
      confirm: string;
      duration: string;
      step2Title: string;
      step2Description: string;
      step3Title: string;
      step3Doctor: string;
      kindRdv: string;
      minute: string;
      time: string;
      confirmationMessage: string;
      goHome: string;
      viewRdv: string;
      importantInfo: string;
      cancelInfo: string;
      reminderInfo: string;
      lateInfo: string;
    };
  };

  appointments: {
    title: string;
    description: string;
    newAppointment: string;
    searchPlaceholder: string;
    noAppointments: string;
    noAppointmentsDescription: string;
    duration: string;
    minute: string;
    cancel: string;
    cancelConfirmTitle: string;
    cancelConfirm: string;
    status: {
      upcoming: string;
      completed: string;
      cancelled: string;
    };
    filters: {
      all: string;
      upcoming: string;
      completed: string;
      cancelled: string;
    };
  };
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
    return: string;
    yes: string;
    no: string;
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
  event: {
    status: {
      created: string;
      waiting: string;
      consultation: string;
      finished: string;
      abort: string;
      abortExcused: string;
    };
    type: {
      mail_appointment_reminder: string;
      mail_appointment_cancellation: string;
      mail_appointment_cancellation_doctor: string;
      mail_appointment_confirmation: string;
      mail_appointment_reschedule: string;
      mail_center_invitation: string;
    };
  };
};

export type LanguageCode = 'sq' | 'en' | 'fr' | 'de' | 'it' | 'el';
