export type Language = 'sq' | 'en' | 'fr' | 'de' | 'it' | 'el';

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
];

export const translations: Record<Language, {
  nav: {
    home: string;
    specialties: string;
    news: string;
    contact: string;
    login: string;
    register: string;
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
  other: string;
}> = {
  sq: {
    nav: {
      home: 'Kryefaqja',
      specialties: 'Specialitetet',
      news: 'Aktualitete',
      contact: 'Kontakt',
      login: 'Hyr',
      register: 'Regjistrohu',
    },
    hero: {
      h1: 'Gjej dhe rezervo takimin tënd mjekësor në Shqipëri, online',
      subtitle: 'Rezervo një takim me mjekë, dentistë dhe laboratorë analizash në pak klikime. Mjekë të verifikuar, disponueshmëri në kohë reale.',
      searchDoctor: 'Kërko një mjek',
      imProfessional: 'Jam profesionist shëndetësor',
      badge: '🏥 Platforma e takimeve mjekësore në Shqipëri',
      verifiedDoctors: 'Mjekë të verifikuar',
      booking247: 'Rezervim 24/7',
      freeForPatients: 'Falas për pacientët',
    },
    specialties: {
      title: 'Specialitetet',
      subtitle: 'Gjeni mjekë të specializuar për çdo nevojë shëndetësore',
      viewAll: 'Shiko të gjitha specialitetet',
      findButton: 'Gjej',
      typicalServices: 'Shërbime tipike',
      consultationReasons: 'Arsyet kryesore të konsultimit',
      backToSpecialties: 'Të gjitha specialitetet',
      notFound: 'Specialiteti nuk u gjet',
    },
    whyOrariMed: {
      title: 'Pse OrariMed?',
      subtitle: 'E thjeshtë, e shpejtë dhe e sigurt — kështu duhet të jetë rezervimi mjekësor',
      features: {
        booking: { title: 'Rezervim i shpejtë, 24/7', description: 'Rezervo një takim në çdo kohë, edhe gjatë natës ose fundjavës.' },
        local: { title: 'Fokus lokal', description: 'Mjekë të verifikuar në të gjithë Shqipërinë.' },
        reminders: { title: 'Kujtesa automatike', description: 'Merr njoftimet për takimet e tua përmes SMS ose email.' },
        secure: { title: 'Të dhëna të sigurta', description: 'Informacionet tuaja ruhen në mënyrë konfidenciale dhe të sigurt.' },
        cancel: { title: 'Anulim i lehtë', description: 'Anulo ose riplanifiko takimin pa asnjë problem.' },
      },
    },
    security: {
      title: 'Siguria & Privatësia',
      description: 'OrariMed respekton standardet më të larta të sigurisë së të dhënave shëndetësore. Të gjitha informacionet ruhen dhe përpunohen në mënyrë të sigurt, sipas legjislacionit në fuqi.',
      features: ['Enkriptim SSL', 'Konform GDPR', 'Të dhëna të sigurta'],
    },
    professional: {
      title: 'Je mjek, dentist apo laborator?',
      subtitle: 'Rrit dukshmërinë tënde dhe menaxho oraret në mënyrë digjitale. Bashkohu me profesionistë që përdorin OrariMed.',
      cta: 'Regjistrohu si profesionist',
      badge: 'Për profesionistët shëndetësorë',
      manageSchedules: 'Menaxho oraret online',
      growPatients: 'Rrit numrin e pacientëve',
      freeRegistration: 'Regjistrim falas',
    },
    footer: {
      description: 'Platforma e takimeve mjekësore online në Shqipëri. Rezervo një takim me mjekë të verifikuar në pak klikime.',
      quickLinks: 'Lidhje të shpejta',
      legal: 'Informacion ligjor',
      contact: 'Kontakt',
      rights: 'Të gjitha të drejtat e rezervuara',
      privacy: 'Politika e privatësisë',
      terms: 'Kushtet e përdorimit',
      cookies: 'Cookies',
      faq: 'Pyetje të shpeshta',
      forProfessionals: 'Për profesionistët',
      aboutUs: 'Rreth OrariMed',
      location: 'Shqipëri',
    },
    specialtyNames: {
      'mjek-pergjithshem': 'Mjek i Përgjithshëm',
      'kardiologji': 'Kardiologji',
      'dermatologji': 'Dermatologji',
      'pediatri': 'Pediatri',
      'gjinekologji': 'Obstetrikë & Gjinekologji',
      'ortopedi': 'Ortopedi',
      'psikiatri': 'Psikiatri & Psikologji',
      'gastroenterologji': 'Gastroenterologji',
      'orl': 'ORL (Vesh-Hundë-Fyt)',
      'urologji': 'Urologji',
      'dentiste': 'Dentistë',
      'laboratore': 'Laboratorë analizash',
    },
    specialtyDescriptions: {
      'mjek-pergjithshem': 'Mjeku i përgjithshëm është pika e parë e kontaktit për problemet shëndetësore të përditshme.',
      'kardiologji': 'Rezervoni një takim me kardiologë të specializuar për kujdesin ndaj zemrës.',
      'dermatologji': 'Për kujdesin e lëkurës, flokëve dhe thonjve, gjeni dermatologë të verifikuar.',
      'pediatri': 'Kujdes shëndetësor për foshnjat, fëmijët dhe adoleshentët.',
      'gjinekologji': 'Rezervoni kontrolle rutinë, ndjekje shtatzënie dhe konsulta gjinekologjike.',
      'ortopedi': 'Trajtim për problemet e kockave, kyçeve dhe muskujve.',
      'psikiatri': 'Mbështetje profesionale për shëndetin mendor dhe mirëqenien emocionale.',
      'gastroenterologji': 'Për probleme të aparatit tretës dhe kontrolle diagnostikuese.',
      'orl': 'Trajtim për dëgjimin, frymëmarrjen dhe infeksionet e rrugëve të sipërme.',
      'urologji': 'Kujdes për shëndetin urinar dhe riprodhues.',
      'dentiste': 'Gjeni dentistë për kontrolle, trajtime, urgjenca dentare dhe estetikë orale.',
      'laboratore': 'Rezervoni takime për analiza mjekësore në laboratorë të certifikuar.',
    },
    consultationReasons: {
      'mjek-pergjithshem': ['Dhimbje koke', 'Gripi dhe ftohja', 'Lodhje kronike', 'Dhimbje shpine', 'Kontroll i përgjithshëm', 'Certifikatë mjekësore', 'Vaksinim', 'Këshillim shëndetësor'],
      'kardiologji': ['Dhimbje gjoksi', 'Frymëmarrje e shkurtër', 'Rrahje të shpejta zemre', 'Tension i lartë', 'Kontroll kardiak vjetor', 'Interpretim EKG', 'Edema këmbësh'],
      'dermatologji': ['Akne', 'Ekzemë', 'Psoriazis', 'Nishan i dyshimtë', 'Rënie flokësh', 'Infeksion fungal', 'Alergjia të lëkurës', 'Herpes'],
      'pediatri': ['Vizitë rutinë fëmije', 'Vaksinim', 'Ethe', 'Kollë dhe gripi', 'Dhimbje barku', 'Kontrolli i rritjes', 'Alergjia ushqimore', 'Infeksion veshi'],
      'gjinekologji': ['Kontroll rutinë', 'Pap test', 'Ndjekje shtatzënie', 'Çrregullime menstruale', 'Kontracepsion', 'Menopauzë', 'Infeksione vaginale', 'Ekografi pelvike'],
      'ortopedi': ['Dhimbje gjuri', 'Dhimbje shpine', 'Këputje ligamentesh', 'Frakturë', 'Artriti', 'Tendinit', 'Skoliozë', 'Dhimbje supi'],
      'psikiatri': ['Ankthi', 'Depresioni', 'Stresi kronik', 'Pagjumësi', 'Ataqe paniku', 'Trauma', 'Çrregullime të humorit', 'Terapi çifti'],
      'gastroenterologji': ['Dhimbje stomaku', 'Reflux gastrik', 'Kapsllëk', 'Diarré kronike', 'Sindroma e zorrës së irrituar', 'Koloskopi', 'Gastroskopi', 'Hemoroide'],
      'orl': ['Dhimbje fyti', 'Hundë e bllokuar', 'Humbje dëgjimi', 'Tinitus', 'Sinusit', 'Tonsillitit', 'Vertigo', 'Infeksion veshi'],
      'urologji': ['Infeksion urinar', 'Gurë veshkash', 'Probleme prostate', 'Inkontinencë', 'Disfunksion erektil', 'Vizitë urologjike', 'Analiza urine'],
      'dentiste': ['Dhimbje dhëmbi', 'Kontroll periodik', 'Pastrim dhëmbësh', 'Mbushje', 'Nxjerrje dhëmbi', 'Zbardhim dhëmbësh', 'Aparate ortodontike', 'Implantet dentare'],
      'laboratore': ['Analiza gjaku', 'Profili lipidik', 'Glicemia', 'Analiza hormonale', 'Testi i tiroidës', 'Analiza urine', 'Teste alergjie', 'Markuesit tumoralë'],
    },
    other: 'Tjetër',
  },
  en: {
    nav: {
      home: 'Home',
      specialties: 'Specialties',
      news: 'News',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
    },
    hero: {
      h1: 'Find and book your medical appointment in Albania, online',
      subtitle: 'Book an appointment with doctors, dentists and laboratories in just a few clicks. Verified doctors, real-time availability.',
      searchDoctor: 'Find a doctor',
      imProfessional: "I'm a healthcare professional",
      badge: '🏥 Medical appointment platform in Albania',
      verifiedDoctors: 'Verified doctors',
      booking247: '24/7 booking',
      freeForPatients: 'Free for patients',
    },
    specialties: {
      title: 'Specialties',
      subtitle: 'Find specialized doctors for every health need',
      viewAll: 'View all specialties',
      findButton: 'Find',
      typicalServices: 'Typical services',
      consultationReasons: 'Main consultation reasons',
      backToSpecialties: 'All specialties',
      notFound: 'Specialty not found',
    },
    whyOrariMed: {
      title: 'Why OrariMed?',
      subtitle: 'Simple, fast and secure — this is how medical booking should be',
      features: {
        booking: { title: 'Fast booking, 24/7', description: 'Book an appointment anytime, even at night or on weekends.' },
        local: { title: 'Local focus', description: 'Verified doctors throughout Albania.' },
        reminders: { title: 'Automatic reminders', description: 'Get notifications for your appointments via SMS or email.' },
        secure: { title: 'Secure data', description: 'Your information is stored confidentially and securely.' },
        cancel: { title: 'Easy cancellation', description: 'Cancel or reschedule without any hassle.' },
      },
    },
    security: {
      title: 'Security & Privacy',
      description: 'OrariMed respects the highest standards of health data security. All information is stored and processed securely, in accordance with applicable legislation.',
      features: ['SSL Encryption', 'GDPR Compliant', 'Secure Data'],
    },
    professional: {
      title: 'Are you a doctor, dentist or laboratory?',
      subtitle: 'Increase your visibility and manage your schedules digitally. Join professionals who use OrariMed.',
      cta: 'Register as a professional',
      badge: 'For healthcare professionals',
      manageSchedules: 'Manage schedules online',
      growPatients: 'Grow your patient base',
      freeRegistration: 'Free registration',
    },
    footer: {
      description: 'The online medical appointment platform in Albania. Book an appointment with verified doctors in just a few clicks.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      contact: 'Contact',
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      cookies: 'Cookies',
      faq: 'FAQ',
      forProfessionals: 'For professionals',
      aboutUs: 'About OrariMed',
      location: 'Albania',
    },
    specialtyNames: {
      'mjek-pergjithshem': 'General Practitioner',
      'kardiologji': 'Cardiology',
      'dermatologji': 'Dermatology',
      'pediatri': 'Pediatrics',
      'gjinekologji': 'Obstetrics & Gynecology',
      'ortopedi': 'Orthopedics',
      'psikiatri': 'Psychiatry & Psychology',
      'gastroenterologji': 'Gastroenterology',
      'orl': 'ENT (Ear-Nose-Throat)',
      'urologji': 'Urology',
      'dentiste': 'Dentist',
      'laboratore': 'Laboratory',
    },
    specialtyDescriptions: {
      'mjek-pergjithshem': 'The general practitioner is the first point of contact for everyday health problems.',
      'kardiologji': 'Book an appointment with specialized cardiologists for heart care.',
      'dermatologji': 'For skin, hair and nail care, find verified dermatologists.',
      'pediatri': 'Healthcare for infants, children and adolescents.',
      'gjinekologji': 'Book routine check-ups, pregnancy follow-ups and gynecological consultations.',
      'ortopedi': 'Treatment for bone, joint and muscle problems.',
      'psikiatri': 'Professional support for mental health and emotional well-being.',
      'gastroenterologji': 'For digestive system problems and diagnostic check-ups.',
      'orl': 'Treatment for hearing, breathing and upper respiratory infections.',
      'urologji': 'Care for urinary and reproductive health.',
      'dentiste': 'Find dentists for check-ups, treatments, dental emergencies and oral aesthetics.',
      'laboratore': 'Book appointments for medical tests in certified laboratories.',
    },
    consultationReasons: {
      'mjek-pergjithshem': ['Headache', 'Flu and cold', 'Chronic fatigue', 'Back pain', 'General check-up', 'Medical certificate', 'Vaccination', 'Health advice'],
      'kardiologji': ['Chest pain', 'Shortness of breath', 'Rapid heartbeat', 'High blood pressure', 'Annual cardiac check-up', 'ECG interpretation', 'Leg edema'],
      'dermatologji': ['Acne', 'Eczema', 'Psoriasis', 'Suspicious mole', 'Hair loss', 'Fungal infection', 'Skin allergies', 'Herpes'],
      'pediatri': ['Routine child visit', 'Vaccination', 'Fever', 'Cough and flu', 'Stomach pain', 'Growth monitoring', 'Food allergies', 'Ear infection'],
      'gjinekologji': ['Routine check-up', 'Pap smear', 'Pregnancy follow-up', 'Menstrual disorders', 'Contraception', 'Menopause', 'Vaginal infections', 'Pelvic ultrasound'],
      'ortopedi': ['Knee pain', 'Back pain', 'Ligament tear', 'Fracture', 'Arthritis', 'Tendinitis', 'Scoliosis', 'Shoulder pain'],
      'psikiatri': ['Anxiety', 'Depression', 'Chronic stress', 'Insomnia', 'Panic attacks', 'Trauma', 'Mood disorders', 'Couples therapy'],
      'gastroenterologji': ['Stomach pain', 'Gastric reflux', 'Constipation', 'Chronic diarrhea', 'Irritable bowel syndrome', 'Colonoscopy', 'Gastroscopy', 'Hemorrhoids'],
      'orl': ['Sore throat', 'Blocked nose', 'Hearing loss', 'Tinnitus', 'Sinusitis', 'Tonsillitis', 'Vertigo', 'Ear infection'],
      'urologji': ['Urinary infection', 'Kidney stones', 'Prostate problems', 'Incontinence', 'Erectile dysfunction', 'Urological check-up', 'Urine analysis'],
      'dentiste': ['Toothache', 'Regular check-up', 'Teeth cleaning', 'Filling', 'Tooth extraction', 'Teeth whitening', 'Orthodontic braces', 'Dental implants'],
      'laboratore': ['Blood tests', 'Lipid profile', 'Blood sugar', 'Hormone analysis', 'Thyroid test', 'Urine analysis', 'Allergy tests', 'Tumor markers'],
    },
    other: 'Other',
  },
  fr: {
    nav: {
      home: 'Accueil',
      specialties: 'Spécialités',
      news: 'Actualités',
      contact: 'Contact',
      login: 'Connexion',
      register: "S'inscrire",
    },
    hero: {
      h1: 'Trouvez et réservez votre rendez-vous médical en Albanie, en ligne',
      subtitle: 'Prenez rendez-vous avec des médecins, dentistes et laboratoires en quelques clics. Médecins vérifiés, disponibilité en temps réel.',
      searchDoctor: 'Chercher un médecin',
      imProfessional: 'Je suis professionnel de santé',
      badge: '🏥 Plateforme de rendez-vous médicaux en Albanie',
      verifiedDoctors: 'Médecins vérifiés',
      booking247: 'Réservation 24h/24',
      freeForPatients: 'Gratuit pour les patients',
    },
    specialties: {
      title: 'Spécialités',
      subtitle: 'Trouvez des médecins spécialisés pour chaque besoin de santé',
      viewAll: 'Voir toutes les spécialités',
      findButton: 'Trouver',
      typicalServices: 'Services typiques',
      consultationReasons: 'Principaux motifs de consultation',
      backToSpecialties: 'Toutes les spécialités',
      notFound: 'Spécialité non trouvée',
    },
    whyOrariMed: {
      title: 'Pourquoi OrariMed ?',
      subtitle: 'Simple, rapide et sécurisé — voilà comment devrait être la réservation médicale',
      features: {
        booking: { title: 'Réservation rapide, 24h/24', description: 'Réservez à tout moment, même la nuit ou le week-end.' },
        local: { title: 'Focus local', description: 'Médecins vérifiés dans toute l\'Albanie.' },
        reminders: { title: 'Rappels automatiques', description: 'Recevez des notifications pour vos rendez-vous par SMS ou email.' },
        secure: { title: 'Données sécurisées', description: 'Vos informations sont stockées de manière confidentielle et sécurisée.' },
        cancel: { title: 'Annulation facile', description: 'Annulez ou reprogrammez sans problème.' },
      },
    },
    security: {
      title: 'Sécurité & Confidentialité',
      description: 'OrariMed respecte les normes les plus élevées de sécurité des données de santé. Toutes les informations sont stockées et traitées de manière sécurisée, conformément à la législation en vigueur.',
      features: ['Cryptage SSL', 'Conforme RGPD', 'Données sécurisées'],
    },
    professional: {
      title: 'Vous êtes médecin, dentiste ou laboratoire ?',
      subtitle: 'Augmentez votre visibilité et gérez vos horaires numériquement. Rejoignez les professionnels qui utilisent OrariMed.',
      cta: "S'inscrire comme professionnel",
      badge: 'Pour les professionnels de santé',
      manageSchedules: 'Gérer les horaires en ligne',
      growPatients: 'Augmenter le nombre de patients',
      freeRegistration: 'Inscription gratuite',
    },
    footer: {
      description: 'La plateforme de rendez-vous médicaux en ligne en Albanie. Prenez rendez-vous avec des médecins vérifiés en quelques clics.',
      quickLinks: 'Liens rapides',
      legal: 'Légal',
      contact: 'Contact',
      rights: 'Tous droits réservés',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
      cookies: 'Cookies',
      faq: 'FAQ',
      forProfessionals: 'Pour les professionnels',
      aboutUs: 'À propos d\'OrariMed',
      location: 'Albanie',
    },
    specialtyNames: {
      'mjek-pergjithshem': 'Médecin généraliste',
      'kardiologji': 'Cardiologie',
      'dermatologji': 'Dermatologie',
      'pediatri': 'Pédiatrie',
      'gjinekologji': 'Obstétrique & Gynécologie',
      'ortopedi': 'Orthopédie',
      'psikiatri': 'Psychiatrie & Psychologie',
      'gastroenterologji': 'Gastro-entérologie',
      'orl': 'ORL',
      'urologji': 'Urologie',
      'dentiste': 'Dentiste',
      'laboratore': 'Laboratoire',
    },
    specialtyDescriptions: {
      'mjek-pergjithshem': 'Le médecin généraliste est le premier point de contact pour les problèmes de santé quotidiens.',
      'kardiologji': 'Prenez rendez-vous avec des cardiologues spécialisés pour le soin du cœur.',
      'dermatologji': 'Pour le soin de la peau, des cheveux et des ongles, trouvez des dermatologues vérifiés.',
      'pediatri': 'Soins de santé pour nourrissons, enfants et adolescents.',
      'gjinekologji': 'Réservez des contrôles de routine, suivis de grossesse et consultations gynécologiques.',
      'ortopedi': 'Traitement des problèmes osseux, articulaires et musculaires.',
      'psikiatri': 'Soutien professionnel pour la santé mentale et le bien-être émotionnel.',
      'gastroenterologji': 'Pour les problèmes digestifs et examens diagnostiques.',
      'orl': 'Traitement de l\'audition, de la respiration et des infections des voies respiratoires supérieures.',
      'urologji': 'Soins pour la santé urinaire et reproductive.',
      'dentiste': 'Trouvez des dentistes pour contrôles, traitements, urgences dentaires et esthétique buccale.',
      'laboratore': 'Réservez des rendez-vous pour des analyses médicales dans des laboratoires certifiés.',
    },
    consultationReasons: {
      'mjek-pergjithshem': ['Maux de tête', 'Grippe et rhume', 'Fatigue chronique', 'Mal de dos', 'Bilan de santé', 'Certificat médical', 'Vaccination', 'Conseil santé'],
      'kardiologji': ['Douleur thoracique', 'Essoufflement', 'Palpitations', 'Hypertension', 'Bilan cardiaque annuel', 'Interprétation ECG', 'Œdème des jambes'],
      'dermatologji': ['Acné', 'Eczéma', 'Psoriasis', 'Grain de beauté suspect', 'Chute de cheveux', 'Mycose', 'Allergies cutanées', 'Herpès'],
      'pediatri': ['Visite de routine enfant', 'Vaccination', 'Fièvre', 'Toux et grippe', 'Mal de ventre', 'Suivi de croissance', 'Allergies alimentaires', 'Otite'],
      'gjinekologji': ['Contrôle de routine', 'Frottis', 'Suivi de grossesse', 'Troubles menstruels', 'Contraception', 'Ménopause', 'Infections vaginales', 'Échographie pelvienne'],
      'ortopedi': ['Douleur au genou', 'Mal de dos', 'Rupture de ligament', 'Fracture', 'Arthrite', 'Tendinite', 'Scoliose', 'Douleur à l\'épaule'],
      'psikiatri': ['Anxiété', 'Dépression', 'Stress chronique', 'Insomnie', 'Crises de panique', 'Trauma', 'Troubles de l\'humeur', 'Thérapie de couple'],
      'gastroenterologji': ['Douleur abdominale', 'Reflux gastrique', 'Constipation', 'Diarrhée chronique', 'Syndrome du côlon irritable', 'Coloscopie', 'Gastroscopie', 'Hémorroïdes'],
      'orl': ['Mal de gorge', 'Nez bouché', 'Perte d\'audition', 'Acouphènes', 'Sinusite', 'Angine', 'Vertiges', 'Otite'],
      'urologji': ['Infection urinaire', 'Calculs rénaux', 'Problèmes de prostate', 'Incontinence', 'Dysfonction érectile', 'Bilan urologique', 'Analyse d\'urine'],
      'dentiste': ['Rage de dents', 'Contrôle régulier', 'Détartrage', 'Plombage', 'Extraction dentaire', 'Blanchiment', 'Appareil orthodontique', 'Implants dentaires'],
      'laboratore': ['Analyses de sang', 'Bilan lipidique', 'Glycémie', 'Bilan hormonal', 'Test thyroïdien', 'Analyse d\'urine', 'Tests allergiques', 'Marqueurs tumoraux'],
    },
    other: 'Autre',
  },
  de: {
    nav: {
      home: 'Startseite',
      specialties: 'Fachgebiete',
      news: 'Aktuelles',
      contact: 'Kontakt',
      login: 'Anmelden',
      register: 'Registrieren',
    },
    hero: {
      h1: 'Finden und buchen Sie Ihren Arzttermin in Albanien, online',
      subtitle: 'Buchen Sie einen Termin bei Ärzten, Zahnärzten und Laboren in wenigen Klicks. Verifizierte Ärzte, Echtzeit-Verfügbarkeit.',
      searchDoctor: 'Arzt suchen',
      imProfessional: 'Ich bin Gesundheitsfachkraft',
      badge: '🏥 Arzttermin-Plattform in Albanien',
      verifiedDoctors: 'Verifizierte Ärzte',
      booking247: 'Buchung rund um die Uhr',
      freeForPatients: 'Kostenlos für Patienten',
    },
    specialties: {
      title: 'Fachgebiete',
      subtitle: 'Finden Sie spezialisierte Ärzte für jeden Gesundheitsbedarf',
      viewAll: 'Alle Fachgebiete anzeigen',
      findButton: 'Finden',
      typicalServices: 'Typische Leistungen',
      consultationReasons: 'Häufigste Konsultationsgründe',
      backToSpecialties: 'Alle Fachgebiete',
      notFound: 'Fachgebiet nicht gefunden',
    },
    whyOrariMed: {
      title: 'Warum OrariMed?',
      subtitle: 'Einfach, schnell und sicher — so sollte die Arztbuchung sein',
      features: {
        booking: { title: 'Schnelle Buchung, 24/7', description: 'Buchen Sie jederzeit, auch nachts oder am Wochenende.' },
        local: { title: 'Lokaler Fokus', description: 'Verifizierte Ärzte in ganz Albanien.' },
        reminders: { title: 'Automatische Erinnerungen', description: 'Erhalten Sie Benachrichtigungen für Ihre Termine per SMS oder E-Mail.' },
        secure: { title: 'Sichere Daten', description: 'Ihre Informationen werden vertraulich und sicher gespeichert.' },
        cancel: { title: 'Einfache Stornierung', description: 'Stornieren oder verschieben Sie problemlos.' },
      },
    },
    security: {
      title: 'Sicherheit & Datenschutz',
      description: 'OrariMed respektiert die höchsten Standards für Gesundheitsdatensicherheit. Alle Informationen werden sicher gespeichert und verarbeitet, gemäß der geltenden Gesetzgebung.',
      features: ['SSL-Verschlüsselung', 'DSGVO-konform', 'Sichere Daten'],
    },
    professional: {
      title: 'Sind Sie Arzt, Zahnarzt oder Labor?',
      subtitle: 'Erhöhen Sie Ihre Sichtbarkeit und verwalten Sie Ihre Termine digital. Schließen Sie sich Fachleuten an, die OrariMed nutzen.',
      cta: 'Als Fachkraft registrieren',
      badge: 'Für Gesundheitsfachkräfte',
      manageSchedules: 'Termine online verwalten',
      growPatients: 'Patientenbasis vergrößern',
      freeRegistration: 'Kostenlose Registrierung',
    },
    footer: {
      description: 'Die Online-Plattform für Arzttermine in Albanien. Buchen Sie einen Termin bei verifizierten Ärzten in wenigen Klicks.',
      quickLinks: 'Schnelllinks',
      legal: 'Rechtliches',
      contact: 'Kontakt',
      rights: 'Alle Rechte vorbehalten',
      privacy: 'Datenschutzrichtlinie',
      terms: 'Nutzungsbedingungen',
      cookies: 'Cookies',
      faq: 'FAQ',
      forProfessionals: 'Für Fachleute',
      aboutUs: 'Über OrariMed',
      location: 'Albanien',
    },
    specialtyNames: {
      'mjek-pergjithshem': 'Allgemeinmedizin',
      'kardiologji': 'Kardiologie',
      'dermatologji': 'Dermatologie',
      'pediatri': 'Pädiatrie',
      'gjinekologji': 'Gynäkologie & Geburtshilfe',
      'ortopedi': 'Orthopädie',
      'psikiatri': 'Psychiatrie & Psychologie',
      'gastroenterologji': 'Gastroenterologie',
      'orl': 'HNO',
      'urologji': 'Urologie',
      'dentiste': 'Zahnarzt',
      'laboratore': 'Labor',
    },
    specialtyDescriptions: {
      'mjek-pergjithshem': 'Der Allgemeinmediziner ist die erste Anlaufstelle für alltägliche Gesundheitsprobleme.',
      'kardiologji': 'Buchen Sie einen Termin bei spezialisierten Kardiologen für Herzpflege.',
      'dermatologji': 'Für Haut-, Haar- und Nagelpflege finden Sie verifizierte Dermatologen.',
      'pediatri': 'Gesundheitsversorgung für Säuglinge, Kinder und Jugendliche.',
      'gjinekologji': 'Buchen Sie Routineuntersuchungen, Schwangerschaftsnachsorge und gynäkologische Beratungen.',
      'ortopedi': 'Behandlung von Knochen-, Gelenk- und Muskelproblemen.',
      'psikiatri': 'Professionelle Unterstützung für psychische Gesundheit und emotionales Wohlbefinden.',
      'gastroenterologji': 'Für Verdauungsprobleme und diagnostische Untersuchungen.',
      'orl': 'Behandlung von Hör-, Atem- und oberen Atemwegsinfektionen.',
      'urologji': 'Versorgung für Harn- und Fortpflanzungsgesundheit.',
      'dentiste': 'Finden Sie Zahnärzte für Kontrollen, Behandlungen, Notfälle und Ästhetik.',
      'laboratore': 'Buchen Sie Termine für medizinische Tests in zertifizierten Laboren.',
    },
    consultationReasons: {
      'mjek-pergjithshem': ['Kopfschmerzen', 'Grippe und Erkältung', 'Chronische Müdigkeit', 'Rückenschmerzen', 'Allgemeine Untersuchung', 'Ärztliches Attest', 'Impfung', 'Gesundheitsberatung'],
      'kardiologji': ['Brustschmerzen', 'Kurzatmigkeit', 'Herzrasen', 'Bluthochdruck', 'Jährliche Herzuntersuchung', 'EKG-Auswertung', 'Beinödeme'],
      'dermatologji': ['Akne', 'Ekzem', 'Psoriasis', 'Verdächtiger Leberfleck', 'Haarausfall', 'Pilzinfektion', 'Hautallergien', 'Herpes'],
      'pediatri': ['Routineuntersuchung Kind', 'Impfung', 'Fieber', 'Husten und Grippe', 'Bauchschmerzen', 'Wachstumsüberwachung', 'Nahrungsmittelallergien', 'Ohrenentzündung'],
      'gjinekologji': ['Routinekontrolle', 'Abstrich', 'Schwangerschaftsbetreuung', 'Menstruationsstörungen', 'Verhütung', 'Menopause', 'Vaginalinfektionen', 'Beckenultraschall'],
      'ortopedi': ['Knieschmerzen', 'Rückenschmerzen', 'Bänderriss', 'Fraktur', 'Arthritis', 'Sehnenentzündung', 'Skoliose', 'Schulterschmerzen'],
      'psikiatri': ['Angst', 'Depression', 'Chronischer Stress', 'Schlaflosigkeit', 'Panikattacken', 'Trauma', 'Stimmungsstörungen', 'Paartherapie'],
      'gastroenterologji': ['Magenschmerzen', 'Sodbrennen', 'Verstopfung', 'Chronischer Durchfall', 'Reizdarmsyndrom', 'Koloskopie', 'Gastroskopie', 'Hämorrhoiden'],
      'orl': ['Halsschmerzen', 'Verstopfte Nase', 'Hörverlust', 'Tinnitus', 'Sinusitis', 'Mandelentzündung', 'Schwindel', 'Ohrenentzündung'],
      'urologji': ['Harnwegsinfektion', 'Nierensteine', 'Prostataprobleme', 'Inkontinenz', 'Erektionsstörung', 'Urologische Untersuchung', 'Urinanalyse'],
      'dentiste': ['Zahnschmerzen', 'Regelmäßige Kontrolle', 'Zahnreinigung', 'Füllung', 'Zahnextraktion', 'Zahnaufhellung', 'Zahnspange', 'Zahnimplantate'],
      'laboratore': ['Blutuntersuchung', 'Lipidprofil', 'Blutzucker', 'Hormonanalyse', 'Schilddrüsentest', 'Urinanalyse', 'Allergietests', 'Tumormarker'],
    },
    other: 'Andere',
  },
  it: {
    nav: {
      home: 'Home',
      specialties: 'Specialità',
      news: 'Attualità',
      contact: 'Contatto',
      login: 'Accedi',
      register: 'Registrati',
    },
    hero: {
      h1: 'Trova e prenota il tuo appuntamento medico in Albania, online',
      subtitle: 'Prenota un appuntamento con medici, dentisti e laboratori in pochi clic. Medici verificati, disponibilità in tempo reale.',
      searchDoctor: 'Cerca un medico',
      imProfessional: 'Sono un professionista sanitario',
      badge: '🏥 Piattaforma di appuntamenti medici in Albania',
      verifiedDoctors: 'Medici verificati',
      booking247: 'Prenotazione 24/7',
      freeForPatients: 'Gratuito per i pazienti',
    },
    specialties: {
      title: 'Specialità',
      subtitle: 'Trova medici specializzati per ogni esigenza di salute',
      viewAll: 'Vedi tutte le specialità',
      findButton: 'Trova',
      typicalServices: 'Servizi tipici',
      consultationReasons: 'Principali motivi di consultazione',
      backToSpecialties: 'Tutte le specialità',
      notFound: 'Specialità non trovata',
    },
    whyOrariMed: {
      title: 'Perché OrariMed?',
      subtitle: 'Semplice, veloce e sicuro — così dovrebbe essere la prenotazione medica',
      features: {
        booking: { title: 'Prenotazione rapida, 24/7', description: 'Prenota in qualsiasi momento, anche di notte o nel fine settimana.' },
        local: { title: 'Focus locale', description: 'Medici verificati in tutta l\'Albania.' },
        reminders: { title: 'Promemoria automatici', description: 'Ricevi notifiche per i tuoi appuntamenti via SMS o email.' },
        secure: { title: 'Dati sicuri', description: 'Le tue informazioni sono conservate in modo riservato e sicuro.' },
        cancel: { title: 'Cancellazione facile', description: 'Cancella o riprogramma senza problemi.' },
      },
    },
    security: {
      title: 'Sicurezza & Privacy',
      description: 'OrariMed rispetta i più alti standard di sicurezza dei dati sanitari. Tutte le informazioni sono conservate e trattate in modo sicuro, in conformità con la legislazione vigente.',
      features: ['Crittografia SSL', 'Conforme GDPR', 'Dati sicuri'],
    },
    professional: {
      title: 'Sei un medico, dentista o laboratorio?',
      subtitle: 'Aumenta la tua visibilità e gestisci i tuoi orari digitalmente. Unisciti ai professionisti che usano OrariMed.',
      cta: 'Registrati come professionista',
      badge: 'Per i professionisti sanitari',
      manageSchedules: 'Gestisci gli orari online',
      growPatients: 'Aumenta il numero di pazienti',
      freeRegistration: 'Registrazione gratuita',
    },
    footer: {
      description: 'La piattaforma di appuntamenti medici online in Albania. Prenota un appuntamento con medici verificati in pochi clic.',
      quickLinks: 'Link rapidi',
      legal: 'Legale',
      contact: 'Contatto',
      rights: 'Tutti i diritti riservati',
      privacy: 'Informativa sulla privacy',
      terms: 'Termini di utilizzo',
      cookies: 'Cookie',
      faq: 'FAQ',
      forProfessionals: 'Per i professionisti',
      aboutUs: 'Chi siamo',
      location: 'Albania',
    },
    specialtyNames: {
      'mjek-pergjithshem': 'Medico generico',
      'kardiologji': 'Cardiologia',
      'dermatologji': 'Dermatologia',
      'pediatri': 'Pediatria',
      'gjinekologji': 'Ostetricia & Ginecologia',
      'ortopedi': 'Ortopedia',
      'psikiatri': 'Psichiatria & Psicologia',
      'gastroenterologji': 'Gastroenterologia',
      'orl': 'ORL',
      'urologji': 'Urologia',
      'dentiste': 'Dentista',
      'laboratore': 'Laboratorio',
    },
    specialtyDescriptions: {
      'mjek-pergjithshem': 'Il medico generico è il primo punto di contatto per i problemi di salute quotidiani.',
      'kardiologji': 'Prenota un appuntamento con cardiologi specializzati per la cura del cuore.',
      'dermatologji': 'Per la cura di pelle, capelli e unghie, trova dermatologi verificati.',
      'pediatri': 'Assistenza sanitaria per neonati, bambini e adolescenti.',
      'gjinekologji': 'Prenota controlli di routine, follow-up gravidanza e consulti ginecologici.',
      'ortopedi': 'Trattamento per problemi ossei, articolari e muscolari.',
      'psikiatri': 'Supporto professionale per la salute mentale e il benessere emotivo.',
      'gastroenterologji': 'Per problemi digestivi e controlli diagnostici.',
      'orl': "Trattamento per l'udito, la respirazione e le infezioni delle vie respiratorie superiori.",
      'urologji': 'Cura per la salute urinaria e riproduttiva.',
      'dentiste': 'Trova dentisti per controlli, trattamenti, emergenze dentali ed estetica orale.',
      'laboratore': 'Prenota appuntamenti per test medici in laboratori certificati.',
    },
    consultationReasons: {
      'mjek-pergjithshem': ['Mal di testa', 'Influenza e raffreddore', 'Stanchezza cronica', 'Mal di schiena', 'Check-up generale', 'Certificato medico', 'Vaccinazione', 'Consulenza sanitaria'],
      'kardiologji': ['Dolore toracico', 'Respiro corto', 'Battito cardiaco accelerato', 'Ipertensione', 'Check-up cardiaco annuale', 'Interpretazione ECG', 'Edema alle gambe'],
      'dermatologji': ['Acne', 'Eczema', 'Psoriasi', 'Neo sospetto', 'Perdita di capelli', 'Infezione fungina', 'Allergie cutanee', 'Herpes'],
      'pediatri': ['Visita di routine bambino', 'Vaccinazione', 'Febbre', 'Tosse e influenza', 'Mal di pancia', 'Monitoraggio della crescita', 'Allergie alimentari', 'Otite'],
      'gjinekologji': ['Controllo di routine', 'Pap test', 'Follow-up gravidanza', 'Disturbi mestruali', 'Contraccezione', 'Menopausa', 'Infezioni vaginali', 'Ecografia pelvica'],
      'ortopedi': ['Dolore al ginocchio', 'Mal di schiena', 'Rottura del legamento', 'Frattura', 'Artrite', 'Tendinite', 'Scoliosi', 'Dolore alla spalla'],
      'psikiatri': ['Ansia', 'Depressione', 'Stress cronico', 'Insonnia', 'Attacchi di panico', 'Trauma', 'Disturbi dell\'umore', 'Terapia di coppia'],
      'gastroenterologji': ['Mal di stomaco', 'Reflusso gastrico', 'Stitichezza', 'Diarrea cronica', 'Sindrome dell\'intestino irritabile', 'Colonscopia', 'Gastroscopia', 'Emorroidi'],
      'orl': ['Mal di gola', 'Naso chiuso', 'Perdita dell\'udito', 'Acufene', 'Sinusite', 'Tonsillite', 'Vertigini', 'Otite'],
      'urologji': ['Infezione urinaria', 'Calcoli renali', 'Problemi alla prostata', 'Incontinenza', 'Disfunzione erettile', 'Visita urologica', 'Esame delle urine'],
      'dentiste': ['Mal di denti', 'Controllo regolare', 'Pulizia dei denti', 'Otturazione', 'Estrazione dentale', 'Sbiancamento', 'Apparecchio ortodontico', 'Impianti dentali'],
      'laboratore': ['Analisi del sangue', 'Profilo lipidico', 'Glicemia', 'Analisi ormonali', 'Test tiroideo', 'Esame delle urine', 'Test allergici', 'Marcatori tumorali'],
    },
    other: 'Altro',
  },
  el: {
    nav: {
      home: 'Αρχική',
      specialties: 'Ειδικότητες',
      news: 'Νέα',
      contact: 'Επικοινωνία',
      login: 'Σύνδεση',
      register: 'Εγγραφή',
    },
    hero: {
      h1: 'Βρείτε και κλείστε το ιατρικό σας ραντεβού στην Αλβανία, online',
      subtitle: 'Κλείστε ραντεβού με γιατρούς, οδοντίατρους και εργαστήρια με λίγα κλικ. Επαληθευμένοι γιατροί, διαθεσιμότητα σε πραγματικό χρόνο.',
      searchDoctor: 'Αναζήτηση γιατρού',
      imProfessional: 'Είμαι επαγγελματίας υγείας',
      badge: '🏥 Πλατφόρμα ιατρικών ραντεβού στην Αλβανία',
      verifiedDoctors: 'Επαληθευμένοι γιατροί',
      booking247: 'Κράτηση 24/7',
      freeForPatients: 'Δωρεάν για ασθενείς',
    },
    specialties: {
      title: 'Ειδικότητες',
      subtitle: 'Βρείτε εξειδικευμένους γιατρούς για κάθε ανάγκη υγείας',
      viewAll: 'Δείτε όλες τις ειδικότητες',
      findButton: 'Βρείτε',
      typicalServices: 'Τυπικές υπηρεσίες',
      consultationReasons: 'Κύριοι λόγοι επίσκεψης',
      backToSpecialties: 'Όλες οι ειδικότητες',
      notFound: 'Η ειδικότητα δεν βρέθηκε',
    },
    whyOrariMed: {
      title: 'Γιατί OrariMed;',
      subtitle: 'Απλό, γρήγορο και ασφαλές — έτσι πρέπει να είναι η κράτηση ραντεβού',
      features: {
        booking: { title: 'Γρήγορη κράτηση, 24/7', description: 'Κλείστε ραντεβού οποτεδήποτε, ακόμα και τη νύχτα ή το Σαββατοκύριακο.' },
        local: { title: 'Τοπική εστίαση', description: 'Επαληθευμένοι γιατροί σε όλη την Αλβανία.' },
        reminders: { title: 'Αυτόματες υπενθυμίσεις', description: 'Λάβετε ειδοποιήσεις για τα ραντεβού σας μέσω SMS ή email.' },
        secure: { title: 'Ασφαλή δεδομένα', description: 'Οι πληροφορίες σας αποθηκεύονται εμπιστευτικά και με ασφάλεια.' },
        cancel: { title: 'Εύκολη ακύρωση', description: 'Ακυρώστε ή επαναπρογραμματίστε χωρίς πρόβλημα.' },
      },
    },
    security: {
      title: 'Ασφάλεια & Ιδιωτικότητα',
      description: 'Το OrariMed σέβεται τα υψηλότερα πρότυπα ασφάλειας δεδομένων υγείας. Όλες οι πληροφορίες αποθηκεύονται και επεξεργάζονται με ασφάλεια, σύμφωνα με την ισχύουσα νομοθεσία.',
      features: ['Κρυπτογράφηση SSL', 'Συμμόρφωση GDPR', 'Ασφαλή δεδομένα'],
    },
    professional: {
      title: 'Είστε γιατρός, οδοντίατρος ή εργαστήριο;',
      subtitle: 'Αυξήστε την ορατότητά σας και διαχειριστείτε τα ωράριά σας ψηφιακά. Γίνετε μέλος των επαγγελματιών που χρησιμοποιούν το OrariMed.',
      cta: 'Εγγραφή ως επαγγελματίας',
      badge: 'Για επαγγελματίες υγείας',
      manageSchedules: 'Διαχείριση ωραρίων online',
      growPatients: 'Αύξηση αριθμού ασθενών',
      freeRegistration: 'Δωρεάν εγγραφή',
    },
    footer: {
      description: 'Η online πλατφόρμα ιατρικών ραντεβού στην Αλβανία. Κλείστε ραντεβού με επαληθευμένους γιατρούς με λίγα κλικ.',
      quickLinks: 'Γρήγοροι σύνδεσμοι',
      legal: 'Νομικά',
      contact: 'Επικοινωνία',
      rights: 'Όλα τα δικαιώματα διατηρούνται',
      privacy: 'Πολιτική απορρήτου',
      terms: 'Όροι χρήσης',
      cookies: 'Cookies',
      faq: 'Συχνές ερωτήσεις',
      forProfessionals: 'Για επαγγελματίες',
      aboutUs: 'Σχετικά με εμάς',
      location: 'Αλβανία',
    },
    specialtyNames: {
      'mjek-pergjithshem': 'Γενικός ιατρός',
      'kardiologji': 'Καρδιολογία',
      'dermatologji': 'Δερματολογία',
      'pediatri': 'Παιδιατρική',
      'gjinekologji': 'Μαιευτική & Γυναικολογία',
      'ortopedi': 'Ορθοπεδική',
      'psikiatri': 'Ψυχιατρική & Ψυχολογία',
      'gastroenterologji': 'Γαστρεντερολογία',
      'orl': 'ΩΡΛ',
      'urologji': 'Ουρολογία',
      'dentiste': 'Οδοντίατρος',
      'laboratore': 'Εργαστήριο',
    },
    specialtyDescriptions: {
      'mjek-pergjithshem': 'Ο γενικός ιατρός είναι το πρώτο σημείο επαφής για καθημερινά προβλήματα υγείας.',
      'kardiologji': 'Κλείστε ραντεβού με εξειδικευμένους καρδιολόγους για τη φροντίδα της καρδιάς.',
      'dermatologji': 'Για τη φροντίδα δέρματος, μαλλιών και νυχιών, βρείτε επαληθευμένους δερματολόγους.',
      'pediatri': 'Υγειονομική περίθαλψη για βρέφη, παιδιά και εφήβους.',
      'gjinekologji': 'Κλείστε τακτικούς ελέγχους, παρακολούθηση εγκυμοσύνης και γυναικολογικές συμβουλές.',
      'ortopedi': 'Θεραπεία για προβλήματα οστών, αρθρώσεων και μυών.',
      'psikiatri': 'Επαγγελματική υποστήριξη για την ψυχική υγεία και τη συναισθηματική ευεξία.',
      'gastroenterologji': 'Για προβλήματα πεπτικού και διαγνωστικούς ελέγχους.',
      'orl': 'Θεραπεία για την ακοή, την αναπνοή και τις λοιμώξεις ανώτερου αναπνευστικού.',
      'urologji': 'Φροντίδα για την ουρολογική και αναπαραγωγική υγεία.',
      'dentiste': 'Βρείτε οδοντίατρους για ελέγχους, θεραπείες, έκτακτα περιστατικά και αισθητική στόματος.',
      'laboratore': 'Κλείστε ραντεβού για ιατρικές εξετάσεις σε πιστοποιημένα εργαστήρια.',
    },
    consultationReasons: {
      'mjek-pergjithshem': ['Πονοκέφαλος', 'Γρίπη και κρυολόγημα', 'Χρόνια κόπωση', 'Πόνος στην πλάτη', 'Γενικός έλεγχος', 'Ιατρικό πιστοποιητικό', 'Εμβολιασμός', 'Συμβουλές υγείας'],
      'kardiologji': ['Θωρακικός πόνος', 'Δύσπνοια', 'Ταχυκαρδία', 'Υψηλή πίεση', 'Ετήσιος καρδιακός έλεγχος', 'Ερμηνεία ΗΚΓ', 'Οίδημα ποδιών'],
      'dermatologji': ['Ακμή', 'Έκζεμα', 'Ψωρίαση', 'Ύποπτη ελιά', 'Απώλεια μαλλιών', 'Μυκητιασική λοίμωξη', 'Δερματικές αλλεργίες', 'Έρπης'],
      'pediatri': ['Τακτική επίσκεψη παιδιού', 'Εμβολιασμός', 'Πυρετός', 'Βήχας και γρίπη', 'Πόνος στην κοιλιά', 'Παρακολούθηση ανάπτυξης', 'Τροφικές αλλεργίες', 'Ωτίτιδα'],
      'gjinekologji': ['Τακτικός έλεγχος', 'Τεστ Παπ', 'Παρακολούθηση εγκυμοσύνης', 'Εμμηνορυσιακές διαταραχές', 'Αντισύλληψη', 'Εμμηνόπαυση', 'Κολπικές λοιμώξεις', 'Υπερηχογράφημα πυέλου'],
      'ortopedi': ['Πόνος στο γόνατο', 'Πόνος στην πλάτη', 'Ρήξη συνδέσμου', 'Κάταγμα', 'Αρθρίτιδα', 'Τενοντίτιδα', 'Σκολίωση', 'Πόνος στον ώμο'],
      'psikiatri': ['Άγχος', 'Κατάθλιψη', 'Χρόνιο στρες', 'Αϋπνία', 'Κρίσεις πανικού', 'Τραύμα', 'Διαταραχές διάθεσης', 'Θεραπεία ζευγαριών'],
      'gastroenterologji': ['Στομαχόπονος', 'Γαστρική παλινδρόμηση', 'Δυσκοιλιότητα', 'Χρόνια διάρροια', 'Σύνδρομο ευερέθιστου εντέρου', 'Κολονοσκόπηση', 'Γαστροσκόπηση', 'Αιμορροΐδες'],
      'orl': ['Πονόλαιμος', 'Βουλωμένη μύτη', 'Απώλεια ακοής', 'Εμβοές', 'Ιγμορίτιδα', 'Αμυγδαλίτιδα', 'Ίλιγγος', 'Ωτίτιδα'],
      'urologji': ['Ουρολοίμωξη', 'Πέτρες στα νεφρά', 'Προβλήματα προστάτη', 'Ακράτεια', 'Στυτική δυσλειτουργία', 'Ουρολογικός έλεγχος', 'Ανάλυση ούρων'],
      'dentiste': ['Πονόδοντος', 'Τακτικός έλεγχος', 'Καθαρισμός δοντιών', 'Σφράγισμα', 'Εξαγωγή δοντιού', 'Λεύκανση δοντιών', 'Ορθοδοντικά σιδεράκια', 'Οδοντικά εμφυτεύματα'],
      'laboratore': ['Εξετάσεις αίματος', 'Λιπιδαιμικό προφίλ', 'Σάκχαρο αίματος', 'Ορμονικές αναλύσεις', 'Έλεγχος θυρεοειδούς', 'Ανάλυση ούρων', 'Τεστ αλλεργίας', 'Καρκινικοί δείκτες'],
    },
    other: 'Άλλο',
  },
};
