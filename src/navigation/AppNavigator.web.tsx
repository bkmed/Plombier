import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleFavoriteAction, addListing, updateListing, deleteListing } from '../store/slices/partsSlice';
import { addCategory, updateCategory, deleteCategory } from '../store/slices/categoriesSlice';
import { addUser, updateUser } from '../store/slices/usersSlice';
import { updatePlombierSettings } from '../store/slices/plombierSettingsSlice';
import { useAuth } from '../context/AuthContext';
import { User } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { ServiceIcon, ServiceIconName } from '../components/ServiceIcon';
import { isValidEmail, isValidPhone } from '../utils/validation';

// ==========================================
// BRAND LOGO SVG
// ==========================================
const LogoSVG = ({ size = 44, className = "" }: { size?: number; className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="48" fill="#1E3A5F" />
      <line x1="30" y1="70" x2="70" y2="30" stroke="white" strokeWidth="16" strokeLinecap="round" />
      <line x1="30" y1="70" x2="70" y2="30" stroke="#1E3A5F" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="50" x2="50" y2="12" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="50" y2="88" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="12" y2="50" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="88" y2="50" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="23" y2="23" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="77" y2="23" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="23" y2="77" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="77" y2="77" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="8" stroke="#F97316" strokeWidth="4" fill="#1E3A5F" />
    </svg>
  );
};

// ==========================================
// HIGH-FIDELITY PRODUCT SVGS FOR MARKETPLACE
// ==========================================
const FaucetSVG = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M25 80 h50" strokeWidth="4" stroke="#475569" />
    <path d="M40 80 V42 c0 -12 8 -22 22 -22 h8" strokeWidth="6" stroke="#64748B" />
    <path d="M70 20 v8" strokeWidth="5" stroke="#94A3B8" />
    <path d="M66 28 h8" strokeWidth="2" stroke="#475569" />
    <path d="M32 50 h12" strokeWidth="4.5" stroke="#334155" />
    <circle cx="32" cy="50" r="3.5" fill="#EF4444" stroke="none" />
    <circle cx="44" cy="50" r="3.5" fill="#3B82F6" stroke="none" />
    <path d="M43 35 c0 -5 5 -10 10 -10" stroke="white" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const BoilerSVG = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="25" y="15" width="50" height="66" rx="6" fill="#F8FAFC" stroke="#334155" strokeWidth="3" />
    <rect x="42" y="24" width="16" height="4" rx="1" fill="#1E3A5F" stroke="none" />
    <rect x="38" y="55" width="24" height="12" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
    <circle cx="44" cy="72" r="2.5" fill="#64748B" />
    <circle cx="56" cy="72" r="2.5" fill="#64748B" />
    <path d="M35 81 v10" stroke="#B45309" strokeWidth="4.5" />
    <path d="M50 81 v10" stroke="#CBD5E1" strokeWidth="4" />
    <path d="M65 81 v10" stroke="#B45309" strokeWidth="4.5" />
    <circle cx="35" cy="86" r="3.5" fill="#EF4444" stroke="none" />
    <circle cx="65" cy="86" r="3.5" fill="#06B6D4" stroke="none" />
  </svg>
);

const CopperFittingsSVG = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 28 h32 v32" stroke="#EA580C" strokeWidth="8" strokeLinecap="square" />
    <circle cx="22" cy="28" r="5" fill="#C2410C" stroke="none" />
    <circle cx="54" cy="60" r="5" fill="#C2410C" stroke="none" />
    <path d="M52 35 h32 M68 35 v30" stroke="#EA580C" strokeWidth="7" />
    <circle cx="52" cy="35" r="4.5" fill="#C2410C" stroke="none" />
    <circle cx="84" cy="35" r="4.5" fill="#C2410C" stroke="none" />
    <circle cx="68" cy="65" r="4.5" fill="#C2410C" stroke="none" />
    <rect x="30" y="72" width="28" height="10" rx="1.5" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
  </svg>
);

// ==========================================
// LOCAL MODELS & TRANSLATIONS
// ==========================================
type Role = 'anonyme' | 'user' | 'admin';

type WebSessionUser = User & {
  city?: string;
};

interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  condition: 'comme neuf' | 'bon état' | 'pour pièces';
  category: string;
  description: string;
  image: string; // 'faucet' | 'boiler' | 'copper_fittings'
  isFeatured?: boolean;
  isAvailable?: boolean;
}

interface LocalCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const translations = {
  FR: {
    accueil: "Accueil",
    services: "Services",
    zones: "Zone d'intervention",
    pieces: "Pièces d'occasion",
    mon_profil: "Profil",
    paiement: "Paiement",
    admin: "Admin",
    tagline: "Plomberie · Climatisation · Gaz · Chauffage",
    whatsapp_msg: "Bonjour, j'ai besoin d'un plombier.",
    devis_msg: "Bonjour, je souhaite demander un devis pour le service : ",
    call: "Appeler",
    whatsapp: "WhatsApp",
    demander_devis: "Demander un devis",
    maintenance: "BIENTÔT DISPONIBLE",
    bientot_dispo: "Paiement en ligne",
    maintenance_desc: "Nous mettons en place notre passerelle de paiement sécurisé pour la Tunisie (ClicToPay / Sobflous). Bientôt, commandez vos pièces d'occasion avec livraison à domicile !",
    avertir: "M'avertir",
    progression: "Avancement de l'intégration",
    retour_accueil: "Retour à l'accueil",
    resume_commande: "Résumé de la commande",
    tableau_bord: "Tableau de Bord",
    tableau_bord_desc: "Gérez vos informations personnelles et retrouvez vos pièces de rechange coup de cœur.",
    compte_particulier: "Client Particulier",
    securite: "Sécurité & Mot de Passe",
    mdp_actuel: "Mot de passe actuel",
    nouveau_mdp: "Nouveau mot de passe",
    mettre_a_jour: "Mettre à jour le mot de passe",
    mes_favoris: "Mes Favoris",
    parcourir_market: "Parcourir le catalogue",
    plus_favoris: "Envie d'autres pièces ?",
    plus_favoris_desc: "Ajoutez un cœur à nos articles d'occasion pour les sauvegarder instantanément ici.",
    consulter: "Fiche technique",
    nos_services: "Nos Services",
    nos_services_subtitle: "Des interventions plomberie, climatisation, gaz et chauffage pensées pour des logements fiables toute l'année.",
    voir_tout: "Voir tout",
    services_title: "Nos Services",
    services_subtitle: "Des interventions plomberie, climatisation, gaz et chauffage pensées pour des logements fiables toute l'année.",
    view_all: "Voir tout",
    admin_edit_email: "Modifier l'e-mail admin",
    admin_edit_phone: "Modifier le WhatsApp support",
    support_whatsapp: "WhatsApp support",
    villes_couvertes: "Villes couvertes",
    appeler_whatsapp: "Contacter WhatsApp",
    nom_complet: "Nom complet",
    telephone: "Téléphone",
    ville: "Ville",
    nos_expertises: "Nos Expertises Techniques",
    expertises_desc: "Dépannages et rénovations sanitaires professionnelles sur tout le Grand Tunis et le Sahel.",
    plomberie_generale: "Plomberie Générale",
    plomberie_desc_1: "Détection de fuites par caméra thermique",
    plomberie_desc_2: "Installation de robinetterie haut de gamme",
    plomberie_desc_3: "Remplacement de colonnes d'évacuation",
    climatisation: "Climatisation",
    clim_desc_1: "Recharge de gaz réfrigérant R410/R32",
    clim_desc_2: "Nettoyage antibactérien certifié",
    clim_desc_3: "Optimisation de consommation énergétique",
    installation_gaz: "Installation Gaz",
    gaz_desc_1: "Mise en conformité des installations STEG",
    gaz_desc_2: "Pose de détecteurs de monoxyde de carbone",
    gaz_desc_3: "Raccordement sécurisé cuisinières/chaudières",
    chauffage_central: "Chauffage Central",
    chauffage_desc_1: "Entretien annuel complet de chaudière",
    chauffage_desc_2: "Désembouage hydrodynamique de circuit",
    chauffage_desc_3: "Régulation intelligente par thermostat connecté",
    experience_val: "15+",
    experience_lbl: "Années d'Expérience",
    dispo_val: "24/7",
    dispo_lbl: "Disponibilité",
    gov_val: "24",
    gov_lbl: "Gouvernorats Couverts",
    satisfaction_val: "100%",
    satisfaction_lbl: "Satisfaction Client",
    credits: "© 2026 Plombier Tunisie. Tous droits réservés.",
    foot_desc: "Le premier écosystème professionnel en Tunisie spécialisé dans le dépannage de plomberie express et la revente de pièces de rechange révisées.",
    navigation: "Navigation",
    informations: "Informations",
    politique: "Politique de confidentialité",
    conditions_util: "Conditions d'utilisation",
    plan_site: "Plan du site",
    boutique_acces: "Accéder au marketplace",
    filtres: "Filtres",
    toutes_categories: "Toutes les catégories",
    rechercher: "Rechercher une pièce...",
    prix: "Prix",
    etat: "État",
    tous: "Tous",
    tri: "Trier par",
    nouveautes: "Nouveautés",
    prix_croissant: "Prix : bas à élevé",
    prix_decroissant: "Prix : élevé à bas",
    recommande: "Recommandés",
    aucun_produit: "Aucun article ne correspond à votre recherche.",
    contactez_experts: "Demander une Intervention Immédiate",
    zone_tagline: "Des équipes d'artisans plombiers prêtes à intervenir en urgence sur le Grand Tunis et le Sahel. Intervention garantie sous 30 minutes.",
    demande_intervention: "Formulaire d'intervention urgente",
    contact_immediat: "Appel d'Urgence",
    carte_interactive: "Zone de Couverture Directe",
    ouvrir_maps: "Google Maps direct",
    envoyer_demande: "Soumettre ma demande d'urgence",
    zones_directes: "Intervention Immédiate 24h/24",
    appelez_nous: "Appelez-nous"
  },
  AR: {
    accueil: "الرئيسية",
    services: "الخدمات",
    zones: "مناطق التدخل",
    pieces: "قطع غيار مستعملة",
    mon_profil: "الملف الشخصي",
    paiement: "الدفع الإلكتروني",
    admin: "الإدارة",
    tagline: "ترصيص · تكييف · غاز · تدفئة مركزية",
    whatsapp_msg: "مرحباً، أحتاج إلى سباك محترف.",
    devis_msg: "مرحباً، أود طلب كشف وتقدير لخدمة: ",
    call: "اتصال مباشر",
    whatsapp: "واتساب",
    demander_devis: "طلب تقدير سعر",
    maintenance: "قريباً جداً",
    bientot_dispo: "الدفع الإلكتروني الآمن",
    maintenance_desc: "نحن بصدد دمج بوابة دفع إلكتروني تونسية آمنة (ClicToPay / Sobflous). قريباً، ستتمكن من طلب قطع الغيار المستعملة مباشرة والدفع عبر الإنترنت مع التوصيل لباب منزلك !",
    avertir: "أعلمني عند الإطلاق",
    progression: "نسبة تقدم الإنجاز",
    retour_accueil: "العودة للرئيسية",
    resume_commande: "ملخص الطلبية",
    tableau_bord: "لوحة التحكم",
    tableau_bord_desc: "قم بإدارة بياناتك الشخصية واستعرض قطع الغيار التي أضفتها للمفضلة.",
    compte_particulier: "حساب حريف",
    securite: "الأمان وكلمة المرور",
    mdp_actuel: "كلمة المرور الحالية",
    nouveau_mdp: "كلمة المرور الجديدة",
    mettre_a_jour: "تحديث كلمة المرور",
    mes_favoris: "المفضلة لدي",
    parcourir_market: "تصفح كتالوج قطع الغيار",
    plus_favoris: "تبحث عن قطع أخرى ؟",
    plus_favoris_desc: "قم بإضافة إعجاب (قلب) على قطع الغيار لحفظها هنا والرجوع إليها بسهولة.",
    consulter: "التفاصيل التقنية",
    nos_services: "خدماتنا",
    nos_services_subtitle: "تدخلات في الترصيص والتكييف والغاز والتدفئة لضمان منزل آمن وعملي طوال السنة.",
    voir_tout: "عرض الكل",
    services_title: "خدماتنا",
    services_subtitle: "تدخلات في الترصيص والتكييف والغاز والتدفئة لضمان منزل آمن وعملي طوال السنة.",
    view_all: "عرض الكل",
    admin_edit_email: "تعديل بريد المدير",
    admin_edit_phone: "تعديل واتساب الدعم",
    support_whatsapp: "واتساب الدعم",
    villes_couvertes: "المدن المغطاة",
    appeler_whatsapp: "تواصل عبر واتساب",
    nom_complet: "الاسم الكامل",
    telephone: "الهاتف",
    ville: "المدينة",
    nos_expertises: "خبراتنا الفنية المعتمدة",
    expertises_desc: "خدمات ترصيص وتصليح سريعة ومحترفة في تونس الكبرى وجهة الساحل.",
    plomberie_generale: "الترصيص العام والسباكة",
    plomberie_desc_1: "كشف التسربات بالكاميرا الحرارية الحديثة",
    plomberie_desc_2: "تركيب خلاطات وصنابير مياه راقية وذكية",
    plomberie_desc_3: "تجديد وصيانة شبكات الصرف الصحي بالكامل",
    climatisation: "تكييف الهواء وتبريده",
    clim_desc_1: "شحن غاز التبريد R410/R32 للمكيفات",
    clim_desc_2: "تنظيف وتعقيم دوري مضاد للبكتيريا",
    clim_desc_3: "تعديل وصيانة المكيفات لتوفير استهلاك الكهرباء",
    installation_gaz: "تركيبات الغاز المنزلي",
    gaz_desc_1: "مطابقة التوصيلات لمعايير الشركة التونسية للكهرباء والغاز",
    gaz_desc_2: "تركيب أجهزة إنذار متطورة لكشف تسرب أحادي أكسيد الكربون",
    gaz_desc_3: "توصيل الغاز بأمان تام للطباخات والمراجل",
    chauffage_central: "التدفئة المركزية والمراجل",
    chauffage_desc_1: "الصيانة السنوية الشاملة للمراجل والمشعات",
    chauffage_desc_2: "تنظيف وإزالة الترسبات الكلسية من الأنابيب",
    chauffage_desc_3: "التحكم الذكي والتحكم عن بعد في درجة الحرارة",
    experience_val: "+15",
    experience_lbl: "سنة من الخبرة",
    dispo_val: "24/7",
    dispo_lbl: "جاهزية تامة",
    gov_val: "24",
    gov_lbl: "ولاية مغطاة",
    satisfaction_val: "100%",
    satisfaction_lbl: "رضا الحرفاء التام",
    credits: "© 2026 سباك تونس. جميع الحقوق محفوظة.",
    foot_desc: "أول شبكة خدمات وتجارة إلكترونية في تونس متخصصة في التدخلات السريعة لترصيص المياه وتوفير قطع الغيار المضمونة والمجربة.",
    navigation: "أقسام الموقع",
    informations: "معلومات قانونية",
    politique: "سياسة الخصوصية والأمان",
    conditions_util: "شروط الاستخدام العامة",
    plan_site: "خريطة الموقع التقنية",
    boutique_acces: "الذهاب إلى سوق قطع الغيار",
    filtres: "تصفية البحث",
    toutes_categories: "جميع الأصناف",
    rechercher: "ابحث عن قطعة...",
    prix: "السعر",
    etat: "الحالة",
    tous: "الكل",
    tri: "ترتيب حسب",
    nouveautes: "المضافة حديثاً",
    prix_croissant: "السعر: من الأقل للأعلى",
    prix_decroissant: "السعر: من الأعلى للأقل",
    recommande: "المميزة",
    aucun_produit: "لم نجد أي قطعة تتطابق مع معايير البحث.",
    contactez_experts: "طلب تدخل طارئ وفوري",
    zone_tagline: "فرقنا الفنية جاهزة للتدخل العاجل والسريع في كامل ولايات تونس الكبرى والساحل. نصلك في غضون 30 دقيقة كأقصى تقدير.",
    demande_intervention: "استمارة طلب تدخل عاجل",
    contact_immediat: "خط الطوارئ الساخن",
    carte_interactive: "مناطق التغطية المباشرة",
    ouvrir_maps: "فتح خرائط جوجل مباشرة",
    envoyer_demande: "إرسال طلب التدخل العاجل",
    zones_directes: "التدخل الفوري على مدار الساعة",
    appelez_nous: "اتصل بنا فوراً"
  },
  EN: {
    accueil: "Home",
    services: "Services",
    zones: "Service Areas",
    pieces: "Used Parts",
    mon_profil: "Profile",
    paiement: "Payment",
    admin: "Admin",
    tagline: "Plumbing · Air Conditioning · Gaz · Heating",
    whatsapp_msg: "Hello, I need a plumber.",
    devis_msg: "Hello, I would like to request a quote for: ",
    call: "Call",
    whatsapp: "WhatsApp",
    demander_devis: "Request a Quote",
    maintenance: "COMING SOON",
    bientot_dispo: "Online Payment",
    maintenance_desc: "We are setting up our secure online payment gateway for Tunisia (ClicToPay / Sobflous). Soon you will be able to order used parts with home delivery!",
    avertir: "Notify Me",
    progression: "Integration Progress",
    retour_accueil: "Back to Home",
    resume_commande: "Order Summary",
    tableau_bord: "Dashboard",
    tableau_bord_desc: "Manage your personal information and view your favorite spare parts.",
    compte_particulier: "Individual Customer",
    securite: "Security & Password",
    mdp_actuel: "Current password",
    nouveau_mdp: "New password",
    mettre_a_jour: "Update password",
    mes_favoris: "My Favorites",
    parcourir_market: "Browse Catalog",
    plus_favoris: "Looking for more parts?",
    plus_favoris_desc: "Add a heart to our used items to save them here instantly.",
    consulter: "Technical Details",
    nos_services: "Our Services",
    nos_services_subtitle: "Plumbing, AC, gas, and heating interventions for reliable homes all year.",
    voir_tout: "View all",
    services_title: "Services",
    services_subtitle: "Plumbing, AC, gas, and heating interventions for reliable homes all year.",
    view_all: "View all",
    admin_edit_email: "Edit admin email",
    admin_edit_phone: "Edit support WhatsApp",
    support_whatsapp: "Support WhatsApp",
    villes_couvertes: "Covered cities",
    appeler_whatsapp: "Contact WhatsApp",
    nom_complet: "Full name",
    telephone: "Phone",
    ville: "City",
    nos_expertises: "Our Technical Expertise",
    expertises_desc: "Professional plumbing repairs and renovations across Greater Tunis and the Sahel region.",
    plomberie_generale: "General Plumbing",
    plomberie_desc_1: "Thermal camera leak detection",
    plomberie_desc_2: "High-end faucet installation",
    plomberie_desc_3: "Drain pipe replacement",
    climatisation: "Air Conditioning",
    clim_desc_1: "R410/R32 refrigerant gas recharge",
    clim_desc_2: "Certified anti-bacterial cleaning",
    clim_desc_3: "Energy consumption optimization",
    installation_gaz: "Gas Installation",
    gaz_desc_1: "STEG compliance checks",
    gaz_desc_2: "Carbon monoxide detector installation",
    gaz_desc_3: "Safe connection for stoves and boilers",
    chauffage_central: "Central Heating",
    chauffage_desc_1: "Full annual boiler maintenance",
    chauffage_desc_2: "Hydrodynamic loop flushing",
    chauffage_desc_3: "Smart regulation with connected thermostat",
    experience_val: "15+",
    experience_lbl: "Years of Experience",
    dispo_val: "24/7",
    dispo_lbl: "Availability",
    gov_val: "24",
    gov_lbl: "Governorates Covered",
    satisfaction_val: "100%",
    satisfaction_lbl: "Customer Satisfaction",
    credits: "© 2026 Plumber Tunisia. All rights reserved.",
    foot_desc: "The premier professional ecosystem in Tunisia specialized in express plumbing troubleshooting and certified used spare parts reselling.",
    navigation: "Navigation",
    informations: "Legal Information",
    politique: "Privacy Policy",
    conditions_util: "Terms of Service",
    plan_site: "Site Map",
    boutique_acces: "Access Marketplace",
    filtres: "Filters",
    toutes_categories: "All Categories",
    rechercher: "Search for a part...",
    prix: "Price",
    etat: "Condition",
    tous: "All",
    tri: "Sort by",
    nouveautes: "New Arrivals",
    prix_croissant: "Price: low to high",
    prix_decroissant: "Price: high to low",
    recommande: "Recommended",
    aucun_produit: "No articles found matching your criteria.",
    contactez_experts: "Request Immediate Intervention",
    zone_tagline: "Teams of skilled plumbers ready to intervene immediately in Greater Tunis and the Sahel. Guaranteed response within 30 minutes.",
    demande_intervention: "Emergency Request Form",
    contact_immediat: "Emergency Hot Line",
    carte_interactive: "Direct Coverage Zone",
    ouvrir_maps: "Open Google Maps",
    envoyer_demande: "Submit Emergency Request",
    zones_directes: "Immediate 24/7 Intervention",
    appelez_nous: "Call Us Now"
  }
};

export const AppNavigator = () => {
  const { user: authUser, signIn, signOut } = useAuth();
  const { showToast } = useToast();

  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.parts.listings);
  const favorites = useSelector((state: RootState) => state.parts.favorites);
  const reduxCategories = useSelector((state: RootState) => state.categories.items);
  const usersList = useSelector((state: RootState) => state.users.items);
  const plombierSettings = useSelector((state: RootState) => state.plombierSettings);

  // Initial Seed for Categories inside Redux on Mount
  useEffect(() => {
    if (reduxCategories.length === 0) {
      const initialCats: LocalCategory[] = [
        { id: 'cat-1', name: 'Robinetterie', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'cat-2', name: 'Chauffe-eau', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'cat-3', name: 'Canalisation', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'cat-4', name: 'Climatisation', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'cat-5', name: 'Radiateurs', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'cat-6', name: 'Vannes', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'cat-7', name: 'Autre', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];
      initialCats.forEach(cat => dispatch(addCategory(cat)));
    }
  }, [reduxCategories, dispatch]);

  // Main Authentication State
  const [sessionUser, setSessionUser] = useState<WebSessionUser | null>(null);
  const [bypassAuth, setBypassAuth] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>('anonyme');

  // Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Theme & Language
  const [currentLang, setCurrentLang] = useState<'FR' | 'AR' | 'EN'>('FR');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Active Tab
  // User tabs: 'Accueil' | 'Services' | 'Zones' | 'Marketplace' | 'Profile' | 'Payment'
  // Admin tabs: 'AdminAccueil' | 'GestionAnnonce' | 'GestionCategorie' | 'GestionUser' | 'AdminProfile' | 'Analytics'
  const [activeTab, setActiveTab] = useState<string>('Accueil');

  // Auth Forms
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCity, setSignupCity] = useState('Tunis');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Profile forms
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [businessNameInput, setBusinessNameInput] = useState('');
  const [experienceYearsInput, setExperienceYearsInput] = useState('');
  const [currentMdp, setCurrentMdp] = useState('');
  const [newMdp, setNewMdp] = useState('');

  // Marketplace Modal & Filters
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Toutes');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState('Tous');
  const [priceMax, setPriceMax] = useState(600);
  const [sortBy, setSortBy] = useState('featured');

  // Interactive SVG Map click tracker
  const [selectedGovernorat, setSelectedGovernorat] = useState<string | null>(null);

  // Intervention Quick Form
  const [interventionName, setInterventionName] = useState('');
  const [interventionPhone, setInterventionPhone] = useState('');
  const [interventionGov, setInterventionGov] = useState('Tunis');
  const [interventionProblem, setInterventionProblem] = useState("Fuite d'eau");
  const [interventionDetails, setInterventionDetails] = useState('');

  // Newsletter form
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Admin announcement modal/form state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [annonceTitle, setAnnonceTitle] = useState('');
  const [annonceSubtitle, setAnnonceSubtitle] = useState('');
  const [annonceCategory, setAnnonceCategory] = useState('Robinetterie');
  const [annoncePrice, setAnnoncePrice] = useState(0);
  const [annonceCondition, setAnnonceCondition] = useState<'comme neuf' | 'bon état' | 'pour pièces'>('comme neuf');
  const [annonceDescription, setAnnonceDescription] = useState('');
  const [annonceImage, setAnnonceImage] = useState('faucet');
  const [annonceIsFeatured, setAnnonceIsFeatured] = useState(false);
  const [annonceIsAvailable, setAnnonceIsAvailable] = useState(true);

  // Admin Category form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<LocalCategory | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Quick WhatsApp pre-filled technical messages
  const t = translations[currentLang];
  const isRTL = currentLang === 'AR';
  const businessName = plombierSettings.businessName || 'Plombier Tunisie';
  const experienceYears = plombierSettings.experienceYears || 15;
  const languageOrder: Array<'FR' | 'AR' | 'EN'> = ['FR', 'AR', 'EN'];
  const nextLanguage = languageOrder[(languageOrder.indexOf(currentLang) + 1) % languageOrder.length];
  const supportWhatsAppNumber = profilePhone || sessionUser?.phone || '+216 22 000 111';
  const supportWhatsAppDigits = supportWhatsAppNumber.replace(/\D/g, '') || '21622000111';
  const coverageCities = [
    { city: 'Tunis', area: 'Grand Tunis' },
    { city: 'Ariana', area: 'Grand Tunis' },
    { city: 'Ben Arous', area: 'Grand Tunis' },
    { city: 'La Manouba', area: 'Grand Tunis' },
    { city: 'Sousse', area: 'Sahel' },
    { city: 'Monastir', area: 'Sahel' },
    { city: 'Mahdia', area: 'Sahel' },
    { city: 'Sfax', area: 'Sud Est' },
  ];

  const startWebSession = async (userData: WebSessionUser, tab: string) => {
    setSessionUser(userData);
    setCurrentRole(userData.role);
    setBypassAuth(true);
    setActiveTab(tab);
    await signIn(userData);
  };

  // Splash Screen progress timer
  useEffect(() => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 22 + 9;
      if (prog >= 100) {
        prog = 100;
        setLoadingProgress(100);
        clearInterval(interval);
        setTimeout(() => setShowSplash(false), 450);
      } else {
        setLoadingProgress(Math.round(prog));
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Sync profile forms when user session changes
  useEffect(() => {
    if (sessionUser) {
      setProfileName(sessionUser.name);
      setProfileEmail(sessionUser.email);
      setProfilePhone(sessionUser.phone || '+216 22 456 789');
      setProfileCity(sessionUser.city || 'Tunis');
    }
  }, [sessionUser]);

  useEffect(() => {
    setBusinessNameInput(businessName);
    setExperienceYearsInput(String(experienceYears));
  }, [businessName, experienceYears]);

  useEffect(() => {
    if (!authUser || sessionUser) return;

    const restoredUser: WebSessionUser = {
      ...authUser,
      role: authUser.role as Role,
      city: authUser.addresses?.[0] || 'Tunis',
    };
    setSessionUser(restoredUser);
    setCurrentRole(restoredUser.role);
    setBypassAuth(true);
    setActiveTab(restoredUser.role === 'admin' ? 'AdminAccueil' : 'Accueil');
  }, [authUser, sessionUser]);

  // Synchronize currentTheme with html root element to enable Tailwind's dark: variant class
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  // Favorite hearts handler
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentRole === 'anonyme') {
      showToast(currentLang === 'AR' ? 'يرجى تسجيل الدخول لحفظ المفضلة' : 'Veuillez vous connecter pour gérer vos favoris.', 'info');
      return;
    }
    dispatch(toggleFavoriteAction(id));
    if (favorites.includes(id)) {
      showToast(currentLang === 'AR' ? 'تمت إزالته من المفضلة' : 'Retiré des favoris', 'info');
    } else {
      showToast(currentLang === 'AR' ? 'أضيف إلى المفضلة !' : 'Ajouté aux favoris !', 'success');
    }
  };

  // Sign In submit handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signinEmail || !signinPassword) {
      showToast(currentLang === 'AR' ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Veuillez remplir tous les champs', 'error');
      return;
    }

    // Demo Admin Check
    if (signinEmail.toLowerCase() === 'admin@stouchy.com' && signinPassword === 'admin123') {
      const adminSession: WebSessionUser = { id: 'admin-web-demo', name: 'Admin Plombier', email: 'admin@stouchy.com', role: 'admin', phone: '+216 22 000 111', status: 'active', addresses: ['Tunis'], city: 'Tunis' };
      await startWebSession(adminSession, 'AdminAccueil');
      showToast(currentLang === 'AR' ? 'مرحباً بك حضرة المدير' : 'Bienvenue dans votre espace d\'administration !', 'success');
      return;
    }

    // Demo User Check
    if (signinEmail.toLowerCase() === 'user@stouchy.com' && signinPassword === 'user123') {
      const userSession: WebSessionUser = { id: 'user-web-demo', name: 'Ahmed Ben Ali', email: 'user@stouchy.com', role: 'user', phone: '+216 22 456 789', status: 'active', addresses: ['Ariana'], city: 'Ariana' };
      await startWebSession(userSession, 'Accueil');
      showToast(currentLang === 'AR' ? 'مرحباً بك أحمد بن علي' : 'Ravi de vous revoir, Ahmed Ben Ali !', 'success');
      return;
    }

    // Check custom registrations in Redux list
    const foundUser = usersList.find(u => u.email.toLowerCase() === signinEmail.toLowerCase());
    if (foundUser) {
      if (foundUser.status === 'rejected') {
        showToast(currentLang === 'AR' ? 'هذا الحساب معطل مؤقتاً' : 'Ce compte est suspendu ou bloqué.', 'error');
        return;
      }
      const customSession: WebSessionUser = { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role as Role, phone: foundUser.phone, status: foundUser.status, addresses: foundUser.addresses, city: foundUser.addresses?.[0] || 'Tunis' };
      await startWebSession(customSession, foundUser.role === 'admin' ? 'AdminAccueil' : 'Accueil');
      showToast(currentLang === 'AR' ? `أهلاً بك ${foundUser.name}` : `Connexion réussie. Bienvenue, ${foundUser.name} !`, 'success');
      return;
    }

    showToast(currentLang === 'AR' ? 'بيانات الاعتماد خاطئة' : 'Identifiants invalides ou incorrects.', 'error');
  };

  // Sign Up submit handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPhone || !signupPassword || !signupConfirmPassword) {
      showToast(currentLang === 'AR' ? 'الرجاء تعبئة كافة الفراغات' : 'Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      showToast(currentLang === 'AR' ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas.', 'error');
      return;
    }

    // Check if email already taken
    const exists = usersList.find(u => u.email.toLowerCase() === signupEmail.toLowerCase());
    if (exists) {
      showToast(currentLang === 'AR' ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'Cette adresse email est déjà enregistrée.', 'error');
      return;
    }

    // Create account inside usersSlice Redux store
    const newUserObj = {
      id: 'usr-' + Date.now(),
      name: signupName,
      email: signupEmail.toLowerCase(),
      phone: signupPhone,
      role: 'user',
      status: 'active' as const,
      addresses: [signupCity],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch(addUser(newUserObj));

    // Sign in immediately
    const customSession: WebSessionUser = { id: newUserObj.id, name: signupName, email: signupEmail.toLowerCase(), role: 'user', phone: signupPhone, status: 'active', addresses: [signupCity], city: signupCity };
    await startWebSession(customSession, 'Accueil');
    showToast(currentLang === 'AR' ? 'تم إنشاء حسابك وتفعيله بنجاح !' : 'Votre compte a été créé avec succès. Bienvenue !', 'success');

    // Reset fields
    setSignupName('');
    setSignupEmail('');
    setSignupPhone('');
    setSignupPassword('');
    setSignupConfirmPassword('');
  };

  // Logout handler
  const handleLogout = async () => {
    setSessionUser(null);
    setCurrentRole('anonyme');
    setBypassAuth(false);
    setActiveTab('Accueil');
    await signOut();
    showToast(currentLang === 'AR' ? 'تم تسجيل خروجك بنجاح' : 'Déconnexion réussie ! A bientôt.', 'info');
  };

  // Filters logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'Toutes' || p.category === selectedCategoryFilter;
    const matchesCondition = selectedConditionFilter === 'Tous' || p.condition === selectedConditionFilter;
    const matchesPrice = p.price <= priceMax;
    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0; // Default featured sort order
  });

  // Admin Announcement CRUD operations
  const openAddAnnonce = () => {
    setEditingProduct(null);
    setAnnonceTitle('');
    setAnnonceSubtitle('');
    setAnnonceCategory(reduxCategories[0]?.name || 'Robinetterie');
    setAnnoncePrice(25);
    setAnnonceCondition('comme neuf');
    setAnnonceDescription('');
    setAnnonceImage('faucet');
    setAnnonceIsFeatured(false);
    setAnnonceIsAvailable(true);
    setShowAdminModal(true);
  };

  const openEditAnnonce = (prod: Product) => {
    setEditingProduct(prod);
    setAnnonceTitle(prod.title);
    setAnnonceSubtitle(prod.subtitle);
    setAnnonceCategory(prod.category);
    setAnnoncePrice(prod.price);
    setAnnonceCondition(prod.condition);
    setAnnonceDescription(prod.description);
    setAnnonceImage(prod.image);
    setAnnonceIsFeatured(!!prod.isFeatured);
    setAnnonceIsAvailable(!!prod.isAvailable);
    setShowAdminModal(true);
  };

  const handleSaveAnnonce = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annonceTitle || !annonceDescription || annoncePrice <= 0) {
      showToast(currentLang === 'AR' ? 'الرجاء تعبئة بيانات الإعلان بشكل صحيح' : 'Données d\'annonce incomplètes.', 'error');
      return;
    }

    if (editingProduct) {
      // Modify Listing Redux
      const updatedItem: Product = {
        ...editingProduct,
        title: annonceTitle,
        subtitle: annonceSubtitle.toUpperCase() || annonceCategory.toUpperCase(),
        category: annonceCategory,
        price: Number(annoncePrice),
        condition: annonceCondition,
        description: annonceDescription,
        image: annonceImage,
        isFeatured: annonceIsFeatured,
        isAvailable: annonceIsAvailable
      };
      dispatch(updateListing(updatedItem));
      showToast(currentLang === 'AR' ? 'تم تحديث الإعلان بنجاح !' : 'L\'annonce a été modifiée avec succès !', 'success');
    } else {
      // Create new Listing Redux
      const newItem: Product = {
        id: 'prod-' + Date.now(),
        title: annonceTitle,
        subtitle: annonceSubtitle.toUpperCase() || annonceCategory.toUpperCase(),
        category: annonceCategory,
        price: Number(annoncePrice),
        condition: annonceCondition,
        description: annonceDescription,
        image: annonceImage,
        isFeatured: annonceIsFeatured,
        isAvailable: annonceIsAvailable
      };
      dispatch(addListing(newItem));
      showToast(currentLang === 'AR' ? 'تم إضافة الإعلان بنجاح !' : 'Nouvelle annonce publiée avec succès !', 'success');
    }

    setShowAdminModal(false);
  };

  const handleDeleteAnnonce = (id: string) => {
    if (window.confirm(currentLang === 'AR' ? 'هل أنت متأكد من حذف هذا الإعلان ؟' : 'Voulez-vous vraiment supprimer cette annonce ?')) {
      dispatch(deleteListing(id));
      showToast(currentLang === 'AR' ? 'تم حذف الإعلان' : 'Annonce supprimée !', 'info');
    }
  };

  // Admin dynamic Categories operations
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    // Check duplicates
    if (reduxCategories.find(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      showToast(currentLang === 'AR' ? 'هذا الصنف موجود بالفعل' : 'Catégorie déjà existante.', 'error');
      return;
    }

    const newCat = {
      id: 'cat-' + Date.now(),
      name: newCategoryName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch(addCategory(newCat));
    showToast(currentLang === 'AR' ? 'تمت إضافة الصنف بنجاح !' : 'Catégorie ajoutée avec succès !', 'success');
    setNewCategoryName('');
  };

  const handleRenameCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;

    const renamed = {
      ...editingCategory,
      name: editCategoryName.trim(),
      updatedAt: new Date().toISOString()
    };
    dispatch(updateCategory(renamed));
    showToast(currentLang === 'AR' ? 'تمت إعادة تسمية الصنف !' : 'Catégorie modifiée !', 'success');
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(currentLang === 'AR' ? `هل أنت متأكد من حذف صنف "${name}" ؟` : `Voulez-vous supprimer la catégorie "${name}" ?`)) {
      dispatch(deleteCategory(id));
      showToast(currentLang === 'AR' ? 'تم حذف الصنف' : 'Catégorie supprimée !', 'info');
    }
  };

  // Admin User status toggles
  const handleToggleUserRole = (userId: string, currentVal: string) => {
    const target = usersList.find(u => u.id === userId);
    if (!target) return;

    const updated = {
      ...target,
      role: currentVal === 'admin' ? 'user' : 'admin',
      updatedAt: new Date().toISOString()
    };
    dispatch(updateUser(updated));
    showToast(currentLang === 'AR' ? 'تم تغيير رتبة المستخدم' : 'Rôle de l\'utilisateur modifié !', 'success');
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const target = usersList.find(u => u.id === userId);
    if (!target) return;

    // Check that we aren't locking ourselves
    if (sessionUser && target.email.toLowerCase() === sessionUser.email.toLowerCase()) {
      showToast(currentLang === 'AR' ? 'لا يمكنك حظر حسابك الخاص !' : 'Impossible de bloquer votre propre compte admin !', 'error');
      return;
    }

    const updated = {
      ...target,
      status: (currentStatus === 'active' ? 'rejected' : 'active') as 'active' | 'rejected',
      updatedAt: new Date().toISOString()
    };
    dispatch(updateUser(updated));
    showToast(
      currentLang === 'AR' 
        ? (currentStatus === 'active' ? 'تم حظر المستخدم بنجاح' : 'تم تنشيط حساب المستخدم') 
        : (currentStatus === 'active' ? 'Utilisateur bloqué avec succès !' : 'Compte réactivé !'), 
      'info'
    );
  };

  const handleAdminProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = profileEmail.trim().toLowerCase();
    const trimmedPhone = profilePhone.trim();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      showToast(currentLang === 'AR' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Veuillez saisir une adresse email valide.', 'error');
      return;
    }

    if (!trimmedPhone || !isValidPhone(trimmedPhone)) {
      showToast(currentLang === 'AR' ? 'الرجاء إدخال رقم هاتف صحيح' : 'Veuillez saisir un numéro de téléphone valide.', 'error');
      return;
    }

    if (sessionUser) {
      const updatedSession = {
        ...sessionUser,
        email: trimmedEmail,
        phone: trimmedPhone,
        addresses: sessionUser.addresses?.length ? sessionUser.addresses : [profileCity || 'Tunis'],
      };
      setSessionUser(updatedSession);
      signIn(updatedSession);

      const storedAdmin = usersList.find(user => user.role === 'admin' && user.email.toLowerCase() === sessionUser.email.toLowerCase());
      if (storedAdmin) {
        dispatch(updateUser({
          ...storedAdmin,
          email: trimmedEmail,
          phone: trimmedPhone,
          updatedAt: new Date().toISOString(),
        }));
      }
    }

    showToast(currentLang === 'AR' ? 'تم تحديث بيانات المدير بنجاح' : 'Coordonnées administrateur mises à jour !', 'success');
  };

  const handleAdminBrandSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedBusinessName = businessNameInput.trim();
    const years = Number(experienceYearsInput);

    if (!trimmedBusinessName) {
      showToast(currentLang === 'AR' ? 'الرجاء إدخال اسم العرض' : 'Veuillez saisir le nom affiché.', 'error');
      return;
    }

    if (!Number.isFinite(years) || years < 1 || years > 80) {
      showToast(currentLang === 'AR' ? 'الرجاء إدخال عدد سنوات صحيح' : 'Veuillez saisir une expérience valide.', 'error');
      return;
    }

    dispatch(updatePlombierSettings({
      businessName: trimmedBusinessName,
      experienceYears: Math.round(years),
    }));
    showToast(currentLang === 'AR' ? 'تم تحديث هوية الموقع' : 'Identité du site mise à jour !', 'success');
  };

  // Product Visual visual components
  const ProductVisual = ({ image, className = "w-16 h-16" }: { image: string; className?: string }) => {
    if (image === 'faucet') return <FaucetSVG className={className} />;
    if (image === 'boiler') return <BoilerSVG className={className} />;
    return <CopperFittingsSVG className={className} />;
  };

  return (
    <div 
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        currentTheme === 'dark' ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ==========================================
          SPLASH SCREEN
          ========================================== */}
      {showSplash && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#0F2942',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.4s ease',
            opacity: loadingProgress === 100 ? 0 : 1,
          }}
        >
          <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
            <LogoSVG size={96} />
          </div>
          <div className="text-center mb-8">
            <div className="text-white text-3xl font-black tracking-tight leading-tight">
              {businessName}
            </div>
            <div className="text-[#F97316] text-[10px] sm:text-xs font-black tracking-widest uppercase mt-2.5">
              {t.tagline}
            </div>
            <div className="text-slate-400/60 text-xs font-bold mt-2 font-arabic">
              سباكة · تكييف · غاز · تدفئة مركزية
            </div>
          </div>

          {/* Loading bar */}
          <div className="w-56 mt-4 mb-3">
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #F97316, #ea580c)',
                  borderRadius: 99,
                  width: `${loadingProgress}%`,
                  transition: 'width 0.15s ease'
                }}
              />
            </div>
          </div>
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">
            {currentLang === 'AR' ? 'جاري تحميل التطبيق الفاخر...' : 'Chargement premium...'} {loadingProgress}%
          </div>
        </div>
      )}

      {/* ==========================================
          FIRST PAGE AUTHENTICATION FLOW
          ========================================== */}
      {!bypassAuth && !sessionUser && (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors duration-300">
          {/* Left panel branding visual presentation (desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#0F2942] to-[#0A1724] p-12 flex-col justify-between overflow-hidden border-r border-slate-200 dark:border-slate-800">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#F97316_0%,transparent_50%)] pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <LogoSVG size={52} />
              <div className="text-left">
                <span className="text-2xl font-black tracking-tight text-white">{businessName}</span>
                <p className="text-[9px] text-[#F97316] font-extrabold tracking-widest uppercase mt-0.5">{translations.FR.tagline}</p>
              </div>
            </div>

            <div className="my-auto space-y-6 relative z-10 text-left">
              <span className="bg-[#F97316] text-white text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider leading-none">
                PLATEFORME ARTISANALE & MARKETPLACE
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Le leader de la plomberie express en Tunisie.
              </h2>
              <p className="text-slate-350 text-sm leading-relaxed font-semibold">
                Bénéficiez de dépannages sanitaires immédiats par des plombiers agréés et d'un marketplace premium pour acheter des pièces détachées d'occasion révisées et garanties.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <div className="text-2xl font-black text-[#F97316]">24h/24</div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase mt-1">Intervention Urgente</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#F97316]">100% testé</div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase mt-1">Garantie Pièces</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-bold relative z-10">
              © 2026 {businessName}. Développé pour les particuliers et professionnels.
            </div>
          </div>

          {/* Right panel login/register panel */}
          <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-slate-100 dark:bg-[#080B11] transition-colors duration-300">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative transition-all duration-300">
              
              {/* Premium Floating Preferences Toolbar */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                {/* Language button */}
                <button 
                  type="button"
                  onClick={() => setCurrentLang(nextLanguage)}
                  className="min-h-[44px] px-3.5 py-2 rounded-lg border text-[10px] font-black tracking-wider uppercase transition shadow-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  {nextLanguage === 'AR' ? 'العربية' : nextLanguage === 'EN' ? 'English' : 'Français'}
                </button>

                {/* Dark Mode toggle icon button */}
                <button 
                  type="button"
                  onClick={() => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center transition shadow-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                  title={currentTheme === 'light' ? 'Activer Mode Sombre' : 'Activer Mode Clair'}
                >
                  {currentTheme === 'light' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Welcome Header */}
              <div className="text-center pt-2">
                <div className="lg:hidden mx-auto mb-4 flex justify-center">
                  <LogoSVG size={56} />
                </div>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                  {authTab === 'signin' 
                    ? (currentLang === 'AR' ? 'تسجيل الدخول' : 'Connexion') 
                    : (currentLang === 'AR' ? 'إنشاء حساب جديد' : 'Inscription')}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-semibold">
                  {authTab === 'signin'
                    ? (currentLang === 'AR' ? 'سجل دخولك للوصول إلى حسابك الفاخر' : 'Connectez-vous pour accéder à votre espace premium.')
                    : (currentLang === 'AR' ? 'قم بإنشاء حسابك المجاني في ثوانٍ معدودة' : 'Créez votre compte client gratuit en quelques secondes.')}
                </p>
              </div>

              {/* SIGN IN FORM */}
              {authTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                      {currentLang === 'AR' ? 'البريد الإلكتروني' : 'Adresse Email'}
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="exemple@email.com"
                      value={signinEmail}
                      onChange={(e) => setSigninEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                      {currentLang === 'AR' ? 'كلمة المرور' : 'Mot de Passe'}
                    </label>
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signinPassword}
                      onChange={(e) => setSigninPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
                  >
                    {currentLang === 'AR' ? 'دخول آمن' : 'Connexion Sécurisée'}
                  </button>

                  {/* PRE-FILL BUTTONS */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-6">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-bold mb-2.5">
                      {currentLang === 'AR' ? 'حسابات التجربة الفورية' : 'COMPTES DE DÉMO DE PLOMBERIE (ACCÈS DIRECT)'}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <button 
                        type="button"
                        onClick={() => {
                          setSigninEmail('user@stouchy.com');
                          setSigninPassword('user123');
                          showToast("Connexion en cours...", "info");
                          setTimeout(() => {
                            const userSession: WebSessionUser = { id: 'user-web-demo', name: 'Ahmed Ben Ali', email: 'user@stouchy.com', role: 'user', phone: '+216 22 456 789', status: 'active', addresses: ['Ariana'], city: 'Ariana' };
                            startWebSession(userSession, 'Accueil');
                            showToast(currentLang === 'AR' ? 'مرحباً بك أحمد بن علي' : 'Ravi de vous revoir, Ahmed Ben Ali !', 'success');
                          }, 250);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-250 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black py-2.5 rounded-lg transition"
                      >
                        Client (Ahmed Ben Ali)
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setSigninEmail('admin@stouchy.com');
                          setSigninPassword('admin123');
                          showToast("Connexion en cours...", "info");
                          setTimeout(() => {
                            const adminSession: WebSessionUser = { id: 'admin-web-demo', name: 'Admin Plombier', email: 'admin@stouchy.com', role: 'admin', phone: '+216 22 000 111', status: 'active', addresses: ['Tunis'], city: 'Tunis' };
                            startWebSession(adminSession, 'AdminAccueil');
                            showToast(currentLang === 'AR' ? 'مرحباً بك حضرة المدير' : 'Bienvenue dans votre espace d\'administration !', 'success');
                          }, 250);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-250 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black py-2.5 rounded-lg transition"
                      >
                        Admin Plombier
                      </button>
                    </div>
                  </div>

                  {/* LINK TO SIGN UP SCREEN */}
                  <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {currentLang === 'AR' ? 'ليس لديك حساب؟' : `Nouveau sur ${businessName} ?`}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('signup');
                          setSigninEmail('');
                          setSigninPassword('');
                        }}
                        className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                      >
                        {currentLang === 'AR' ? 'أنشئ حساباً جديداً' : 'Créer un compte'}
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* SIGN UP FORM */}
              {authTab === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                      {currentLang === 'AR' ? 'الاسم الكامل' : 'Nom Complet'}
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Ahmed Ben Salem"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                        {currentLang === 'AR' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder="nom@email.tn"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                        {currentLang === 'AR' ? 'الهاتف' : 'Téléphone'}
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="+216 22 111 222"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                      {currentLang === 'AR' ? 'المدينة / الولاية' : 'Ville / Gouvernorat'}
                    </label>
                    <select
                      value={signupCity}
                      onChange={(e) => setSignupCity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none transition-colors"
                    >
                      <option value="Tunis">Tunis</option>
                      <option value="Ariana">Ariana</option>
                      <option value="Ben Arous">Ben Arous</option>
                      <option value="Sousse">Sousse</option>
                      <option value="Sfax">Sfax</option>
                      <option value="Monastir">Monastir</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                        {currentLang === 'AR' ? 'كلمة المرور' : 'Mot de Passe'}
                      </label>
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                        {currentLang === 'AR' ? 'تأكيد كلمة المرور' : 'Confirmation'}
                      </label>
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-3.5 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
                  >
                    {currentLang === 'AR' ? 'إنشاء حساب جديد' : 'Créer mon compte client'}
                  </button>

                  {/* LINK TO SIGN IN SCREEN */}
                  <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {currentLang === 'AR' ? 'لديك حساب بالفعل؟' : 'Déjà inscrit ?'}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('signin');
                          setSignupName('');
                          setSignupEmail('');
                          setSignupPhone('');
                          setSignupPassword('');
                          setSignupConfirmPassword('');
                        }}
                        className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                      >
                        {currentLang === 'AR' ? 'تسجيل الدخول' : 'Se connecter'}
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* BYPASS AUTH / CONTINUE AS GUEST */}
              <div className="border-t border-slate-200 dark:border-slate-850 pt-5 text-center flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setBypassAuth(true);
                    setCurrentRole('anonyme');
                    setSessionUser(null);
                    setActiveTab('Accueil');
                    showToast(currentLang === 'AR' ? 'تصفح بصفتك زائر' : 'Accès Invité autorisé.', 'info');
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-850 text-slate-650 hover:text-slate-800 dark:text-slate-350 dark:hover:text-white text-xs font-black py-3.5 rounded-xl transition flex items-center justify-center gap-2 hover:scale-[1.01] transform"
                >
                  <span>{currentLang === 'AR' ? 'المواصلة كزائر (مجهول) ←' : 'Continuer en tant qu\'invité (Anonyme) →'}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          HEADER NAVBAR & PREFERENCES
          ========================================== */}
      {(bypassAuth || sessionUser) && (
        <header className={`sticky top-0 z-50 border-b transition-colors backdrop-blur-md ${
          currentTheme === 'dark' ? 'bg-[#0F172A]/90 border-slate-800' : 'bg-white/95 border-slate-200'
        } shadow-sm`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            {/* Logo area */}
            <button 
              onClick={() => {
                if (currentRole === 'admin') {
                  setActiveTab('AdminAccueil');
                } else {
                  setActiveTab('Accueil');
                }
              }} 
              className="flex items-center gap-3 focus:outline-none"
            >
              <LogoSVG size={44} />
              <div className="text-left">
                <span className={`text-xl font-black tracking-tight ${isRTL ? 'font-arabic font-extrabold' : ''}`}>
                  {businessName}
                </span>
                <p className="text-[9px] text-[#F97316] font-bold tracking-widest uppercase mt-0.5 leading-none">
                  {t.tagline}
                </p>
              </div>
            </button>

            {/* Navigation Tabs based on Role */}
            <nav className="hidden lg:flex items-center gap-7 font-black text-xs uppercase tracking-wider">
              {currentRole === 'admin' ? (
                // ADMIN PANELS: Accueil | Gestion Annonce | Gestion Catégorie | Gestion User | Profil | Analytics
                [
                  { id: 'AdminAccueil', label: currentLang === 'AR' ? 'الرئيسية' : 'Accueil' },
                  { id: 'GestionAnnonce', label: currentLang === 'AR' ? 'إدارة الإعلانات' : 'Gestion Annonce' },
                  { id: 'GestionCategorie', label: currentLang === 'AR' ? 'إدارة الأصناف' : 'Gestion Catégorie' },
                  { id: 'GestionUser', label: currentLang === 'AR' ? 'إدارة المستخدمين' : 'Gestion User' },
                  { id: 'AdminProfile', label: currentLang === 'AR' ? 'ملف الإدارة' : 'Profil' },
                  { id: 'Analytics', label: currentLang === 'AR' ? 'التحليلات الماليّة' : 'Analytics' }
                ].map(link => (
                  <button 
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`transition-colors py-2.5 relative leading-none ${
                      activeTab === link.id ? 'text-[#F97316]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>{link.label}</span>
                    {activeTab === link.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316] rounded-full" />
                    )}
                  </button>
                ))
              ) : (
                // USER PANELS: Accueil | Services | Zone d'intervention | Pièces d'occasion | Profil | Paiement
                [
                  { id: 'Accueil', label: t.accueil },
                  { id: 'Services', label: t.services },
                  { id: 'Zones', label: t.zones },
                  { id: 'Marketplace', label: t.pieces },
                  { id: 'Profile', label: t.mon_profil },
                  { id: 'Payment', label: t.paiement }
                ].map(link => (
                  <button 
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`transition-colors py-2.5 relative leading-none ${
                      activeTab === link.id ? 'text-[#F97316]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>{link.label}</span>
                    {activeTab === link.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316] rounded-full" />
                    )}
                  </button>
                ))
              )}
            </nav>

            {/* Utility Preferences Header Right */}
            <div className="flex items-center gap-3 sm:gap-4 ml-3">
              
              {/* Language toggle button */}
              <button 
                onClick={() => setCurrentLang(nextLanguage)}
                className="min-h-[44px] min-w-[44px] px-3 rounded-lg border text-[11px] font-black shadow-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                {nextLanguage}
              </button>

              {/* Dark mode toggler */}
              <button 
                onClick={() => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
                className="w-9 h-9 rounded-lg border flex items-center justify-center bg-slate-50 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
              >
                {currentTheme === 'light' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                  </svg>
                )}
              </button>

              {/* Logged user badge & Logout option */}
              <div className="flex items-center gap-2">
                {currentRole === 'anonyme' ? (
                  <button 
                    onClick={() => {
                      setBypassAuth(false);
                      setSessionUser(null);
                    }}
                    className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-4.5 py-2.5 rounded-xl transition shadow-md"
                  >
                    {currentLang === 'AR' ? 'تسجيل الدخول' : 'Connexion / S\'inscrire'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="hidden md:inline text-xs font-black bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20 text-[#1E3A5F] dark:text-sky-400 px-3 py-1.5 rounded-lg border border-[#1E3A5F]/10">
                      {sessionUser?.name} ({currentRole.toUpperCase()})
                    </span>
                    <button 
                      onClick={handleLogout}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-3.5 py-2.5 rounded-xl transition shadow-md"
                      title="Déconnexion"
                    >
                      {currentLang === 'AR' ? 'خروج' : 'Déconnexion'}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Dynamic Mobile Nav Header Toggles */}
          <div className="lg:hidden flex overflow-x-auto border-t border-slate-200 dark:border-slate-800 px-4 py-2 gap-3 text-center no-scrollbar">
            {currentRole === 'admin' ? (
              [
                { id: 'AdminAccueil', label: currentLang === 'AR' ? 'الرئيسية' : 'Accueil' },
                { id: 'GestionAnnonce', label: currentLang === 'AR' ? 'الإعلانات' : 'Annonces' },
                { id: 'GestionCategorie', label: currentLang === 'AR' ? 'الأصناف' : 'Catégories' },
                { id: 'GestionUser', label: currentLang === 'AR' ? 'المستخدمين' : 'Membres' },
                { id: 'AdminProfile', label: currentLang === 'AR' ? 'الملف' : 'Profil' },
                { id: 'Analytics', label: currentLang === 'AR' ? 'التحليلات' : 'Analytics' }
              ].map(link => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition ${
                    activeTab === link.id ? 'bg-[#F97316] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {link.label}
                </button>
              ))
            ) : (
              [
                { id: 'Accueil', label: t.accueil },
                { id: 'Services', label: t.services },
                { id: 'Zones', label: t.zones },
                { id: 'Marketplace', label: t.pieces },
                { id: 'Profile', label: t.mon_profil },
                { id: 'Payment', label: t.paiement }
              ].map(link => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition ${
                    activeTab === link.id ? 'bg-[#F97316] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {link.label}
                </button>
              ))
            )}
          </div>
        </header>
      )}

      {/* ==========================================
          MAIN VIEWS ROUTER & SWITCHER
          ========================================== */}
      {(bypassAuth || sessionUser) && (
        <main className="min-h-[calc(100vh-280px)] bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-100 transition-colors duration-300">

          {/* ------------------------------------------
              USER TAB 1: ACCUEIL (HOME VIEW)
              ------------------------------------------ */}
          {activeTab === 'Accueil' && (
            <div className="animate-fade-in text-left bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-100">
              {/* Premium Hero Banner */}
              <section className="relative bg-[#0F172A] text-white py-24 sm:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#F97316_0%,transparent_50%)] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="max-w-3xl">
                    <span className="bg-[#F97316] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
                      Tunisie Dépannage Express 24h/7j
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-6 leading-tight">
                      {currentLang === 'AR' ? 'أفضل وأسرع خدمات الترصيص والصيانة في تونس' : 'Vos Urgences Plomberie Réglées en un Record'}
                    </h1>
                    <p className="text-slate-300 text-base sm:text-lg font-medium mt-4 max-w-xl">
                      {currentLang === 'AR' 
                        ? 'نحن هنا لتلبية جميع احتياجاتكم في صيانة الترصيص، تكييف الهواء، والتدفئة المركزية مع توفير سوق قطع غيار مستعملة وموثوقة.' 
                        : 'Artisans plombiers qualifiés à votre service pour les fuites, pannes thermiques et raccordements gaz dans tout le pays.'}
                    </p>
                    
                    {/* Action buttons CTAs */}
                    <div className="flex flex-wrap items-center gap-4 mt-10">
                      <button 
                        onClick={() => setActiveTab('Zones')}
                        className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-7 py-4 rounded-xl transition shadow-lg inline-flex items-center gap-2 hover:scale-[1.02] transform"
                      >
                        <span>{t.contactez_experts}</span>
                      </button>

                      <a 
                        href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(t.whatsapp_msg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-7 py-4 rounded-xl transition shadow-lg inline-flex items-center gap-2 hover:scale-[1.02] transform"
                      >
                        <span>{t.whatsapp} Support 24/7</span>
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Trust Stats Bar */}
              <section className="bg-slate-150 dark:bg-slate-900/60 py-10 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {[
                      { val: `${experienceYears}+`, lbl: t.experience_lbl, color: 'text-[#1E3A5F] dark:text-sky-400' },
                      { val: t.dispo_val, lbl: t.dispo_lbl, color: 'text-[#F97316]' },
                      { val: t.gov_val, lbl: t.gov_lbl, color: 'text-[#1E3A5F] dark:text-sky-400' },
                      { val: t.satisfaction_val, lbl: t.satisfaction_lbl, color: 'text-emerald-500' }
                    ].map((stat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className={`text-3xl sm:text-4xl font-black tracking-tight ${stat.color}`}>
                          {stat.val}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          {stat.lbl}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Technical Services Key Cards */}
              <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-transparent">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-3xl font-black tracking-tight">
                    {t.nos_services}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
                    {t.nos_services_subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {([
                    { title: t.plomberie_generale, icon: "plumbing", desc: currentLang === 'AR' ? 'إصلاح التسربات وتجديد شبكات المياه المنزلية والعمومية.' : 'Recherche de fuites, installations de sanitaires et de chauffe-eau.' },
                    { title: t.climatisation, icon: "ac", desc: currentLang === 'AR' ? 'تركيب المكيفات، صيانة شاملة وشحن الغاز المعتمد.' : 'Installation de climatiseurs split, recharges de gaz et entretien.' },
                    { title: t.installation_gaz, icon: "gas", desc: currentLang === 'AR' ? 'تمديد وتوصيل مواسير الغاز المنزلي مع السلامة الكلية.' : 'Tuyauteries de gaz conformes, branchements et détection de fuites.' },
                    { title: t.chauffage_central, icon: "heater", desc: currentLang === 'AR' ? 'صيانة وضبط المراجل الحرارية والمشعات للتوفير.' : 'Chaudières, détartrages de radiateurs et régulations connectées.' }
                  ] as Array<{ title: string; icon: ServiceIconName; desc: string }>).map((serv, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTab('Services')}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:border-[#F97316] hover:shadow-lg transition-all duration-300 text-left group hover:-translate-y-1 transform focus:outline-none"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20 flex items-center justify-center text-[#1E3A5F] dark:text-sky-400 group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-colors mb-5">
                        <ServiceIcon name={serv.icon} className="w-6 h-6" title={serv.title} />
                      </div>
                      <h3 className="text-base font-black group-hover:text-[#F97316] transition-colors">{serv.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{serv.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setActiveTab('Services')}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1E3A5F] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-[#152a47] dark:bg-sky-600 dark:hover:bg-sky-500"
                  >
                    {t.voir_tout}
                  </button>
                </div>
              </section>

              {/* Used Parts Showcase Grid */}
              <section className="bg-slate-100 dark:bg-slate-900/60 py-20 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">{t.pieces}</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
                        {currentLang === 'AR' 
                          ? 'استعرض أحدث قطع الغيار المستعملة المضمونة المتوفرة في الكتالوج لدينا.' 
                          : 'Équipez-vous au meilleur prix avec nos pièces d\'occasion révisées et testées.'}
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('Marketplace')}
                      className="text-xs font-black text-[#F97316] hover:underline flex items-center gap-1.5"
                    >
                      <span>{t.boutique_acces}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 4).map(prod => (
                      <div 
                        key={prod.id} 
                        onClick={() => setSelectedProduct(prod)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-[#1E3A5F] dark:hover:border-slate-500 transition-all duration-300 group flex flex-col justify-between cursor-pointer"
                      >
                        {/* Product visual wrapper */}
                        <div className="bg-slate-50 dark:bg-slate-900 py-10 flex items-center justify-center border-b border-slate-100 dark:border-slate-800 relative">
                          <span className="absolute top-3 right-3 z-10 bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-350 text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                            {prod.condition}
                          </span>

                          {/* Heart favorite toggle */}
                          <button 
                            onClick={(e) => toggleFavorite(prod.id, e)}
                            className="absolute top-3 left-3 z-10 w-8 h-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition"
                          >
                            <svg 
                              width="14" height="14" viewBox="0 0 24 24" 
                              fill={favorites.includes(prod.id) ? "currentColor" : "none"} 
                              stroke="currentColor" strokeWidth="2.5"
                              className={favorites.includes(prod.id) ? "text-rose-500" : ""}
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>

                          <ProductVisual image={prod.image} />
                        </div>

                        <div className="p-4 text-left flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider">{prod.category}</span>
                            <h4 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-100 mt-1 leading-tight group-hover:text-[#F97316] transition-colors">
                              {prod.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-750 pt-3 mt-4">
                            <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                              {prod.price} <span className="text-[9px] font-bold">DT</span>
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(prod);
                              }}
                              className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg transition"
                            >
                              {currentLang === 'AR' ? 'اتصل لشراء' : 'Commander'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ------------------------------------------
              USER TAB 2: SERVICES VIEW
              ------------------------------------------ */}
          {activeTab === 'Services' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left bg-slate-50 dark:bg-transparent">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="bg-[#1E3A5F] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
                  {t.nos_services}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-6">
                  {t.nos_services}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 font-semibold">
                  {t.nos_services_subtitle}
                </p>
              </div>

              {/* List of 4 Services with before/after comparative graphics */}
              <div className="space-y-16">
                {([
                  { 
                    name: t.plomberie_generale, 
                    icon: 'plumbing',
                    desc: currentLang === 'AR' ? 'تركيب وتصليح جميع الأجهزة الصحية المنزلية من حنفيات، مصارف، كشف تسرب المياه المجهول وحل المشاكل التقنية المعقدة.' : "Installation, réparation et maintenance de tous vos systèmes sanitaires. Nous intervenons sur les fuites complexes, le débouchage de canalisations, et la rénovation complète de salles de bain.",
                    pts: [t.plomberie_desc_1, t.plomberie_desc_2, t.plomberie_desc_3],
                    whatsapp_text: t.devis_msg + t.plomberie_generale,
                    imgBefore: currentLang === 'AR' ? 'أنابيب نحاسية قديمة ومتآكلة وتسريب مياه مستمر' : "Réseau cuivre vétuste avec fuites régulières",
                    imgAfter: currentLang === 'AR' ? 'شبكة أنابيب نحاسية جديدة وملحومة بمعايير عالية' : "Tubes cuivre neufs avec soudures professionnelles"
                  },
                  { 
                    name: t.climatisation, 
                    icon: 'ac',
                    desc: currentLang === 'AR' ? 'صيانة دورية للمكيفات وتركيب الوحدات وشحن غاز التبريد لضمان استهلاك طاقة مثالي وتبريد ممتاز في الصيف.' : "Expertise complète en systèmes de refroidissement. De l'installation de splits muraux à la maintenance de centrales de climatisation, nous assurons une température optimale.",
                    pts: [t.clim_desc_1, t.clim_desc_2, t.clim_desc_3],
                    whatsapp_text: t.devis_msg + t.climatisation,
                    imgBefore: currentLang === 'AR' ? 'مروحة مكيف متسخة ومترسبة بالغبار والبكتيريا' : "Filtres encrassés provoquant une surconsommation",
                    imgAfter: currentLang === 'AR' ? 'مكيف نظيف ومعقم بالكامل وتبريد ممتاز' : "Turbine nettoyée et désinfectée de fond en comble"
                  },
                  { 
                    name: t.installation_gaz, 
                    icon: 'gas',
                    desc: currentLang === 'AR' ? 'تركيب شبكات الغاز الطبيعي المنزلي والصناعي مع اختبارات صارمة لمنع تسرب الغاز وضمان مطابقتها للمواصفات الحكومية.' : "La sécurité est notre priorité absolue. Nous réalisons vos installations de gaz de ville ou bouteille selon les normes de sécurité les plus strictes de la STEG.",
                    pts: [t.gaz_desc_1, t.gaz_desc_2, t.gaz_desc_3],
                    whatsapp_text: t.devis_msg + t.installation_gaz,
                    imgBefore: currentLang === 'AR' ? 'خرطوم غاز قديم جداً ومهترئ يشكل خطراً كبيراً' : "Raccord souple expiré et robinet de gaz oxydé",
                    imgAfter: currentLang === 'AR' ? 'تمديدات نحاسية ملحومة وآمنة مع صمام أمان نحاسي' : "Tuyauterie cuivre rigide soudée aux normes STEG"
                  },
                  { 
                    name: t.chauffage_central, 
                    icon: 'heater',
                    desc: currentLang === 'AR' ? 'ضبط وصيانة المراجل وشبكات التدفئة المركزية وتطهير المشعات من الرواسب الكلسية لتدفئة متجانسة وقوية.' : "Solutions de chauffage performantes pour un hiver serein. Nous installons des chaudières à condensation haute performance et des radiateurs révisés.",
                    pts: [t.chauffage_desc_1, t.chauffage_desc_2, t.chauffage_desc_3],
                    whatsapp_text: t.devis_msg + t.chauffage_central,
                    imgBefore: currentLang === 'AR' ? 'مشع تدفئة مليء بالرواسب الكلسية والمياه الطينية' : "Radiateurs froids par embouage du circuit d'eau",
                    imgAfter: currentLang === 'AR' ? 'دورة تدفئة مطهرة بالكامل وتدفئة ممتازة' : "Désembouage hydrodynamique et chauffage parfait"
                  }
                ] as Array<{ name: string; icon: ServiceIconName; desc: string; pts: string[]; whatsapp_text: string; imgBefore: string; imgAfter: string }>).map((serv, idx) => (
                  <div 
                    key={idx}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-slate-200 dark:border-slate-800 pb-16 last:border-b-0 last:pb-0 ${
                      idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Descriptions */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white font-extrabold text-sm">
                          <ServiceIcon name={serv.icon} className="w-5 h-5" title={serv.name} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-slate-100">{serv.name}</h2>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-405 leading-relaxed font-semibold">
                        {serv.desc}
                      </p>

                      <ul className="space-y-2.5 font-bold text-xs text-slate-650 dark:text-slate-300">
                        {serv.pts.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      {/* WhatsApp quotation request trigger */}
                      <a
                        href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(serv.whatsapp_text)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-md hover:scale-[1.02] transform"
                      >
                        <span>{t.demander_devis}</span>
                      </a>
                    </div>

                    {/* BEFORE / AFTER VISUAL SLOTS */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-4.5 border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                        <span className="absolute top-2.5 left-2.5 bg-slate-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded uppercase">
                          {currentLang === 'AR' ? 'قبل التدخل' : 'AVANT'}
                        </span>
                        <div className="flex-1 flex items-center justify-center p-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase leading-tight mt-6">
                          {serv.imgBefore}
                        </div>
                        <div className="h-1 bg-amber-500 rounded-full w-full" />
                      </div>

                      <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-4.5 border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                        <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded uppercase">
                          {currentLang === 'AR' ? 'بعد التدخل' : 'APRÈS'}
                        </span>
                        <div className="flex-1 flex items-center justify-center p-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase leading-tight mt-6">
                          {serv.imgAfter}
                        </div>
                        <div className="h-1 bg-emerald-500 rounded-full w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------
              USER TAB 3: ZONES D'INTERVENTION (MAP + LEADS FORM)
              ------------------------------------------ */}
          {activeTab === 'Zones' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="bg-[#1E3A5F] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
                  {t.zones_directes}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-6">
                  {t.zones}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 font-semibold">
                  {t.zone_tagline}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual SVG Map representation (lg:col-span-7) */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[500px]">
                  <div>
                    <h3 className="text-base font-black text-slate-850 dark:text-slate-100">{t.carte_interactive}</h3>
                    <p className="text-slate-400 text-xs mt-1 font-semibold">
                      {currentLang === 'AR' ? 'انقر على الولاية المظللة بالبرتقالي لعرض تفاصيل التغطية الفورية لدينا.' : 'Cliquez sur les gouvernorats oranges pour voir notre temps de réponse moyen.'}
                    </p>
                  </div>

                  {/* Stylized vector SVG of Tunisia coverage areas */}
                  <div className="flex justify-center py-8 relative">
                    <svg width="220" height="380" viewBox="0 0 100 180" fill="none" className="filter drop-shadow-md">
                      {/* Interactive Areas represented as custom shapes */}
                      {/* Bizerte & North */}
                      <path 
                        d="M38 12 C 43 8, 48 9, 52 14 L 46 22 Z" 
                        fill={selectedGovernorat === 'Grand Tunis' ? '#f97316' : '#1e3a5f'} 
                        className="cursor-pointer transition hover:opacity-85" 
                        onClick={() => setSelectedGovernorat('Grand Tunis')}
                      />
                      {/* Grand Tunis */}
                      <path 
                        d="M48 20 C 53 18, 55 24, 52 28 L 45 26 Z" 
                        fill={selectedGovernorat === 'Grand Tunis' ? '#F97316' : '#2563EB'} 
                        className="cursor-pointer transition hover:scale-105 transform origin-center" 
                        onClick={() => setSelectedGovernorat('Grand Tunis')}
                      />
                      {/* Cap Bon */}
                      <path 
                        d="M53 23 C 58 18, 68 20, 61 31 L 52 28 Z" 
                        fill={selectedGovernorat === 'Sahel' ? '#F97316' : '#3B82F6'} 
                        className="cursor-pointer transition hover:opacity-85" 
                        onClick={() => setSelectedGovernorat('Sahel')}
                      />
                      {/* Sahel (Sousse, Monastir, Mahdia) */}
                      <path 
                        d="M52 30 C 58 31, 62 42, 57 52 L 48 40 Z" 
                        fill={selectedGovernorat === 'Sahel' ? '#F97316' : '#1D4ED8'} 
                        className="cursor-pointer transition hover:scale-105 transform origin-center" 
                        onClick={() => setSelectedGovernorat('Sahel')}
                      />
                      {/* Sfax */}
                      <path 
                        d="M46 54 C 54 58, 58 70, 52 82 L 38 72 Z" 
                        fill={selectedGovernorat === 'Sfax' ? '#F97316' : '#60A5FA'} 
                        className="cursor-pointer transition hover:opacity-85" 
                        onClick={() => setSelectedGovernorat('Sfax')}
                      />
                      {/* Rest of Tunisia (Grey representation) */}
                      <path d="M36 24 L44 38 L38 52 L36 68 L22 88 L14 118 L24 140 L38 170 L52 145 L48 112 L44 86 L40 70 Z" fill="#E2E8F0" className="opacity-30 pointer-events-none" />
                    </svg>

                    {/* coverage popover overlay */}
                    {selectedGovernorat && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 text-white p-4.5 rounded-2xl border border-[#F97316]/30 shadow-xl max-w-[220px] backdrop-blur-sm animate-fade-in text-center">
                        <span className="text-[10px] font-black text-[#F97316] uppercase tracking-wider">{selectedGovernorat}</span>
                        <h4 className="text-xs font-black mt-1">Intervention Express</h4>
                        <p className="text-[10.5px] text-slate-350 mt-1 leading-relaxed">
                          {selectedGovernorat === 'Grand Tunis' 
                            ? 'Disponible à Tunis, Ariana, Ben Arous et La Manouba. Artisans sur place en moins de 30 minutes.' 
                            : selectedGovernorat === 'Sahel' 
                              ? 'Disponible à Sousse, Monastir et Mahdia. Temps de réponse moyen de 40 minutes.'
                              : 'Disponible sur commande. Planifiez votre visite technique ou expédiez vos pièces.'}
                        </p>
                        <button 
                          onClick={() => setSelectedGovernorat(null)}
                          className="mt-2.5 text-[9px] font-black text-rose-500 uppercase tracking-widest block mx-auto underline"
                        >
                          Fermer
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
                        {t.villes_couvertes}
                      </h4>
                      <a
                        href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(t.whatsapp_msg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-emerald-700"
                      >
                        {t.appeler_whatsapp}: {supportWhatsAppNumber}
                      </a>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {coverageCities.map((item) => (
                        <div key={item.city} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2">
                          <div className="text-xs font-black text-slate-800 dark:text-slate-100">{item.city}</div>
                          <div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{item.area}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-5 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      * {currentLang === 'AR' ? 'تغطية فورية وسريعة على مدار الساعة' : 'Zone couverte par les équipes d\'intervention directes.'}
                    </span>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-black text-[#1E3A5F] dark:text-sky-400 hover:underline"
                    >
                      {t.ouvrir_maps}
                    </a>
                  </div>
                </div>

                {/* Lead request form (lg:col-span-5) */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-extrabold text-[8.5px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                      {currentLang === 'AR' ? 'حالة طوارئ قصوى' : 'URGENT'}
                    </span>
                    <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 mt-3">{t.demande_intervention}</h2>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!interventionName || !interventionPhone) {
                        showToast(currentLang === 'AR' ? 'الرجاء ملء الاسم والهاتف' : 'Nom et téléphone requis.', 'error');
                        return;
                      }
                      showToast(
                        currentLang === 'AR' 
                          ? 'تم تسجيل طلبك بنجاح ! سيتصل بك الفني الآن.' 
                          : 'Demande urgente enregistrée ! Un technicien vous appelle sous 10 min.', 
                        'success'
                      );
                      setInterventionName('');
                      setInterventionPhone('');
                      setInterventionDetails('');
                    }}
                    className="space-y-4 font-semibold text-xs"
                  >
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">{t.nom_complet} *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Ex: Mohamed Ben Khedher"
                        value={interventionName}
                        onChange={(e) => setInterventionName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest">{t.telephone} *</label>
                      <input 
                        type="text"
                        required
                        placeholder="+216 22 456 789"
                        value={interventionPhone}
                        onChange={(e) => setInterventionPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Gouvernorat</label>
                        <select
                          value={interventionGov}
                          onChange={(e) => setInterventionGov(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                        >
                          <option value="Tunis">Tunis</option>
                          <option value="Ariana">Ariana</option>
                          <option value="Ben Arous">Ben Arous</option>
                          <option value="Sousse">Sousse</option>
                          <option value="Sfax">Sfax</option>
                          <option value="Monastir">Monastir</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Type Problème</label>
                        <select
                          value={interventionProblem}
                          onChange={(e) => setInterventionProblem(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                        >
                          <option value="Fuite d'eau">Fuite d'eau / Tuyau cassé</option>
                          <option value="Panne Chauffe-eau">Chauffe-eau en panne</option>
                          <option value="Climatisation">Problème Climatiseur</option>
                          <option value="Gaz STEG">Tuyauterie Gaz / Sécurité</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Description</label>
                      <textarea 
                        rows={3}
                        placeholder="Précisez votre adresse, étage, ou problème..."
                        value={interventionDetails}
                        onChange={(e) => setInterventionDetails(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-md uppercase tracking-wider hover:scale-[1.01] transform"
                    >
                      {t.envoyer_demande}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* ------------------------------------------
              USER TAB 4: PIECES D'OCCASION (MARKETPLACE SHOP)
              ------------------------------------------ */}
          {activeTab === 'Marketplace' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-3xl font-black tracking-tight">{t.pieces}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-semibold">
                    {currentLang === 'AR' ? 'ابحث واشتر قطع غيار الترصيص المستعملة المضمونة والمجربة من قبل حرفيينا.' : 'Recherchez et filtrez nos pièces de rechange de plomberie d\'occasion certifiées.'}
                  </p>
                </div>

                {/* Sorting options */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">{t.tri} :</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-850 dark:text-slate-250 focus:outline-none"
                  >
                    <option value="featured">{t.recommande}</option>
                    <option value="price_asc">{t.prix_croissant}</option>
                    <option value="price_desc">{t.prix_decroissant}</option>
                  </select>
                </div>
              </div>

              {/* Sidebar filter & Product Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Filters Sidebar (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-wider">{t.filtres}</h3>

                    {/* Search query input */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">{t.rechercher}</label>
                      <input 
                        type="text"
                        placeholder={currentLang === 'AR' ? 'ابحث عن قطعة...' : 'Grohe, boiler, radiateur...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    {/* Dynamic categories filter list */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Catégories</label>
                      <div className="space-y-1.5">
                        <button
                          onClick={() => setSelectedCategoryFilter('Toutes')}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                            selectedCategoryFilter === 'Toutes'
                              ? 'bg-[#1E3A5F] text-white shadow-sm'
                              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-750'
                          }`}
                        >
                          {t.toutes_categories}
                        </button>
                        {reduxCategories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryFilter(cat.name)}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                              selectedCategoryFilter === cat.name
                                ? 'bg-[#1E3A5F] text-white shadow-sm'
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-750'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Condition selector filter */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">{t.etat}</label>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        {['Tous', 'comme neuf', 'bon état', 'pour pièces'].map(cond => (
                          <button
                            key={cond}
                            onClick={() => setSelectedConditionFilter(cond)}
                            className={`px-2 py-2 rounded-xl border text-[10px] font-black capitalize transition leading-none ${
                              selectedConditionFilter === cond 
                                ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white' 
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-350'
                            }`}
                          >
                            {cond === 'Tous' ? t.tous : cond}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Max slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{t.prix} Max</span>
                        <span className="text-[#F97316]">{priceMax} DT</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={priceMax}
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
                      />
                    </div>
                  </div>
                </div>

                {/* Products Listings Grid (lg:col-span-9) */}
                <div className="lg:col-span-9">
                  {sortedProducts.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm">
                      <p className="text-sm text-slate-400 font-bold">{t.aucun_produit}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      {sortedProducts.map(prod => (
                        <div 
                          key={prod.id}
                          onClick={() => setSelectedProduct(prod)}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-[#1E3A5F] dark:hover:border-slate-500 transition-all duration-300 group flex flex-col justify-between cursor-pointer"
                        >
                          <div className="bg-slate-50 dark:bg-slate-900 py-10 flex items-center justify-center border-b border-slate-100 dark:border-slate-800 relative">
                            <span className="absolute top-3 right-3 z-10 bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-350 text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                              {prod.condition}
                            </span>

                            {/* Heart favorites toggle */}
                            <button 
                              onClick={(e) => toggleFavorite(prod.id, e)}
                              className="absolute top-3 left-3 z-10 w-8 h-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition"
                            >
                              <svg 
                                width="14" height="14" viewBox="0 0 24 24" 
                                fill={favorites.includes(prod.id) ? "currentColor" : "none"} 
                                stroke="currentColor" strokeWidth="2.5"
                                className={favorites.includes(prod.id) ? "text-rose-500" : ""}
                              >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                            </button>

                            <ProductVisual image={prod.image} />
                          </div>

                          <div className="p-4 text-left flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider">{prod.category}</span>
                              <h4 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-100 mt-1 leading-tight group-hover:text-[#F97316] transition-colors">
                                {prod.title}
                              </h4>
                              <p className="text-[10.5px] text-slate-400 mt-0.5 line-clamp-1 font-semibold">{prod.subtitle}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-750 pt-3 mt-4">
                              <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-250">
                                {prod.price} <span className="text-[9.5px] font-bold">DT</span>
                              </div>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProduct(prod);
                                }}
                                className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition"
                              >
                                {currentLang === 'AR' ? 'شراء' : 'Commander'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ------------------------------------------
              USER TAB 5: PROFILE (TABLEAU DE BORD CLIENT OR GUEST PROMPT)
              ------------------------------------------ */}
          {activeTab === 'Profile' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              {currentRole === 'anonyme' ? (
                // GUEST CONNEXION PROMPT STATE
                <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] p-8 sm:p-12 text-center shadow-lg space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20 flex items-center justify-center text-[#1E3A5F] dark:text-sky-400 mx-auto">
                    🔒
                  </div>
                  <h2 className="text-2xl font-black text-slate-850 dark:text-slate-100">
                    {currentLang === 'AR' ? 'سجل دخولك لتفعيل حسابك الشخصي' : 'Identification Requise'}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">
                    {currentLang === 'AR' 
                      ? 'لإضافة قطع غيار للمفضلة وتعديل بياناتك، يرجى تسجيل الدخول أو إنشاء حساب جديد.' 
                      : `Rejoignez ${businessName} pour sauvegarder vos pièces favorites, demander des interventions immédiates en priorité et modifier votre mot de passe.`}
                  </p>
                  
                  <div className="pt-4 flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        setBypassAuth(false);
                        setSigninEmail('');
                        setSigninPassword('');
                      }}
                      className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-md uppercase tracking-wider"
                    >
                      {currentLang === 'AR' ? 'تسجيل الدخول / إنشاء حساب' : 'Accéder à l\'écran de connexion'}
                    </button>
                    <button 
                      onClick={() => setActiveTab('Accueil')}
                      className="text-xs font-black text-slate-400 hover:text-slate-650"
                    >
                      {t.retour_accueil}
                    </button>
                  </div>
                </div>
              ) : (
                // LOGGED CLIENT INTERFACE
                <div>
                  <h1 className="text-3xl font-black tracking-tight">{t.tableau_bord}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
                    {t.tableau_bord_desc}
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start">
                    
                    {/* Left details (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Client Card */}
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6 text-center">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#1E3A5F] to-[#F97316] p-1 shadow-md">
                          <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200 font-black text-2xl">
                            {profileName.charAt(0) || 'U'}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-black text-slate-850 dark:text-slate-100">{profileName}</h3>
                          <span className="inline-block mt-1 text-[9px] font-black px-3 py-1 rounded-full uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                            {t.compte_particulier}
                          </span>
                        </div>

                        {/* Profile information */}
                        <div className="border-t border-slate-100 dark:border-slate-700 pt-5 space-y-3.5 text-left font-semibold text-xs text-slate-500 dark:text-slate-450">
                          <div className="space-y-1">
                            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                            <p className="font-black text-slate-800 dark:text-slate-200">{profileEmail}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">{t.telephone}</span>
                            <p className="font-black text-slate-800 dark:text-slate-200">{profilePhone}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">{t.ville}</span>
                            <p className="font-black text-slate-800 dark:text-slate-200">{profileCity}</p>
                          </div>
                        </div>
                      </div>

                      {/* Security details updates */}
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-wider">{t.securite}</h3>
                        
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!currentMdp || !newMdp) return;
                            showToast(currentLang === 'AR' ? 'تم تحديث كلمة المرور بنجاح' : 'Sécurité mise à jour avec succès !', 'success');
                            setCurrentMdp('');
                            setNewMdp('');
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.mdp_actuel}</label>
                            <input 
                              type="password"
                              required
                              value={currentMdp}
                              onChange={(e) => setCurrentMdp(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.nouveau_mdp}</label>
                            <input 
                              type="password"
                              required
                              value={newMdp}
                              onChange={(e) => setNewMdp(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[11px] font-black py-3 rounded-xl transition shadow-sm uppercase tracking-wider"
                          >
                            {t.mettre_a_jour}
                          </button>
                        </form>
                      </div>

                    </div>

                    {/* Right Favorites grid (lg:col-span-8) */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-wider">{t.mes_favoris}</h3>
                        <button 
                          onClick={() => setActiveTab('Marketplace')}
                          className="text-xs font-black text-[#F97316] hover:underline"
                        >
                          {t.parcourir_market}
                        </button>
                      </div>

                      {favorites.length === 0 ? (
                        <div className="border border-dashed border-slate-350 dark:border-slate-700 rounded-2xl p-10 text-center space-y-3">
                          <p className="text-xs text-slate-400 font-bold">{t.plus_favoris_desc}</p>
                          <button 
                            onClick={() => setActiveTab('Marketplace')}
                            className="bg-slate-100 dark:bg-slate-750 px-4 py-2 rounded-xl text-xs font-black"
                          >
                            {t.boutique_acces}
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {favorites.map(id => {
                            const prod = products.find(p => p.id === id);
                            if (!prod) return null;
                            return (
                              <div 
                                key={prod.id}
                                className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between"
                              >
                                <div className="bg-slate-50 dark:bg-slate-900 py-6 flex items-center justify-center relative">
                                  <button 
                                    onClick={(e) => toggleFavorite(prod.id, e)}
                                    className="absolute top-2 right-2 w-7.5 h-7.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-rose-500 hover:scale-110 transition"
                                  >
                                    ✕
                                  </button>
                                  <ProductVisual image={prod.image} className="w-12 h-12" />
                                </div>

                                <div className="p-4 space-y-4">
                                  <div>
                                    <div className="flex justify-between items-start gap-2">
                                      <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                                        {prod.title}
                                      </h4>
                                      <span className="text-xs font-black text-[#F97316] whitespace-nowrap">
                                        {prod.price} DT
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                      {prod.description}
                                    </p>
                                  </div>

                                  <button 
                                    onClick={() => setSelectedProduct(prod)}
                                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[10px] font-black py-2.5 rounded-lg transition"
                                  >
                                    {t.consulter}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------
              USER TAB 6: PAIEMENT (SOON / INTEGRATION PAGE)
              ------------------------------------------ */}
          {activeTab === 'Payment' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
              <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] p-8 sm:p-12 shadow-sm space-y-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1E3A5F] via-[#F97316] to-[#1E3A5F]" />
                
                <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-extrabold text-[9px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  {t.maintenance}
                </span>

                <h1 className="text-3xl font-black text-slate-850 dark:text-slate-100 mt-4">
                  {t.bientot_dispo}
                </h1>
                
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-semibold">
                  {t.maintenance_desc}
                </p>

                {/* Premium Integration Progress Bar */}
                <div className="space-y-3 pt-6 max-w-md mx-auto">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{t.progression}</span>
                    <span className="text-[#F97316]">85%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1E3A5F] to-[#F97316] rounded-full" 
                      style={{ width: '85%' }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">
                    Tests d'homologation de sécurité SSL et cryptage en cours avec la SMT.
                  </p>
                </div>

                {/* Newsletter alert form */}
                <div className="border-t border-slate-100 dark:border-slate-700 pt-8 mt-8 space-y-4 max-w-md mx-auto">
                  <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest text-center">
                    M'avertir lors de la mise en service
                  </h4>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newsletterEmail) return;
                      showToast(currentLang === 'AR' ? 'شكراً ! سيتم إعلامك بالبريد الإلكتروني.' : 'Merci ! Vous recevrez une alerte prioritaire.', 'success');
                      setNewsletterEmail('');
                    }}
                    className="flex gap-2.5"
                  >
                    <input 
                      type="email"
                      required
                      placeholder="votre.email@domaine.tn"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                    <button 
                      type="submit"
                      className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-6 py-3 rounded-xl transition shadow-md"
                    >
                      {t.avertir}
                    </button>
                  </form>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-6 border-t border-slate-100 dark:border-slate-700">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center border border-slate-200 dark:border-slate-800">
                    <span className="text-xl block mb-2">🔒</span>
                    <span className="text-[8.5px] font-black uppercase text-slate-500 dark:text-slate-400">Cryptage SSL 256 bits</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center border border-slate-200 dark:border-slate-800">
                    <span className="text-xl block mb-2">🚚</span>
                    <span className="text-[8.5px] font-black uppercase text-slate-500 dark:text-slate-400">Livraison express 24h</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('Accueil')}
                  className="text-xs font-black text-slate-400 hover:text-slate-650 inline-flex items-center gap-1.5 pt-4"
                >
                  <span>{isRTL ? '→' : '←'}</span>
                  <span>{t.retour_accueil}</span>
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------
              ADMIN TAB 1: ACCUEIL (DASHBOARD METRICS)
              ------------------------------------------ */}
          {activeTab === 'AdminAccueil' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <h1 className="text-3xl font-black tracking-tight text-slate-850 dark:text-white">
                {currentLang === 'AR' ? 'لوحة قيادة المدير' : 'Tableau de Bord Administration'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
                {currentLang === 'AR' ? `إليك مؤشرات النشاط الحالية ومستجدات العمل لـ ${businessName}.` : 'Suivez l\'état général des stocks de pièces détachées et des membres inscrits.'}
              </p>

              {/* Metrics cards row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[
                  { title: currentLang === 'AR' ? 'إجمالي القطع المعروضة' : 'Annonces Actives', val: products.length, desc: currentLang === 'AR' ? 'قطعة غيار مستعملة' : 'Pièces en catalogue', color: 'border-l-4 border-blue-500' },
                  { title: currentLang === 'AR' ? 'الأصناف المتوفرة' : 'Catégories', val: reduxCategories.length, desc: currentLang === 'AR' ? 'صنفاً ديناميكياً' : 'Familles de produits', color: 'border-l-4 border-amber-500' },
                  { title: currentLang === 'AR' ? 'حسابات الأعضاء' : 'Membres Inscrits', val: usersList.length, desc: currentLang === 'AR' ? 'حساباً مسجلاً' : 'Clients enregistrés', color: 'border-l-4 border-emerald-500' },
                  { title: currentLang === 'AR' ? 'طلبات الصيانة الواردة' : 'Urgences Leads', val: 12, desc: currentLang === 'AR' ? 'طلب تدخل سريع' : 'Demandes d\'interventions', color: 'border-l-4 border-rose-500' }
                ].map((m, idx) => (
                  <div key={idx} className={`bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm ${m.color}`}>
                    <span className="text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest">{m.title}</span>
                    <h3 className="text-3xl font-black text-slate-850 dark:text-white mt-2 leading-none">{m.val}</h3>
                    <p className="text-[10px] text-slate-400 mt-2 font-semibold">{m.desc}</p>
                  </div>
                ))}
              </div>

              {/* Activity Ledgers / System logs */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm mt-10">
                <h3 className="text-base font-black text-slate-850 dark:text-white mb-6">
                  {currentLang === 'AR' ? 'سجل العمليات الأخير للرئيس' : 'Historique Récents des Actions Admin'}
                </h3>
                
                <div className="space-y-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {[
                    { log: currentLang === 'AR' ? 'قام أحمد بن علي بطلب تدخل سريع بجهة أريانة.' : "Ahmed Ben Ali (user@stouchy.com) a sollicité une intervention plomberie d'urgence à Ariana.", time: "Il y a 5 minutes", badge: "Intervention", color: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400" },
                    { log: currentLang === 'AR' ? 'تمت إضافة قطعة غيار جديدة : "مزيج مطبخ غروهي".' : "Nouvelle pièce ajoutée : Mélangeur Cuisine Grohe dans le catalogue.", time: "Il y a 20 minutes", badge: "Catalogue", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
                    { log: currentLang === 'AR' ? 'تمت إضافة صنف جديد : "مضخات مياه".' : "Catégorie 'Pompes de circulation' créée par Admin.", time: "Il y a 2 heures", badge: "Catégorie", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
                    { log: currentLang === 'AR' ? 'تم تحديث دور المستخدم "user@stouchy.com" لرتبة عميل.' : "Statut réactivé pour le client user@stouchy.com.", time: "Il y a 1 jour", badge: "Utilisateur", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" }
                  ].map((l, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-750 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${l.badge === 'Intervention' ? 'bg-rose-100 text-rose-600' : l.badge === 'Catalogue' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                          {l.badge}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200">{l.log}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{l.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------
              ADMIN TAB 2: GESTION ANNONCE (CRUD DISPATCHES)
              ------------------------------------------ */}
          {activeTab === 'GestionAnnonce' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-3xl font-black tracking-tight">{currentLang === 'AR' ? 'إدارة إعلانات قطع الغيار' : 'Gestion des Annonces'}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
                    {currentLang === 'AR' ? 'قم بإضافة، تعديل أو حذف إعلانات قطع الغيار المعروضة في الكتالوج.' : 'Créez de nouvelles fiches produits, modifiez les descriptifs et gérez les disponibilités.'}
                  </p>
                </div>
                
                <button 
                  onClick={openAddAnnonce}
                  className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-md transition"
                >
                  {currentLang === 'AR' ? '+ إضافة إعلان جديد' : '+ Ajouter une annonce'}
                </button>
              </div>

              {/* Listings Admin Table */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-semibold">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400">
                      <tr>
                        <th className="px-6 py-4">{currentLang === 'AR' ? 'القطعة' : 'Pièce'}</th>
                        <th className="px-6 py-4">{currentLang === 'AR' ? 'الصنف' : 'Catégorie'}</th>
                        <th className="px-6 py-4">{currentLang === 'AR' ? 'السعر' : 'Prix'}</th>
                        <th className="px-6 py-4">{currentLang === 'AR' ? 'الحالة' : 'État'}</th>
                        <th className="px-6 py-4">{currentLang === 'AR' ? 'الوضعية' : 'Statut'}</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-200">
                      {products.map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                              <ProductVisual image={prod.image} className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="font-black text-slate-850 dark:text-slate-100">{prod.title}</div>
                              <span className="text-[10px] text-slate-400 font-semibold">{prod.subtitle}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{prod.category}</td>
                          <td className="px-6 py-4 font-black">{prod.price} TND</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-150 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-600 dark:text-slate-350">
                              {prod.condition}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                              prod.isAvailable 
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/10' 
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-500/10'
                            }`}>
                              {prod.isAvailable ? (currentLang === 'AR' ? 'متوفر' : 'Disponible') : (currentLang === 'AR' ? 'مباع' : 'Vendu')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => openEditAnnonce(prod)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 py-1.5 rounded-lg transition"
                              >
                                {currentLang === 'AR' ? 'تعديل' : 'Modifier'}
                              </button>
                              <button 
                                onClick={() => handleDeleteAnnonce(prod.id)}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-1.5 rounded-lg transition"
                              >
                                {currentLang === 'AR' ? 'حذف' : 'Supprimer'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------
              ADMIN TAB 3: GESTION CATEGORIE (LIVE DYNAMIC TABLE)
              ------------------------------------------ */}
          {activeTab === 'GestionCategorie' && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <h1 className="text-3xl font-black tracking-tight">{currentLang === 'AR' ? 'إدارة أصناف المنتجات' : 'Gestion des Catégories'}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
                {currentLang === 'AR' ? 'تحكم في القائمة الديناميكية للأصناف المستعملة في الفرز.' : 'Ajoutez de nouvelles familles de produits et réorganisez le catalogue.'}
              </p>

              {/* Add form */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm mt-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  {editingCategory ? (currentLang === 'AR' ? 'تعديل الصنف الحالي' : 'Modifier la catégorie') : (currentLang === 'AR' ? 'إضافة صنف جديد' : 'Créer une nouvelle catégorie')}
                </h3>
                
                {editingCategory ? (
                  <form onSubmit={handleRenameCategory} className="flex gap-3">
                    <input 
                      type="text"
                      required
                      placeholder="Nouveau nom..."
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-105 focus:outline-none"
                    />
                    <button 
                      type="submit"
                      className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-6 py-3 rounded-xl transition"
                    >
                      Enregistrer
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-250 text-xs font-black px-4 py-3 rounded-xl transition"
                    >
                      Annuler
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAddCategory} className="flex gap-3">
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Pompes et Accessoires..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-105 focus:outline-none"
                    />
                    <button 
                      type="submit"
                      className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-6 py-3 rounded-xl transition shadow-sm"
                    >
                      + Ajouter
                    </button>
                  </form>
                )}
              </div>

              {/* Categories list table */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden mt-8">
                <table className="w-full text-xs text-left font-semibold">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Nom de la Catégorie</th>
                      <th className="px-6 py-4">Nombre d'Articles</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-200">
                    {reduxCategories.map(cat => {
                      const count = products.filter(p => p.category === cat.name).length;
                      return (
                        <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition">
                          <td className="px-6 py-4 font-black">{cat.name}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{count} articles</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => {
                                  setEditingCategory(cat);
                                  setEditCategoryName(cat.name);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 py-1 rounded-lg transition"
                              >
                                {currentLang === 'AR' ? 'تعديل الاسم' : 'Renommer'}
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-1 rounded-lg transition"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------
              ADMIN TAB 4: GESTION USER (MEMBERS & STATUS TOGGLES)
              ------------------------------------------ */}
          {activeTab === 'GestionUser' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <h1 className="text-3xl font-black tracking-tight">{currentLang === 'AR' ? 'إدارة حسابات المستخدمين' : 'Gestion des Comptes Membres'}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
                {currentLang === 'AR' ? 'استعرض الأعضاء المسجلين وقم بترقية أدوارهم أو تجميد حساباتهم.' : 'Visualisez la liste des inscrits, modifiez les rôles ou désactivez temporairement des accès.'}
              </p>

              {/* Users table */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden mt-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-semibold">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400">
                      <tr>
                        <th className="px-6 py-4">{t.nom_complet}</th>
                        <th className="px-6 py-4">Adresse Email</th>
                        <th className="px-6 py-4">{t.telephone}</th>
                        <th className="px-6 py-4">Rôle</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-200">
                      {usersList.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition">
                          <td className="px-6 py-4 font-black">{u.name}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                          <td className="px-6 py-4">{u.phone || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded text-[9.5px] font-black uppercase ${
                              u.role === 'admin' 
                                ? 'bg-amber-100 text-amber-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                              u.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'bg-rose-50 text-rose-600'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleToggleUserRole(u.id, u.role)}
                                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-white px-2.5 py-1 rounded transition"
                              >
                                {u.role === 'admin' ? 'Rétrograder en Client' : 'Promouvoir Admin'}
                              </button>
                              <button 
                                onClick={() => handleToggleUserStatus(u.id, u.status)}
                                className={`px-2.5 py-1 rounded text-white transition font-black ${
                                  u.status === 'active' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                                }`}
                              >
                                {u.status === 'active' ? 'Bloquer' : 'Activer'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------
              ADMIN TAB 5: ADMIN PROFILE
              ------------------------------------------ */}
          {activeTab === 'AdminProfile' && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <h1 className="text-3xl font-black tracking-tight">{currentLang === 'AR' ? 'إعدادات حساب المدير' : 'Profil Administrateur Principal'}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
                {currentLang === 'AR' ? 'تحكم ببيانات الأمان وخيارات التحكم لمدير التطبيق.' : 'Gérez vos accès de sécurité et configurez vos préférences de contact.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 items-start">
                {/* Details card */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-center shadow-sm space-y-6">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-3xl font-black text-[#F97316] mx-auto border-2 border-[#F97316]">
                    ★
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-850 dark:text-slate-100">{sessionUser?.name}</h3>
                    <span className="inline-block mt-1 text-[8.5px] font-black px-3 py-1 rounded-full uppercase bg-amber-100 text-amber-700">
                      Administrateur
                    </span>
                  </div>
                  <div className="text-left text-xs font-semibold text-slate-400 space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
                    <div>Email: <span className="font-black text-slate-700 dark:text-slate-200">{profileEmail}</span></div>
                    <div>{t.support_whatsapp}: <span className="font-black text-slate-700 dark:text-slate-200">{profilePhone}</span></div>
                    <div>Statut: <span className="font-black text-emerald-500">Actif principal</span></div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-wider">{currentLang === 'AR' ? 'بيانات الاتصال والأمان' : 'Coordonnées & Sécurité'}</h3>

                  <form onSubmit={handleAdminBrandSettingsUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {currentLang === 'AR' ? 'اسم الموقع / الاسم واللقب' : 'Titre du site / nom et prénom'}
                      </label>
                      <input
                        type="text"
                        required
                        value={businessNameInput}
                        onChange={(e) => setBusinessNameInput(e.target.value)}
                        placeholder="Ex: Mohamed Ben Khedher"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {currentLang === 'AR' ? 'سنوات الخبرة' : 'Années d’expérience'}
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="80"
                        value={experienceYearsInput}
                        onChange={(e) => setExperienceYearsInput(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-sm uppercase tracking-wider"
                      >
                        {currentLang === 'AR' ? 'حفظ هوية الموقع' : 'Enregistrer l’identité du site'}
                      </button>
                    </div>
                  </form>
                  
                  <form onSubmit={handleAdminProfileUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.admin_edit_email}</label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.admin_edit_phone}</label>
                      <input
                        type="tel"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-sm uppercase tracking-wider"
                      >
                        {currentLang === 'AR' ? 'حفظ بيانات الاتصال' : 'Enregistrer les coordonnées'}
                      </button>
                    </div>
                  </form>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      showToast("Mot de passe admin mis à jour !", "success");
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nouveau mot de passe administrateur</label>
                      <input 
                        type="password"
                        required
                        placeholder="Ex: admin123"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirmation</label>
                      <input 
                        type="password"
                        required
                        placeholder="Ex: admin123"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-sm uppercase tracking-wider"
                    >
                      Mettre à jour la sécurité
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------
              ADMIN TAB 6: ANALYTICS (styled premium graphics)
              ------------------------------------------ */}
          {activeTab === 'Analytics' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <h1 className="text-3xl font-black tracking-tight">{currentLang === 'AR' ? 'مؤشرات الأداء الماليّة والخدمية' : 'Indicateurs Financiers & Performance'}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
                {currentLang === 'AR' ? 'استعرض التقارير البيانية حول الأرباح المحققة وطلبات الصيانة.' : 'Analysez la répartition des ventes de pièces et le taux d\'intervention régionale.'}
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {[
                  { label: currentLang === 'AR' ? 'متوسط زمن الرد' : 'Temps de réponse moyen', value: '18 min', detail: currentLang === 'AR' ? 'طلبات عاجلة' : 'Demandes urgentes' },
                  { label: currentLang === 'AR' ? 'قيمة الطلب المتوسطة' : 'Panier moyen', value: '164 DT', detail: currentLang === 'AR' ? 'قطع مستعملة' : 'Pièces d\'occasion' },
                  { label: currentLang === 'AR' ? 'الطلبات المفتوحة' : 'Leads ouverts', value: '27', detail: currentLang === 'AR' ? 'هذا الأسبوع' : 'Cette semaine' },
                  { label: currentLang === 'AR' ? 'معدل التحويل' : 'Taux de conversion', value: '31%', detail: currentLang === 'AR' ? 'واتساب إلى طلب' : 'WhatsApp vers commande' },
                ].map((metric, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">{metric.label}</span>
                    <strong className="mt-2 block text-2xl font-black text-slate-850 dark:text-white">{metric.value}</strong>
                    <span className="mt-1 block text-[10px] font-bold text-slate-500 dark:text-slate-400">{metric.detail}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                
                {/* Revenue report bar graphics */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-wider">Évolution du Chiffre d'Affaires Mensuel (TND)</h3>
                  
                  <div className="space-y-4 pt-4">
                    {[
                      { month: "Janvier", val: 3400, percent: "45%" },
                      { month: "Février", val: 4800, percent: "60%" },
                      { month: "Mars", val: 5100, percent: "65%" },
                      { month: "Avril", val: 6800, percent: "80%" },
                      { month: "Mai (Encours)", val: 8200, percent: "100%" }
                    ].map((row, idx) => (
                      <div key={idx} className="space-y-1.5 text-xs font-semibold">
                        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                          <span>{row.month}</span>
                          <span className="font-black text-slate-800 dark:text-white">{row.val.toFixed(3)} DT</span>
                        </div>
                        <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden relative">
                          <div 
                            className="h-full bg-gradient-to-r from-sky-600 to-[#1E3A5F] rounded-lg transition-all duration-500"
                            style={{ width: row.percent }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Breakdown & regional pie logs representation */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-wider">Répartition des Demandes par Services (%)</h3>
                  
                  <div className="space-y-5 pt-4 text-xs font-bold text-slate-500">
                    {[
                      { name: t.plomberie_generale, share: 45, color: "bg-blue-500" },
                      { name: t.chauffage_central, share: 25, color: "bg-amber-500" },
                      { name: t.climatisation, share: 20, color: "bg-emerald-500" },
                      { name: t.installation_gaz, share: 10, color: "bg-rose-500" }
                    ].map((row, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-slate-700 dark:text-slate-200">
                          <span className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                            <span>{row.name}</span>
                          </span>
                          <span>{row.share}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${row.color}`} style={{ width: `${row.share}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-wider">Performance par région</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    {[
                      { region: 'Grand Tunis', requests: 42, satisfaction: '98%' },
                      { region: 'Sahel', requests: 26, satisfaction: '96%' },
                      { region: 'Sfax', requests: 14, satisfaction: '94%' },
                    ].map((row) => (
                      <div key={row.region} className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{row.region}</span>
                        <div className="mt-3 text-xl font-black text-slate-850 dark:text-white">{row.requests}</div>
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{row.satisfaction} satisfaction</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-wider">Alertes stock</h3>
                  <div className="space-y-3 mt-6 text-xs font-semibold">
                    {[
                      'Robinetterie: 3 références à renouveler',
                      'Chauffe-eau: forte demande cette semaine',
                      'Vannes: marge moyenne +12%',
                    ].map((item) => (
                      <div key={item} className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900 px-3 py-2 text-amber-700 dark:text-amber-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* ==========================================
          PIECES D'OCCASION DETAILED POPUP MODAL
          ========================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-xl w-full shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center font-bold shadow transition"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="bg-slate-50 dark:bg-slate-900 py-14 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
                <ProductVisual image={selectedProduct.image} className="w-24 h-24" />
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest">{selectedProduct.category}</span>
                    <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 mt-1">{selectedProduct.title}</h2>
                    <p className="text-xs text-slate-450 mt-1 leading-relaxed font-semibold">{selectedProduct.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {selectedProduct.description}
                  </p>

                  <div className="text-xl font-black text-[#F97316]">
                    {selectedProduct.price} <span className="text-sm font-bold">DT</span>
                  </div>
                </div>

                {/* Direct Action links */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <a 
                    href="tel:+21622456789"
                    className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-3 rounded-xl transition text-center shadow flex items-center justify-center gap-1.5"
                  >
                    <span>{t.call}</span>
                  </a>

                  <a 
                    href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
                      `Bonjour, je suis intéressé par l'achat de la pièce d'occasion : ${selectedProduct.title} - ${selectedProduct.price} DT.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 rounded-xl transition text-center shadow flex items-center justify-center gap-1.5"
                  >
                    <span>{t.whatsapp}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ADMIN ANNONCE MODAL (ADD / EDIT)
          ========================================== */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-lg w-full shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 z-10 w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-500 hover:text-slate-850 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-slate-850 dark:text-white">
                {editingProduct ? (currentLang === 'AR' ? 'تعديل بيانات الإعلان' : 'Modifier l\'annonce') : (currentLang === 'AR' ? 'إضافة إعلان جديد' : 'Créer une annonce')}
              </h2>

              <form onSubmit={handleSaveAnnonce} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Titre *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Mitigeur évier"
                      value={annonceTitle}
                      onChange={(e) => setAnnonceTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Sous-Titre / Marque</label>
                    <input 
                      type="text"
                      placeholder="Ex: GROHE chromé"
                      value={annonceSubtitle}
                      onChange={(e) => setAnnonceSubtitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Catégorie</label>
                    <select
                      value={annonceCategory}
                      onChange={(e) => setAnnonceCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                    >
                      {reduxCategories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Prix (TND) *</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      value={annoncePrice}
                      onChange={(e) => setAnnoncePrice(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">État</label>
                    <select
                      value={annonceCondition}
                      onChange={(e) => setAnnonceCondition(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                    >
                      <option value="comme neuf">Comme neuf</option>
                      <option value="bon état">Bon état</option>
                      <option value="pour pièces">Pour pièces</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Représentation Visuelle</label>
                    <select
                      value={annonceImage}
                      onChange={(e) => setAnnonceImage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                    >
                      <option value="faucet">Haut-de-gamme Robinet (Faucet)</option>
                      <option value="boiler">Chauffe-eau / Chaudière (Boiler)</option>
                      <option value="copper_fittings">Canalisation / Raccords (Pipes)</option>
                    </select>
                  </div>

                  <div className="flex gap-4 items-center justify-around h-full pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-750 dark:text-slate-300">
                      <input 
                        type="checkbox"
                        checked={annonceIsFeatured}
                        onChange={(e) => setAnnonceIsFeatured(e.target.checked)}
                        className="accent-[#F97316] w-4.5 h-4.5"
                      />
                      <span>En Vedette</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-750 dark:text-slate-300">
                      <input 
                        type="checkbox"
                        checked={annonceIsAvailable}
                        onChange={(e) => setAnnonceIsAvailable(e.target.checked)}
                        className="accent-[#F97316] w-4.5 h-4.5"
                      />
                      <span>Disponible</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Description technique *</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Détails du produit..."
                    value={annonceDescription}
                    onChange={(e) => setAnnonceDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-md uppercase tracking-wider"
                >
                  {currentLang === 'AR' ? 'حفظ الإعلان' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          COMMON SITE FOOTER
          ========================================== */}
      {(bypassAuth || sessionUser) && (
        <footer className={`border-t transition-colors ${
          currentTheme === 'dark' ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
        } py-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            
            <div className="space-y-4">
              <span className="text-lg font-black text-slate-850 dark:text-slate-105 flex items-center gap-2">
                🛠️ {businessName}
              </span>
              <p className="text-xs leading-relaxed font-semibold">
                {t.foot_desc}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {t.navigation}
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><button onClick={() => setActiveTab(currentRole === 'admin' ? 'AdminAccueil' : 'Accueil')} className="hover:text-[#F97316] transition">{t.accueil}</button></li>
                <li><button onClick={() => setActiveTab(currentRole === 'admin' ? 'AdminProfile' : 'Profile')} className="hover:text-[#F97316] transition">{t.mon_profil}</button></li>
                {currentRole !== 'admin' && (
                  <>
                    <li><button onClick={() => setActiveTab('Services')} className="hover:text-[#F97316] transition">{t.services}</button></li>
                    <li><button onClick={() => setActiveTab('Marketplace')} className="hover:text-[#F97316] transition">{t.pieces}</button></li>
                  </>
                )}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {t.informations}
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><button onClick={() => showToast(t.politique, 'info')} className="hover:text-[#F97316] transition">{t.politique}</button></li>
                <li><button onClick={() => showToast(t.conditions_util, 'info')} className="hover:text-[#F97316] transition">{t.conditions_util}</button></li>
                <li><button onClick={() => showToast(t.plan_site, 'info')} className="hover:text-[#F97316] transition">{t.plan_site}</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Support
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <a href="tel:+21622456789" className="hover:text-[#F97316] transition">+216 22 456 789</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️</span>
                  <a href="mailto:support@plombier-tunisie.tn" className="hover:text-[#F97316] transition">support@plombier-tunisie.tn</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 text-center text-xs font-bold">
            {t.credits}
          </div>
        </footer>
      )}

      {/* ==========================================
          FLOATING QUICK CONTACT ACTION SUPPORT
          ========================================== */}
      {(bypassAuth || sessionUser) && currentRole !== 'admin' && (
        <a 
          href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(t.whatsapp_msg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          title="WhatsApp Support Urgent"
        >
          💬
        </a>
      )}

    </div>
  );
};
