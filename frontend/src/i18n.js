import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Welcome": "Welcome to Academic Scheduler",
      "Dashboard": "Dashboard",
      "Teachers": "Teachers",
      "Classrooms": "Classrooms",
      "Courses": "Courses",
      "Classes": "Classes",
      "Schedule": "Schedule",
      "Assignments": "Assignments",
      "Generate Schedule": "Generate Schedule",
      "Language": "Language",
    }
  },
  ar: {
    translation: {
      "Welcome": "مرحبًا بكم في نظام الجدولة الأكاديمي",
      "Dashboard": "لوحة التحكم",
      "Teachers": "المعلمين",
      "Classrooms": "القاعات",
      "Courses": "المواد",
      "Classes": "الفصول",
      "Schedule": "الجدول",
      "Assignments": "التعيينات",
      "Generate Schedule": "إنشاء الجدول",
      "Language": "اللغة",
    }
  },
  fr: {
    translation: {
      "Welcome": "Bienvenue au Planificateur Académique",
      "Dashboard": "Tableau de bord",
      "Teachers": "Enseignants",
      "Classrooms": "Salles",
      "Courses": "Cours",
      "Classes": "Classes",
      "Schedule": "Emploi du temps",
      "Assignments": "Affectations",
      "Generate Schedule": "Générer l'emploi du temps",
      "Language": "Langue",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
