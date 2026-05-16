// Runtime translation dictionary
// Default language = English

export const DICT = {
  // Navbar / Auth
  Login: {
    fr: "Connexion",
    ar: "تسجيل الدخول",
  },

  Register: {
    fr: "Inscription",
    ar: "إنشاء حساب",
  },

  Logout: {
    fr: "Déconnexion",
    ar: "تسجيل الخروج",
  },

  Profile: {
    fr: "Profil",
    ar: "الملف الشخصي",
  },

  Language: {
    fr: "Langue",
    ar: "اللغة",
  },

  Teacher: {
    fr: "Enseignant",
    ar: "معلم",
  },

  Student: {
    fr: "Élève",
    ar: "طالب",
  },

  Dashboard: {
    fr: "Tableau de bord",
    ar: "لوحة التحكم",
  },

  Exercises: {
    fr: "Exercices",
    ar: "التمارين",
  },

  Courses: {
    fr: "Cours",
    ar: "الدروس",
  },

  Quizzes: {
    fr: "Quiz",
    ar: "الاختبارات",
  },

  Results: {
    fr: "Résultats",
    ar: "النتائج",
  },

  Notifications: {
    fr: "Notifications",
    ar: "الإشعارات",
  },

  "Welcome Back!": {
    fr: "Bon retour !",
    ar: "مرحباً بعودتك!",
  },

  Username: {
    fr: "Nom d'utilisateur",
    ar: "اسم المستخدم",
  },

  Password: {
    fr: "Mot de passe",
    ar: "كلمة المرور",
  },

  "Enter your username": {
    fr: "Entrez votre nom d'utilisateur",
    ar: "أدخل اسم المستخدم",
  },

  "Enter your password": {
    fr: "Entrez votre mot de passe",
    ar: "أدخل كلمة المرور",
  },

  Save: {
    fr: "Enregistrer",
    ar: "حفظ",
  },

  Cancel: {
    fr: "Annuler",
    ar: "إلغاء",
  },

  Update: {
    fr: "Mettre à jour",
    ar: "تحديث",
  },

  Delete: {
    fr: "Supprimer",
    ar: "حذف",
  },

  Add: {
    fr: "Ajouter",
    ar: "إضافة",
  },

  Level: {
    fr: "Niveau",
    ar: "المستوى",
  },

  Beginner: {
    fr: "Débutant",
    ar: "مبتدئ",
  },

  Intermediate: {
    fr: "Intermédiaire",
    ar: "متوسط",
  },

  Advanced: {
    fr: "Avancé",
    ar: "متقدم",
  },

  Expert: {
    fr: "Expert",
    ar: "خبير",
  },

  "Add Course": {
    fr: "Ajouter un cours",
    ar: "إضافة درس",
  },

  "Add Exercise": {
    fr: "Ajouter un exercice",
    ar: "إضافة تمرين",
  },

  "Create Quiz": {
    fr: "Créer un quiz",
    ar: "إنشاء اختبار",
  },

  "My Students": {
    fr: "Mes élèves",
    ar: "طلابي",
  },

  "Student Results": {
    fr: "Résultats des élèves",
    ar: "نتائج الطلاب",
  },

  "No notifications yet": {
    fr: "Aucune notification",
    ar: "لا توجد إشعارات بعد",
  },

  "Loading SmartMath...": {
    fr: "Chargement de SmartMath...",
    ar: "جارٍ تحميل SmartMath...",
  },

  "Oops! Page not found": {
    fr: "Oups ! Page introuvable",
    ar: "عذراً! الصفحة غير موجودة",
  },
};

// Translation helper
export function translate(text, lang) {
  if (lang === "en") return null;

  const trimmed = text.trim();

  if (!trimmed) return null;

  const hit = DICT[trimmed];

  if (!hit) return null;

  const translated = hit[lang];

  // Preserve spaces
  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";

  return leading + translated + trailing;
}
