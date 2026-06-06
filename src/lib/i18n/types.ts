export type TranslationKey = {
  nav: {
    home: string;
    specialities: string;
    news: string;
    contact: string;
    login: string;
    register: string;
    account: string;
    connected: {
      logout: string;
      dashboard: string;
      calendar: string;
      appointments: string;
      settings: string;
      doctor: string;
      cabinet: string;
      admin: string;
      articles: string;
    };
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
  actualities: {
    title: string;
    subtitle: string;
    disclaimer: string;
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
      plans: {
        name: string;
        price: string;
        period: string;
        features: string[];
        recommended?: boolean;
      }[];
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
    forProfessionals: string;
    location: string;
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      title: string;
      name: string;
      nameRequired: string;
      email: string;
      emailRequired: string;
      phone: string;
      phoneRequired: string;
      subject: string;
      message: string;
      messageRequired: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      success: string;
      successDescription: string;
      error: string;
      errorDescription: string;
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
  doctor: {
    takeAppointment: string;
    openingHours: string;
    practicalInfo: string;
    address: string;
    phone: string;
    specialties: string;
    centers: string;
    about: string;
    pageDescription: string;
    noBiography: string;
    diploma: string;
    noDiploma: string;
    experience: string;
    noExperience: string;
  };
  center: {
    takeAppointment: string;
    openingHours: string;
    practicalInfo: string;
    address: string;
    phone: string;
    doctor: string;
    about: string;
    pageDescription: string;
    noBiography: string;
    centerDoctors: string;
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
    leftTitle: string;
    leftDescription: string;
  };
  forgotPassword: {
    title: string;
    description: string;
    backToLogin: string;
    sending: string;
    valid: string;
    error: string;
    success: string;
    successDescription: string;
    errorDescription: string;
  };
  resetPassword: {
    title: string;
    description: string;
    resend: string;
    codePlaceholder: string;
    emailMissing: string;
    emailError: string;
    codeError: string;
    passwordMinLength: string;
    confirmPasswordRequired: string;
    passwordsNotMatch: string;
    newPassword: string;
    confirmPassword: string;
    sendButton: string;
    sending: string;
    success: string;
    successDescription: string;
    errorDescription: string;
  };
  verifyEmail: {
    title: string;
    description: string;
    leftTitle: string;
    leftDescription: string;
    verifiedTitle: string;
    verifiedDescription: string;
    codePlaceholder: string;
    verifyButton: string;
    verifyLoading: string;
    notReceived: string;
    resendButton: string;
    resendLoading: string;
    successVerify: string;
    errorVerify: string;
    successSend: string;
    errorSend: string;
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
  createRdv: {
    searchPage: {
      viewMoreSlots: string;
      viewLessSlots: string;
      noSlots: string;
      noSlotsShort: string;
      results: string;
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
  stats: {
    today: string;
    waiting: string;
    nextAppointments: string;
    completed: string;
    attendance: string;
    attendanceRate: string;
    absent: string;
    week: string;
    thisWeek: string;
    average: string;
    perDay: string;
    resizePicture: string;
  };
  common: {
    success: string;
    error: string;
    save: string;
    delete: string;
    cancel: string;
    close: string;
    confirm: string;
    loading: string;
    saving: string;
    generate: string;
    saveChanges: string;
    return: string;
    yes: string;
    no: string;
    create: string;
    update: string;
    add: string;
    modify: string;
    activate: string;
    deactivate: string;
    limitReached: string;
    validate: string;
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
  agenda: {
    newConsult: string;
    updateMissing: string;
    updateConsult: string;
    details: string;
    eventDetail: string;
    eventStatus: string;
    status: string;
    eventHistory: string;
    eventNotifications: string;
    mooveTitle: string;
    mooveDescription: string;
    mooveSlot: string;
    form: {
      kind: string;
      consultation: string;
      absence: string;
      reason: string;
      addReason: string;
      chooseReason: string;
      description: string;
      patient: string;
      firstNamePlaceHolder: string;
      lastNamePlaceHolder: string;
      emailPlaceHolder: string;
      phoneNumberPlaceHolder: string;
      allDay: string;
      startDate: string;
      startHour: string;
      endDate: string;
      endHour: string;
      repetition: string;
      repetitionNone: string;
      repetitionDaily: string;
      repetitiondailyWeek: string;
      repetitionWeekly: string;
      repeatUntil: string;
      chooseDate: string;
    };
  };
  dashboard: {
    welcome: string;
    welcomeClient: string;
    welcomeDoctor: string;
    welcomeSecretary: string;
    takeAnAppointment: string;
    nextAppointments: string;
    seeAll: string;
    noOtherNextAppointment: string;
    noNextAppointment: string;
    myDoctors: string;
  };
  params: {
    title: string;
    account: string;
    notifications: string;
    accountTitle: string;
    notificationTitle: string;
    changePicture: string;
    clickToChange: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    speciality: string;
    selectSpeciality: string;
    subSpeciality: string;
    activeNotification: string;
    activeNotificationDetail: string;
    emailNotification: string;
    emailNotificationDetail: string;
    pushNotification: string;
    pushNotificationDetail: string;
    smsNotification: string;
    smsNotificationDetail: string;
    saveSuccess: string;
  };
  doctorParams: {
    title: string;
    openingHours: string;
    consultationReasons: string;
    openingHoursDescription: string;
    consultationReasonsDescription: string;
    openingForm: {
      alert: string;
      title: string;
      day: string;
      timeSlot: string;
      selectTimeSlot: string;
      openingHour: string;
      closingHour: string;
      morning: string;
      afternoon: string;
    };
    openingHoursConfigured: string;
    openingHoursNotConfigured: string;
    orderHoursError: string;
    hoursAlreadyExist: string;
    hoursAlreadyExistTitle: string;
    reasonForm: {
      name: string;
      namePlaceholder: string;
      duration: string;
      color: string;
      type: string;
      consultation: string;
      absence: string;
    };
    reasonTitle: string;
    noReaasons: string;
    minutes: string;
    saveOpeningHour: string;
    saveReason: string;
    reasonInformation: string;
  };
  cabinetParams: {
    title: string;
    noCabinet: string;
    cabinet: string;
    limitedAccessTitle: string;
    limitedAccessTitle2: string;
    limitedAccessTitle3: string;
    admin: string;
    cabinetInfo: string;
    cabinetOpening: string;
    cabinetOpeningDescription: string;
    cabinetDoctor: string;
    cabinetDoctorDescription: string;
    currentDoctors: string;
    addDoctor: string;
    changePhoto: string;
    infoForm: {
      name: string;
      email: string;
      phone: string;
      address: string;
      description: string;
      descriptionPlaceholder: string;
      visible: string;
      active: string;
    };
    successInfo: string;
    errorInfo: string;
    successHours: string;
    doctorList: string;
    addDoctorList: string;
    doctorSearch: {
      maxDoctor: string;
      noDoctorTitle: string;
      noDoctorDescription: string;
      addDoctorDescription: string;
      addDoctorDescription2: string;
      addDoctorDescriptio3: string;
      addDoctorErrorDescription: string;
      searchDoctor: string;
      alreadySelected: string;
      doctorSelected: string;
      addDoctorButton: string;
    };
  };
  adminSettings: {
    title: string;
    description: string;
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
    menu: {
      general: string;
      office: string;
      doctor: string;
      secretary: string;
      specialities: string;
    };
    openingHours: {
      title: string;
      description: string;
    };
    disableAccount: {
      titleDisable: string;
      titleEnable: string;
      descriptionDisable: string;
      descriptionEnable: string;
    };
    office: {
      title: string;
      description: string;
      activateSuccess: string;
      deactivateSuccess: string;
      statusError: string;
      addSuccess: string;
      updateSuccess: string;
      addError: string;
      table: {
        name: string;
        speciality: string;
        activeAccount: string;
        visible: string;
        visibleInfo: string;
        Doctors: string;
        actions: string;
      };
      actions: {
        edit: string;
        seeProfile: string;
        addDoctor: string;
        openingHours: string;
        disable: string;
        enable: string;
      };
      officeForm: {
        newTitle: string;
        editTitle: string;
        name: string;
        email: string;
        phone: string;
        phonePlaceholder: string;
        address: string;
        addressPlaceholder: string;
        description: string;
        descriptionPlaceholder: string;
        speciality: string;
        specialityPlaceholder: string;
        visible: string;
        error: {
          email: string;
          name: string;
          address: string;
          city: string;
          country: string;
          phone: string;
          speciality: string;
        };
      };
      doctorList: {
        title: string;
        description: string;
      };
    };
    doctor: {
      title: string;
      description: string;
      activateSuccess: string;
      deactivateSuccess: string;
      statusError: string;
      imageError: string;
      table: {
        name: string;
        speciality: string;
        activeAccount: string;
        visible: string;
        visibleInfo: string;
        doctors: string;
        actions: string;
      };
      actions: {
        edit: string;
        seeProfile: string;
        openingHours: string;
        consultationReasons: string;
        diplomas: string;
        experiences: string;
        disable: string;
        enable: string;
      };
      addDoctor: {
        title: string;
        titleEdit: string;
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
      diplomas: {
        title: string;
        noDiplomas: string;
        updateSuccess: string;
        updateError: string;
        delete: string;
        deleteError: string;
        existing: string;
        form: {
          diploma: string;
          diplomaPlaceholder: string;
          university: string;
          universityPlaceholder: string;
          year: string;
          speciality: string;
          specialityPlaceholder: string;
        };
      };
      experiences: {
        title: string;
        noExperiences: string;
        saveSuccess: string;
        saveError: string;
        updateSuccess: string;
        deleteSuccess: string;
        deleteError: string;
        existing: string;
        form: {
          company: string;
          companyPlaceholder: string;
          startYear: string;
          endYear: string;
          description: string;
          descriptionPlaceholder: string;
        };
      };
      consultationReason: {
        title: string;
        description: string;
      };
    };
    secretary: {
      title: string;
      addSuccess: string;
      updateSuccess: string;
      addError: string;
      form: {
        firstname: string;
        firstnamePlaceholder: string;
        lastname: string;
        lastnamePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        phone: string;
        phonePlaceholder: string;
        language: string;
        languePlaceholder: string;
        conditions: string;
      };
    };
    speciality: {
      specialityError: string;
    };
  };
  picture: {
    download: string;
    addProfile: string;
    professional: string;
    load: string;
    resolutionError: string;
    sizeError: string;
    typeError: string;
    put: string;
    dragAndDrop: string;
    formatAndSize: string;
  };
};

export type LanguageCode = "sq" | "en" | "fr" | "de" | "it" | "el";
