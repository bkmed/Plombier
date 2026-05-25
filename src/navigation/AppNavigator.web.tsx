import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import {
  toggleFavoriteAction,
  addListing,
  updateListing,
  deleteListing,
  type Product,
} from '../store/slices/partsSlice';
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from '../store/slices/categoriesSlice';
import { addService } from '../store/slices/servicesSlice';
import { addUser, updateUser, deleteUser } from '../store/slices/usersSlice';
import {
  setCurrentLang as setCurrentLangAction,
  setCurrentTheme as setCurrentThemeAction,
  setActiveTab as setActiveTabAction,
  setBypassAuth as setBypassAuthAction,
} from '../store/slices/uiSlice';
import { Category, UserAccount } from '../database/schema';
import { useAuth } from '../context/AuthContext';
import { User } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { ServiceIcon, ServiceIconName } from '../components/ServiceIcon';
import FooterLinks from '../features/plombier/components/FooterLinks';
import CategoryImageInput from '../features/plombier/components/CategoryImageInput';
import GalleryScreen from '../features/plombier/screens/GalleryScreen';
import AdminGalleryEditor from '../features/plombier/screens/AdminGalleryEditor';
import AdminServicesEditor from '../features/plombier/screens/AdminServicesEditor';
import ServicesScreen from '../features/plombier/screens/ServicesScreen';
import ZonesScreen from '../features/plombier/screens/ZonesScreen';
import MarketplaceScreen from '../features/plombier/screens/MarketplaceScreen';
import AdminProfileScreen from '../features/plombier/screens/AdminProfileScreen';
import AdminAnalyticsScreen from '../features/plombier/screens/AdminAnalyticsScreen';

// ==========================================
// BRAND LOGO SVG
// ==========================================
const LogoSVG = ({
  size = 44,
  className = '',
}: {
  size?: number;
  className?: string;
}) => {
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
      <line
        x1="30"
        y1="70"
        x2="70"
        y2="30"
        stroke="white"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="70"
        x2="70"
        y2="30"
        stroke="#1E3A5F"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="12"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="88"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="12"
        y2="50"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="88"
        y2="50"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="23"
        y2="23"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="77"
        y2="23"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="23"
        y2="77"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="77"
        y2="77"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle
        cx="50"
        cy="50"
        r="8"
        stroke="#F97316"
        strokeWidth="4"
        fill="#1E3A5F"
      />
    </svg>
  );
};

// ==========================================
// HIGH-FIDELITY PRODUCT SVGS FOR MARKETPLACE
// ==========================================
const FaucetSVG = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M25 80 h50" strokeWidth="4" stroke="#475569" />
    <path
      d="M40 80 V42 c0 -12 8 -22 22 -22 h8"
      strokeWidth="6"
      stroke="#64748B"
    />
    <path d="M70 20 v8" strokeWidth="5" stroke="#94A3B8" />
    <path d="M66 28 h8" strokeWidth="2" stroke="#475569" />
    <path d="M32 50 h12" strokeWidth="4.5" stroke="#334155" />
    <circle cx="32" cy="50" r="3.5" fill="#EF4444" stroke="none" />
    <circle cx="44" cy="50" r="3.5" fill="#3B82F6" stroke="none" />
    <path
      d="M43 35 c0 -5 5 -10 10 -10"
      stroke="white"
      strokeWidth="1.5"
      opacity="0.6"
    />
  </svg>
);

const BoilerSVG = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="25"
      y="15"
      width="50"
      height="66"
      rx="6"
      fill="#F8FAFC"
      stroke="#334155"
      strokeWidth="3"
    />
    <rect
      x="42"
      y="24"
      width="16"
      height="4"
      rx="1"
      fill="#1E3A5F"
      stroke="none"
    />
    <rect
      x="38"
      y="55"
      width="24"
      height="12"
      rx="2"
      fill="#0F172A"
      stroke="#475569"
      strokeWidth="1.5"
    />
    <circle cx="44" cy="72" r="2.5" fill="#64748B" />
    <circle cx="56" cy="72" r="2.5" fill="#64748B" />
    <path d="M35 81 v10" stroke="#B45309" strokeWidth="4.5" />
    <path d="M50 81 v10" stroke="#CBD5E1" strokeWidth="4" />
    <path d="M65 81 v10" stroke="#B45309" strokeWidth="4.5" />
    <circle cx="35" cy="86" r="3.5" fill="#EF4444" stroke="none" />
    <circle cx="65" cy="86" r="3.5" fill="#06B6D4" stroke="none" />
  </svg>
);

const CopperFittingsSVG = ({
  className = 'w-16 h-16',
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M22 28 h32 v32"
      stroke="#EA580C"
      strokeWidth="8"
      strokeLinecap="square"
    />
    <circle cx="22" cy="28" r="5" fill="#C2410C" stroke="none" />
    <circle cx="54" cy="60" r="5" fill="#C2410C" stroke="none" />
    <path d="M52 35 h32 M68 35 v30" stroke="#EA580C" strokeWidth="7" />
    <circle cx="52" cy="35" r="4.5" fill="#C2410C" stroke="none" />
    <circle cx="84" cy="35" r="4.5" fill="#C2410C" stroke="none" />
    <circle cx="68" cy="65" r="4.5" fill="#C2410C" stroke="none" />
    <rect
      x="30"
      y="72"
      width="28"
      height="10"
      rx="1.5"
      fill="#EA580C"
      stroke="#C2410C"
      strokeWidth="1.5"
    />
  </svg>
);

// ==========================================
// LOCAL MODELS & TRANSLATIONS
// ==========================================
type Role = 'anonyme' | 'user' | 'admin';

type WebSessionUser = User & {
  city?: string;
};

type LocalCategory = Category;

const translations = {
  FR: {
    accueil: 'Accueil',
    services: 'Services',
    zones: "Zone d'intervention",
    pieces: "Pièces d'occasion",
    mon_profil: 'Mon profil',
    paiement: 'Paiement',
    admin: 'Admin',
    tagline: 'Plomberie · Climatisation · Gaz · Chauffage',
    whatsapp_msg: "Bonjour, j'ai besoin d'un plombier.",
    devis_msg: 'Bonjour, je souhaite demander un devis pour le service : ',
    call: 'Appeler',
    whatsapp: 'WhatsApp',
    demander_devis: 'Demander un devis',
    maintenance: 'BIENTÔT DISPONIBLE',
    bientot_dispo: 'Paiement en ligne',
    maintenance_desc:
      "Nous mettons en place notre passerelle de paiement sécurisé pour la Tunisie (ClicToPay / Sobflous). Bientôt, commandez vos pièces d'occasion avec livraison à domicile !",
    avertir: "M'avertir",
    progression: "Avancement de l'intégration",
    retour_accueil: "Retour à l'accueil",
    resume_commande: 'Résumé de la commande',
    tableau_bord: 'Tableau de Bord',
    tableau_bord_desc:
      'Gérez vos informations personnelles et retrouvez vos pièces de rechange coup de cœur.',
    compte_particulier: 'Client Particulier',
    securite: 'Sécurité & Mot de Passe',
    mdp_actuel: 'Mot de passe actuel',
    nouveau_mdp: 'Nouveau mot de passe',
    mettre_a_jour: 'Mettre à jour le mot de passe',
    mes_favoris: 'Mes Favoris',
    parcourir_market: 'Parcourir le catalogue',
    plus_favoris: "Envie d'autres pièces ?",
    plus_favoris_desc:
      "Ajoutez un cœur à nos articles d'occasion pour les sauvegarder instantanément ici.",
    consulter: 'Fiche technique',
    nos_services: 'Nos Services',
    nos_services_subtitle:
      "Des interventions plomberie, climatisation, gaz et chauffage pensées pour des logements fiables toute l'année.",
    voir_tout: 'Voir tout',
    services_title: 'Nos Services',
    services_subtitle:
      "Des interventions plomberie, climatisation, gaz et chauffage pensées pour des logements fiables toute l'année.",
    view_all: 'Voir tout',
    admin_edit_email: "Modifier l'e-mail admin",
    admin_edit_phone: 'Modifier le WhatsApp support',
    support_whatsapp: 'WhatsApp support',
    villes_couvertes: 'Villes couvertes',
    appeler_whatsapp: 'Contacter WhatsApp',
    nom_complet: 'Nom complet',
    telephone: 'Téléphone',
    ville: 'Ville',
    nos_expertises: 'Nos Expertises Techniques',
    expertises_desc:
      'Dépannages et rénovations sanitaires professionnelles sur tout le Grand Tunis et le Sahel.',
    plomberie_generale: 'Plomberie Générale',
    plomberie_desc_1: 'Détection de fuites par caméra thermique',
    plomberie_desc_2: 'Installation de robinetterie haut de gamme',
    plomberie_desc_3: "Remplacement de colonnes d'évacuation",
    climatisation: 'Climatisation',
    clim_desc_1: 'Recharge de gaz réfrigérant R410/R32',
    clim_desc_2: 'Nettoyage antibactérien certifié',
    clim_desc_3: 'Optimisation de consommation énergétique',
    installation_gaz: 'Installation Gaz',
    gaz_desc_1: 'Mise en conformité des installations STEG',
    gaz_desc_2: 'Pose de détecteurs de monoxyde de carbone',
    gaz_desc_3: 'Raccordement sécurisé cuisinières/chaudières',
    chauffage_central: 'Chauffage Central',
    chauffage_desc_1: 'Entretien annuel complet de chaudière',
    chauffage_desc_2: 'Désembouage hydrodynamique de circuit',
    chauffage_desc_3: 'Régulation intelligente par thermostat connecté',
    experience_val: '15+',
    experience_lbl: "Années d'Expérience",
    dispo_val: '24/7',
    dispo_lbl: 'Disponibilité',
    gov_val: '24',
    gov_lbl: 'Gouvernorats Couverts',
    satisfaction_val: '100%',
    satisfaction_lbl: 'Satisfaction Client',
    credits: '© 2026 Plombier Tunisie. Tous droits réservés.',
    foot_desc:
      'Le premier écosystème professionnel en Tunisie spécialisé dans le dépannage de plomberie express et la revente de pièces de rechange révisées.',
    navigation: 'Navigation',
    informations: 'Informations',
    politique: 'Politique de confidentialité',
    conditions_util: "Conditions d'utilisation",
    plan_site: 'Plan du site',
    informations_desc:
      "Retrouvez ici toutes les informations légales concernant l'utilisation de notre plateforme.",
    privacy_intro:
      'La confidentialité de vos données est une priorité. Nous collectons uniquement les informations nécessaires pour livrer nos services et améliorer votre expérience.',
    privacy_point_1:
      'Collecte minimale de données pour les interventions et les commandes.',
    privacy_point_2: 'Aucune revente de vos coordonnées à des tiers.',
    privacy_point_3:
      'Chiffrement et hébergement sécurisé des données sensibles.',
    terms_intro:
      "En utilisant ce site, vous acceptez nos conditions d'utilisation telles que décrites ci-dessous.",
    terms_point_1:
      'Les services sont fournis selon les informations et disponibilités affichées.',
    terms_point_2:
      'Tout contenu abusif ou frauduleux est interdit et peut entraîner une suspension.',
    terms_point_3:
      'Nous nous réservons le droit de modifier les conditions à tout moment.',
    sitemap_intro:
      'Accédez rapidement aux pages principales de Plombier Tunisie grâce à notre plan du site.',
    sitemap_page_accueil: 'Accueil',
    sitemap_page_services: 'Services',
    sitemap_page_zones: "Zones d'intervention",
    sitemap_page_pieces: "Pièces d'occasion",
    sitemap_page_profil: 'Profil',
    sitemap_page_contact: 'Contact & Support',
    boutique_acces: 'Accéder au marketplace',
    filtres: 'Filtres',
    toutes_categories: 'Toutes les catégories',
    rechercher: 'Rechercher une pièce...',
    prix: 'Prix',
    etat: 'État',
    tous: 'Tous',
    tri: 'Trier par',
    nouveautes: 'Nouveautés',
    prix_croissant: 'Prix : bas à élevé',
    prix_decroissant: 'Prix : élevé à bas',
    recommande: 'Recommandés',
    aucun_produit: 'Aucun article ne correspond à votre recherche.',
    contactez_experts: 'Demander une Intervention Immédiate',
    zone_tagline:
      "Des équipes d'artisans plombiers prêtes à intervenir en urgence sur le Grand Tunis et le Sahel. Intervention garantie sous 30 minutes.",
    demande_intervention: "Formulaire d'intervention urgente",
    contact_immediat: "Appel d'Urgence",
    carte_interactive: 'Zone de Couverture Directe',
    ouvrir_maps: 'Google Maps direct',
    envoyer_demande: "Soumettre ma demande d'urgence",
    zones_directes: 'Intervention Immédiate 24h/24',
    gallery: { title: 'Galerie', manageGallery: 'Gérer la galerie' },
    appelez_nous: 'Appelez-nous',
  },
  AR: {
    accueil: 'الرئيسية',
    services: 'الخدمات',
    zones: 'مناطق التدخل',
    pieces: 'قطع غيار مستعملة',
    mon_profil: 'الملف الشخصي',
    paiement: 'الدفع الإلكتروني',
    admin: 'الإدارة',
    tagline: 'ترصيص · تكييف · غاز · تدفئة مركزية',
    whatsapp_msg: 'مرحباً، أحتاج إلى سباك محترف.',
    devis_msg: 'مرحباً، أود طلب كشف وتقدير لخدمة: ',
    call: 'اتصال مباشر',
    whatsapp: 'واتساب',
    demander_devis: 'طلب تقدير سعر',
    maintenance: 'قريباً جداً',
    bientot_dispo: 'الدفع الإلكتروني الآمن',
    maintenance_desc:
      'نحن بصدد دمج بوابة دفع إلكتروني تونسية آمنة (ClicToPay / Sobflous). قريباً، ستتمكن من طلب قطع الغيار المستعملة مباشرة والدفع عبر الإنترنت مع التوصيل لباب منزلك !',
    avertir: 'أعلمني عند الإطلاق',
    progression: 'نسبة تقدم الإنجاز',
    retour_accueil: 'العودة للرئيسية',
    resume_commande: 'ملخص الطلبية',
    tableau_bord: 'لوحة التحكم',
    tableau_bord_desc:
      'قم بإدارة بياناتك الشخصية واستعرض قطع الغيار التي أضفتها للمفضلة.',
    compte_particulier: 'حساب حريف',
    securite: 'الأمان وكلمة المرور',
    mdp_actuel: 'كلمة المرور الحالية',
    nouveau_mdp: 'كلمة المرور الجديدة',
    mettre_a_jour: 'تحديث كلمة المرور',
    mes_favoris: 'المفضلة لدي',
    parcourir_market: 'تصفح كتالوج قطع الغيار',
    plus_favoris: 'تبحث عن قطع أخرى ؟',
    plus_favoris_desc:
      'قم بإضافة إعجاب (قلب) على قطع الغيار لحفظها هنا والرجوع إليها بسهولة.',
    consulter: 'التفاصيل التقنية',
    nos_services: 'خدماتنا',
    nos_services_subtitle:
      'تدخلات في الترصيص والتكييف والغاز والتدفئة لضمان منزل آمن وعملي طوال السنة.',
    voir_tout: 'عرض الكل',
    services_title: 'خدماتنا',
    services_subtitle:
      'تدخلات في الترصيص والتكييف والغاز والتدفئة لضمان منزل آمن وعملي طوال السنة.',
    view_all: 'عرض الكل',
    admin_edit_email: 'تعديل بريد المدير',
    admin_edit_phone: 'تعديل واتساب الدعم',
    support_whatsapp: 'واتساب الدعم',
    villes_couvertes: 'المدن المغطاة',
    appeler_whatsapp: 'تواصل عبر واتساب',
    nom_complet: 'الاسم الكامل',
    telephone: 'الهاتف',
    ville: 'المدينة',
    nos_expertises: 'خبراتنا الفنية المعتمدة',
    expertises_desc:
      'خدمات ترصيص وتصليح سريعة ومحترفة في تونس الكبرى وجهة الساحل.',
    plomberie_generale: 'الترصيص العام والسباكة',
    plomberie_desc_1: 'كشف التسربات بالكاميرا الحرارية الحديثة',
    plomberie_desc_2: 'تركيب خلاطات وصنابير مياه راقية وذكية',
    plomberie_desc_3: 'تجديد وصيانة شبكات الصرف الصحي بالكامل',
    climatisation: 'تكييف الهواء وتبريده',
    clim_desc_1: 'شحن غاز التبريد R410/R32 للمكيفات',
    clim_desc_2: 'تنظيف وتعقيم دوري مضاد للبكتيريا',
    clim_desc_3: 'تعديل وصيانة المكيفات لتوفير استهلاك الكهرباء',
    installation_gaz: 'تركيبات الغاز المنزلي',
    gaz_desc_1: 'مطابقة التوصيلات لمعايير الشركة التونسية للكهرباء والغاز',
    gaz_desc_2: 'تركيب أجهزة إنذار متطورة لكشف تسرب أحادي أكسيد الكربون',
    gaz_desc_3: 'توصيل الغاز بأمان تام للطباخات والمراجل',
    chauffage_central: 'التدفئة المركزية والمراجل',
    chauffage_desc_1: 'الصيانة السنوية الشاملة للمراجل والمشعات',
    chauffage_desc_2: 'تنظيف وإزالة الترسبات الكلسية من الأنابيب',
    chauffage_desc_3: 'التحكم الذكي والتحكم عن بعد في درجة الحرارة',
    experience_val: '+15',
    experience_lbl: 'سنة من الخبرة',
    dispo_val: '24/7',
    dispo_lbl: 'جاهزية تامة',
    gov_val: '24',
    gov_lbl: 'ولاية مغطاة',
    satisfaction_val: '100%',
    satisfaction_lbl: 'رضا الحرفاء التام',
    credits: '© 2026 سباك تونس. جميع الحقوق محفوظة.',
    foot_desc:
      'أول شبكة خدمات وتجارة إلكترونية في تونس متخصصة في التدخلات السريعة لترصيص المياه وتوفير قطع الغيار المضمونة والمجربة.',
    navigation: 'أقسام الموقع',
    informations: 'معلومات قانونية',
    politique: 'سياسة الخصوصية والأمان',
    conditions_util: 'شروط الاستخدام العامة',
    plan_site: 'خريطة الموقع التقنية',
    informations_desc:
      'تجد هنا جميع المعلومات القانونية المتعلقة باستخدام منصتنا.',
    privacy_intro:
      'نحن نحافظ على خصوصية بياناتك ونستخدم فقط المعلومات الضرورية لتقديم الخدمة وتحسين تجربتك.',
    privacy_point_1: 'جمع بيانات محدود فقط لطلبات التدخل والطلبات.',
    privacy_point_2: 'لا يتم بيع بياناتك الشخصية لأي طرف ثالث.',
    privacy_point_3: 'تشفير آمن وحفظ البيانات الحساسة في بيئة محمية.',
    terms_intro:
      'باستخدام هذا الموقع، فإنك توافق على شروط الاستخدام الموضحة أدناه.',
    terms_point_1: 'الخدمات تُقدَّم وفق المعلومات والتوافر المعروض.',
    terms_point_2: 'يُمنع أي محتوى مسيء أو احتيالي وقد يؤدي إلى إيقاف الحساب.',
    terms_point_3: 'نحتفظ بحق تعديل الشروط في أي وقت.',
    sitemap_intro:
      'انتقل سريعًا إلى الصفحات الرئيسية لموقع Plombier Tunisie من خلال خريطة الموقع.',
    sitemap_page_accueil: 'الصفحة الرئيسية',
    sitemap_page_services: 'الخدمات',
    sitemap_page_zones: 'مناطق الخدمة',
    sitemap_page_pieces: 'قطع الغيار',
    sitemap_page_profil: 'الملف الشخصي',
    sitemap_page_contact: 'التواصل والدعم',
    boutique_acces: 'الذهاب إلى سوق قطع الغيار',
    filtres: 'تصفية البحث',
    toutes_categories: 'جميع الأصناف',
    rechercher: 'ابحث عن قطعة...',
    prix: 'السعر',
    etat: 'الحالة',
    tous: 'الكل',
    tri: 'ترتيب حسب',
    nouveautes: 'المضافة حديثاً',
    prix_croissant: 'السعر: من الأقل للأعلى',
    prix_decroissant: 'السعر: من الأعلى للأقل',
    recommande: 'المميزة',
    aucun_produit: 'لم نجد أي قطعة تتطابق مع معايير البحث.',
    contactez_experts: 'طلب تدخل طارئ وفوري',
    zone_tagline:
      'فرقنا الفنية جاهزة للتدخل العاجل والسريع في كامل ولايات تونس الكبرى والساحل. نصلك في غضون 30 دقيقة كأقصى تقدير.',
    demande_intervention: 'استمارة طلب تدخل عاجل',
    contact_immediat: 'خط الطوارئ الساخن',
    carte_interactive: 'مناطق التغطية المباشرة',
    ouvrir_maps: 'فتح خرائط جوجل مباشرة',
    envoyer_demande: 'إرسال طلب التدخل العاجل',
    zones_directes: 'التدخل الفوري على مدار الساعة',
    gallery: { title: 'المعرض', manageGallery: 'إدارة المعرض' },
    appelez_nous: 'اتصل بنا فوراً',
  },
  EN: {
    accueil: 'Home',
    services: 'Services',
    zones: 'Service Areas',
    pieces: 'Used Parts',
    mon_profil: 'Profile',
    paiement: 'Payment',
    admin: 'Admin',
    tagline: 'Plumbing · Air Conditioning · Gaz · Heating',
    whatsapp_msg: 'Hello, I need a plumber.',
    devis_msg: 'Hello, I would like to request a quote for: ',
    call: 'Call',
    whatsapp: 'WhatsApp',
    demander_devis: 'Request a Quote',
    maintenance: 'COMING SOON',
    bientot_dispo: 'Online Payment',
    maintenance_desc:
      'We are setting up our secure online payment gateway for Tunisia (ClicToPay / Sobflous). Soon you will be able to order used parts with home delivery!',
    avertir: 'Notify Me',
    progression: 'Integration Progress',
    retour_accueil: 'Back to Home',
    resume_commande: 'Order Summary',
    tableau_bord: 'Dashboard',
    tableau_bord_desc:
      'Manage your personal information and view your favorite spare parts.',
    compte_particulier: 'Individual Customer',
    securite: 'Security & Password',
    mdp_actuel: 'Current password',
    nouveau_mdp: 'New password',
    mettre_a_jour: 'Update password',
    mes_favoris: 'My Favorites',
    parcourir_market: 'Browse Catalog',
    plus_favoris: 'Looking for more parts?',
    plus_favoris_desc:
      'Add a heart to our used items to save them here instantly.',
    consulter: 'Technical Details',
    nos_services: 'Our Services',
    nos_services_subtitle:
      'Plumbing, AC, gas, and heating interventions for reliable homes all year.',
    voir_tout: 'View all',
    services_title: 'Services',
    services_subtitle:
      'Plumbing, AC, gas, and heating interventions for reliable homes all year.',
    view_all: 'View all',
    admin_edit_email: 'Edit admin email',
    admin_edit_phone: 'Edit support WhatsApp',
    support_whatsapp: 'Support WhatsApp',
    villes_couvertes: 'Covered cities',
    appeler_whatsapp: 'Contact WhatsApp',
    nom_complet: 'Full name',
    telephone: 'Phone',
    ville: 'City',
    nos_expertises: 'Our Technical Expertise',
    expertises_desc:
      'Professional plumbing repairs and renovations across Greater Tunis and the Sahel region.',
    plomberie_generale: 'General Plumbing',
    plomberie_desc_1: 'Thermal camera leak detection',
    plomberie_desc_2: 'High-end faucet installation',
    plomberie_desc_3: 'Drain pipe replacement',
    climatisation: 'Air Conditioning',
    clim_desc_1: 'R410/R32 refrigerant gas recharge',
    clim_desc_2: 'Certified anti-bacterial cleaning',
    clim_desc_3: 'Energy consumption optimization',
    installation_gaz: 'Gas Installation',
    gaz_desc_1: 'STEG compliance checks',
    gaz_desc_2: 'Carbon monoxide detector installation',
    gaz_desc_3: 'Safe connection for stoves and boilers',
    chauffage_central: 'Central Heating',
    chauffage_desc_1: 'Full annual boiler maintenance',
    chauffage_desc_2: 'Hydrodynamic loop flushing',
    chauffage_desc_3: 'Smart regulation with connected thermostat',
    experience_val: '15+',
    experience_lbl: 'Years of Experience',
    dispo_val: '24/7',
    dispo_lbl: 'Availability',
    gov_val: '24',
    gov_lbl: 'Governorates Covered',
    satisfaction_val: '100%',
    satisfaction_lbl: 'Customer Satisfaction',
    credits: '© 2026 Plumber Tunisia. All rights reserved.',
    foot_desc:
      'The premier professional ecosystem in Tunisia specialized in express plumbing troubleshooting and certified used spare parts reselling.',
    navigation: 'Navigation',
    informations: 'Legal Information',
    politique: 'Privacy Policy',
    conditions_util: 'Terms of Service',
    plan_site: 'Site Map',
    informations_desc:
      'Find all the legal information here about how our platform operates and how we protect your data.',
    privacy_intro:
      'Your privacy is a priority. We only collect the data needed to deliver our services and improve your experience.',
    privacy_point_1: 'Minimal data collection for service requests and orders.',
    privacy_point_2: 'We never sell your contact details to third parties.',
    privacy_point_3:
      'Sensitive data is protected with encryption and secure storage.',
    terms_intro:
      'By using this site, you agree to the following terms of service.',
    terms_point_1:
      'Services are provided based on the displayed information and availability.',
    terms_point_2:
      'Abusive or fraudulent content is prohibited and may result in suspension.',
    terms_point_3: 'We reserve the right to update these terms at any time.',
    sitemap_intro:
      'Quickly access the main Plombier Tunisia pages via our site map.',
    sitemap_page_accueil: 'Home',
    sitemap_page_services: 'Services',
    sitemap_page_zones: 'Service Areas',
    sitemap_page_pieces: 'Used Parts',
    sitemap_page_profil: 'Profile',
    sitemap_page_contact: 'Contact & Support',
    boutique_acces: 'Access Marketplace',
    filtres: 'Filters',
    toutes_categories: 'All Categories',
    rechercher: 'Search for a part...',
    prix: 'Price',
    etat: 'Condition',
    tous: 'All',
    tri: 'Sort by',
    nouveautes: 'New Arrivals',
    prix_croissant: 'Price: low to high',
    prix_decroissant: 'Price: high to low',
    recommande: 'Recommended',
    aucun_produit: 'No articles found matching your criteria.',
    contactez_experts: 'Request Immediate Intervention',
    zone_tagline:
      'Teams of skilled plumbers ready to intervene immediately in Greater Tunis and the Sahel. Guaranteed response within 30 minutes.',
    demande_intervention: 'Emergency Request Form',
    contact_immediat: 'Emergency Hot Line',
    carte_interactive: 'Direct Coverage Zone',
    ouvrir_maps: 'Open Google Maps',
    envoyer_demande: 'Submit Emergency Request',
    zones_directes: 'Immediate 24/7 Intervention',
    gallery: { title: 'Gallery', manageGallery: 'Manage Gallery' },
    appelez_nous: 'Call Us Now',
  },
};

export const AppNavigator = () => {
  const { user: authUser, signIn, signOut } = useAuth();
  const { showToast } = useToast();
  const { t: translate, i18n } = useTranslation();

  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.parts.listings);
  const favorites = useSelector((state: RootState) => state.parts.favorites);
  const reduxCategories = useSelector(
    (state: RootState) => state.categories.items,
  );
  const usersList = useSelector((state: RootState) => state.users.items);
  const galleryItems = useSelector((state: RootState) => state.gallery.items);
  const plombierSettings = useSelector(
    (state: RootState) => state.plombierSettings,
  );
  const uiState = useSelector((state: RootState) => state.ui);
  const { currentLang, currentTheme, activeTab, bypassAuth } = uiState;

  // Initial Seed for Categories inside Redux on Mount
  useEffect(() => {
    if (reduxCategories.length === 0) {
      const initialCats: LocalCategory[] = [
        {
          id: 'cat-1',
          name: 'Robinetterie',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-2',
          name: 'Chauffe-eau',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-3',
          name: 'Canalisation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-4',
          name: 'Climatisation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-5',
          name: 'Radiateurs',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-6',
          name: 'Vannes',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-7',
          name: 'Autre',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      initialCats.forEach(cat => dispatch(addCategory(cat)));
    }
    // Seed services if empty
    const services = (window as any).__initialServicesSeeded;
    // simple check: if services slice empty, seed a few basic services
    if (!services) {
      const initialServices = [
        {
          id: 'srv-1',
          name: 'plomberie_generale',
          icon: 'plumbing',
          desc: 'plomberie_desc_long',
          pts: ['plomberie_desc_1', 'plomberie_desc_2', 'plomberie_desc_3'],
          whatsappText: 'devis_msg',
          imgBefore: 'service_before_plomberie',
          imgAfter: 'service_after_plomberie',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'srv-2',
          name: 'climatisation',
          icon: 'ac',
          desc: 'clim_desc_long',
          pts: ['clim_desc_1', 'clim_desc_2', 'clim_desc_3'],
          whatsappText: 'devis_msg',
          imgBefore: 'service_before_clim',
          imgAfter: 'service_after_clim',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'srv-3',
          name: 'installation_gaz',
          icon: 'gas',
          desc: 'gaz_desc_long',
          pts: ['gaz_desc_1', 'gaz_desc_2', 'gaz_desc_3'],
          whatsappText: 'devis_msg',
          imgBefore: 'service_before_gaz',
          imgAfter: 'service_after_gaz',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'srv-4',
          name: 'chauffage_central',
          icon: 'heater',
          desc: 'chauffage_desc_long',
          pts: ['chauffage_desc_1', 'chauffage_desc_2', 'chauffage_desc_3'],
          whatsappText: 'devis_msg',
          imgBefore: 'service_before_chauffage',
          imgAfter: 'service_after_chauffage',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      initialServices.forEach(s => dispatch(addService(s)));
      (window as any).__initialServicesSeeded = true;
    }
  }, [reduxCategories, dispatch]);

  // Main Authentication State
  const [sessionUser, setSessionUser] = useState<WebSessionUser | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>('anonyme');

  // Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Theme & Language are persisted in Redux UI state.

  // Active Tab is persisted in Redux UI state.
  // User tabs: 'Accueil' | 'Services' | 'Zones' | 'Marketplace' | 'Profile' | 'Payment'
  // Admin tabs: 'AdminAccueil' | 'GestionAnnonce' | 'GestionCategorie' | 'GestionUser' | 'AdminProfile' | 'Analytics'

  // Auth Forms
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'forgot'>(
    'signin',
  );
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatusMessage, setForgotStatusMessage] = useState<string | null>(
    null,
  );

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
  const [currentMdp, setCurrentMdp] = useState('');
  const [newMdp, setNewMdp] = useState('');

  // Marketplace and Zones have been moved to feature screens.
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Newsletter form
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Admin announcement modal/form state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [annonceTitle, setAnnonceTitle] = useState('');
  const [annonceSubtitle, setAnnonceSubtitle] = useState('');
  const [annonceCategory, setAnnonceCategory] = useState('Robinetterie');
  const [annoncePrice, setAnnoncePrice] = useState(0);
  const [annonceCondition, setAnnonceCondition] = useState<
    'comme neuf' | 'bon état' | 'pour pièces'
  >('comme neuf');
  const [annonceDescription, setAnnonceDescription] = useState('');
  const [annonceImage, setAnnonceImage] = useState('faucet');
  const [annonceIsFeatured, setAnnonceIsFeatured] = useState(false);
  const [annonceIsAvailable, setAnnonceIsAvailable] = useState(true);

  // Admin Category form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<LocalCategory | null>(
    null,
  );
  const [editCategoryName, setEditCategoryName] = useState('');
  const [categoryErrorMessage, setCategoryErrorMessage] = useState<
    string | null
  >(null);

  // Admin user edit state
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserRole, setEditUserRole] = useState<'admin' | 'user'>('user');

  // Quick WhatsApp pre-filled technical messages
  const t = translations[currentLang] || translations.FR;
  const galleryTitle = (t as any)?.gallery?.title ?? 'Galerie';
  const galleryManageLabel =
    (t as any)?.gallery?.manageGallery ?? 'Gérer la galerie';
  const isRTL = currentLang === 'AR';
  const businessName = plombierSettings.businessName || 'Plombier Tunisie';
  const experienceYears = plombierSettings.experienceYears || 15;
  const languageOrder: Array<'FR' | 'AR' | 'EN'> = ['FR', 'AR', 'EN'];
  const nextLanguage =
    languageOrder[
      (languageOrder.indexOf(currentLang) + 1) % languageOrder.length
    ];
  const supportEmail =
    plombierSettings.supportEmail || profileEmail || sessionUser?.email || '';
  const supportWhatsAppNumber =
    plombierSettings.supportPhone || profilePhone || sessionUser?.phone || '';
  const supportWhatsAppDigits = supportWhatsAppNumber.replace(/\D/g, '');
  const tCommon = (key: string, defaultValue: string) =>
    translate(key, { defaultValue });
  const setActiveTab = (tab: string) => dispatch(setActiveTabAction(tab));
  const setCurrentLang = (lang: 'FR' | 'AR' | 'EN') =>
    dispatch(setCurrentLangAction(lang));
  const setCurrentTheme = (theme: 'light' | 'dark') =>
    dispatch(setCurrentThemeAction(theme));
  const setBypassAuth = (value: boolean) =>
    dispatch(setBypassAuthAction(value));

  const startWebSession = async (userData: WebSessionUser, tab: string) => {
    setSessionUser(userData);
    setCurrentRole(userData.role);
    setBypassAuth(true);
    setActiveTab(tab);
    await signIn(userData);
  };

  // Persist language direction and i18n locale when the currentLang changes
  useEffect(() => {
    i18n.changeLanguage(currentLang.toLowerCase());
    document.documentElement.dir = translate('web.autoText1', {
      defaultValue: currentLang === 'AR' ? 'rtl' : 'ltr',
    });
  }, [currentLang, i18n]);

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
      setProfileEmail(sessionUser.email || '');
      setProfilePhone(sessionUser.phone || '');
      setProfileCity(sessionUser.city || 'Tunis');
    }
  }, [sessionUser]);

  useEffect(() => {
    if (!authUser) {
      setSessionUser(null);
      setCurrentRole('anonyme');
      setBypassAuth(true);
      setActiveTab('Accueil');
      return;
    }

    const restoredUser: WebSessionUser = {
      ...authUser,
      role: authUser.role as Role,
      city: authUser.addresses?.[0] || 'Tunis',
    };
    setSessionUser(restoredUser);
    setCurrentRole(restoredUser.role);
    setBypassAuth(true);
    if (!sessionUser) {
      setActiveTab(restoredUser.role === 'admin' ? 'AdminAccueil' : 'Accueil');
    }
  }, [authUser]);

  // Synchronize currentTheme with html root element to enable Tailwind's dark: variant class
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  // Update the browser title from the current business name settings
  useEffect(() => {
    document.title = businessName ? `${businessName} | Plombier` : 'Plombier';
  }, [businessName]);

  // Favorite hearts handler
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentRole === 'anonyme') {
      showToast(
        tCommon(
          'web.favoriteLoginRequired',
          translate('web.autoText2', {
            defaultValue:
              currentLang === 'AR'
                ? 'يرجى تسجيل الدخول لحفظ المفضلة'
                : 'Veuillez vous connecter pour gérer vos favoris.',
          }),
        ),
        'info',
      );
      return;
    }
    dispatch(toggleFavoriteAction(id));
    if (favorites.includes(id)) {
      showToast(
        tCommon(
          'web.favoriteRemoved',
          translate('web.autoText3', {
            defaultValue:
              currentLang === 'AR'
                ? 'تمت إزالته من المفضلة'
                : 'Retiré des favoris',
          }),
        ),
        'info',
      );
    } else {
      showToast(
        tCommon(
          'web.favoriteAdded',
          translate('web.autoText4', {
            defaultValue:
              currentLang === 'AR'
                ? 'أضيف إلى المفضلة !'
                : 'Ajouté aux favoris !',
          }),
        ),
        'success',
      );
    }
  };

  // Sign In submit handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authTab === 'forgot') {
      const email = forgotEmail.trim().toLowerCase();
      if (!email) {
        showToast(
          translate('web.autoText5', {
            defaultValue:
              currentLang === 'AR'
                ? 'الرجاء إدخال البريد الإلكتروني'
                : 'Veuillez saisir votre email',
          }),
          'error',
        );
        return;
      }

      const knownEmails = ['admin@demo.com', 'user@demo.com'];
      const foundUser =
        usersList.some(u => u.email.toLowerCase() === email) ||
        knownEmails.includes(email);
      setForgotStatusMessage(
        currentLang === 'AR'
          ? 'إذا كان هذا البريد مسجلاً، تم إرسال تعليمات إعادة تعيين كلمة المرور.'
          : 'Si ce compte existe, un lien de réinitialisation a été envoyé.',
      );

      if (foundUser) {
        showToast(
          currentLang === 'AR'
            ? 'تم إرسال رابط إعادة التعيين إلى بريدك.'
            : 'Un email de réinitialisation a été envoyé.',
          'success',
        );
      } else {
        showToast(
          currentLang === 'AR'
            ? 'إذا كان هذا البريد مسجلاً، فسيتم إرسال تعليمات.'
            : 'Si le compte existe, vous recevrez un email.',
          'info',
        );
      }
      setAuthTab('signin');
      setForgotEmail('');
      return;
    }

    if (!signinEmail || !signinPassword) {
      showToast(
        translate('web.autoText5', {
          defaultValue:
            currentLang === 'AR'
              ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
              : 'Veuillez remplir tous les champs',
        }),
        'error',
      );
      return;
    }

    // Demo Admin Check
    if (
      signinEmail.toLowerCase() === 'admin@demo.com' &&
      signinPassword === 'admin123'
    ) {
      const adminSession: WebSessionUser = {
        id: 'admin-web-demo',
        name: 'Admin Plombier',
        email: 'admin@demo.com',
        role: 'admin',
        phone: '+216 22 000 111',
        status: 'active',
        addresses: ['Tunis'],
        city: 'Tunis',
      };
      await startWebSession(adminSession, 'AdminAccueil');
      showToast(
        translate('web.autoText6', {
          defaultValue:
            currentLang === 'AR'
              ? 'مرحباً بك حضرة المدير'
              : "Bienvenue dans votre espace d'administration !",
        }),
        'success',
      );
      return;
    }

    // Demo User Check
    if (
      signinEmail.toLowerCase() === 'user@demo.com' &&
      signinPassword === 'user123'
    ) {
      const userSession: WebSessionUser = {
        id: 'user-web-demo',
        name: 'Ahmed Ben Ali',
        email: 'user@demo.com',
        role: 'user',
        phone: '+216 22 456 789',
        status: 'active',
        addresses: ['Ariana'],
        city: 'Ariana',
      };
      await startWebSession(userSession, 'Accueil');
      showToast(
        translate('web.autoText7', {
          defaultValue:
            currentLang === 'AR'
              ? 'مرحباً بك أحمد بن علي'
              : 'Ravi de vous revoir, Ahmed Ben Ali !',
        }),
        'success',
      );
      return;
    }

    // Check custom registrations in Redux list
    const foundUser = usersList.find(
      u => u.email.toLowerCase() === signinEmail.toLowerCase(),
    );
    if (foundUser) {
      if (foundUser.status === 'rejected') {
        showToast(
          translate('web.autoText8', {
            defaultValue:
              currentLang === 'AR'
                ? 'هذا الحساب معطل مؤقتاً'
                : 'Ce compte est suspendu ou bloqué.',
          }),
          'error',
        );
        return;
      }
      const customSession: WebSessionUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role as Role,
        phone: foundUser.phone,
        status: foundUser.status,
        addresses: foundUser.addresses,
        city: foundUser.addresses?.[0] || 'Tunis',
      };
      await startWebSession(
        customSession,
        foundUser.role === 'admin' ? 'AdminAccueil' : 'Accueil',
      );
      showToast(
        translate('web.autoText9', {
          defaultValue:
            currentLang === 'AR'
              ? `أهلاً بك ${foundUser.name}`
              : `Connexion réussie. Bienvenue, ${foundUser.name} !`,
        }),
        'success',
      );
      return;
    }

    showToast(
      tCommon(
        'web.invalidCredentials',
        translate('web.autoText10', {
          defaultValue:
            currentLang === 'AR'
              ? 'بيانات الاعتماد خاطئة'
              : 'Identifiants invalides ou incorrects.',
        }),
      ),
      'error',
    );
  };

  // Sign Up submit handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !signupName ||
      !signupEmail ||
      !signupPhone ||
      !signupPassword ||
      !signupConfirmPassword
    ) {
      showToast(
        translate('web.autoText11', {
          defaultValue:
            currentLang === 'AR'
              ? 'الرجاء تعبئة كافة الفراغات'
              : 'Veuillez remplir tous les champs obligatoires.',
        }),
        'error',
      );
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      showToast(
        translate('web.autoText12', {
          defaultValue:
            currentLang === 'AR'
              ? 'كلمات المرور غير متطابقة'
              : 'Les mots de passe ne correspondent pas.',
        }),
        'error',
      );
      return;
    }

    // Check if email already taken
    const exists = usersList.find(
      u => u.email.toLowerCase() === signupEmail.toLowerCase(),
    );
    if (exists) {
      showToast(
        translate('web.autoText13', {
          defaultValue:
            currentLang === 'AR'
              ? 'هذا البريد الإلكتروني مسجل بالفعل'
              : 'Cette adresse email est déjà enregistrée.',
        }),
        'error',
      );
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
      updatedAt: new Date().toISOString(),
    };
    dispatch(addUser(newUserObj));

    // Sign in immediately
    const customSession: WebSessionUser = {
      id: newUserObj.id,
      name: signupName,
      email: signupEmail.toLowerCase(),
      role: 'user',
      phone: signupPhone,
      status: 'active',
      addresses: [signupCity],
      city: signupCity,
    };
    await startWebSession(customSession, 'Accueil');
    showToast(
      translate('web.autoText14', {
        defaultValue:
          currentLang === 'AR'
            ? 'تم إنشاء حسابك وتفعيله بنجاح !'
            : 'Votre compte a été créé avec succès. Bienvenue !',
      }),
      'success',
    );

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
    showToast(
      tCommon(
        'web.logoutSuccess',
        translate('web.autoText15', {
          defaultValue:
            currentLang === 'AR'
              ? 'تم تسجيل خروجك بنجاح'
              : 'Déconnexion réussie ! A bientôt.',
        }),
      ),
      'info',
    );
  };

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

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setEditCategoryName('');
    setCategoryErrorMessage(null);
    setNewCategoryName('');
    setNewCategoryImage(null);
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat: LocalCategory) => {
    setEditingCategory(cat);
    setEditCategoryName(cat.name);
    setNewCategoryImage(cat.imageUri || null);
    setCategoryErrorMessage(null);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryErrorMessage(null);
    setEditingCategory(null);
    setNewCategoryName('');
    setEditCategoryName('');
    setNewCategoryImage(null);
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
      showToast(
        translate('web.autoText16', {
          defaultValue:
            currentLang === 'AR'
              ? 'الرجاء تعبئة بيانات الإعلان بشكل صحيح'
              : "Données d'annonce incomplètes.",
        }),
        'error',
      );
      return;
    }

    if (editingProduct) {
      // Modify Listing Redux
      const updatedItem: Product = {
        ...editingProduct,
        title: annonceTitle,
        subtitle:
          annonceSubtitle.toUpperCase() || annonceCategory.toUpperCase(),
        category: annonceCategory,
        price: Number(annoncePrice),
        condition: annonceCondition,
        description: annonceDescription,
        image: annonceImage,
        isFeatured: annonceIsFeatured,
        isAvailable: annonceIsAvailable,
      };
      dispatch(updateListing(updatedItem));
      showToast(
        translate('web.autoText17', {
          defaultValue:
            currentLang === 'AR'
              ? 'تم تحديث الإعلان بنجاح !'
              : "L'annonce a été modifiée avec succès !",
        }),
        'success',
      );
    } else {
      // Create new Listing Redux
      const newItem: Product = {
        id: 'prod-' + Date.now(),
        title: annonceTitle,
        subtitle:
          annonceSubtitle.toUpperCase() || annonceCategory.toUpperCase(),
        category: annonceCategory,
        price: Number(annoncePrice),
        condition: annonceCondition,
        description: annonceDescription,
        image: annonceImage,
        isFeatured: annonceIsFeatured,
        isAvailable: annonceIsAvailable,
      };
      dispatch(addListing(newItem));
      showToast(
        translate('web.autoText18', {
          defaultValue:
            currentLang === 'AR'
              ? 'تم إضافة الإعلان بنجاح !'
              : 'Nouvelle annonce publiée avec succès !',
        }),
        'success',
      );
    }

    setShowAdminModal(false);
  };

  const handleDeleteAnnonce = (id: string) => {
    if (
      window.confirm(
        translate('web.autoText19', {
          defaultValue:
            currentLang === 'AR'
              ? 'هل أنت متأكد من حذف هذا الإعلان ؟'
              : 'Voulez-vous vraiment supprimer cette annonce ?',
        }),
      )
    ) {
      dispatch(deleteListing(id));
      showToast(
        translate('web.autoText20', {
          defaultValue:
            currentLang === 'AR' ? 'تم حذف الإعلان' : 'Annonce supprimée !',
        }),
        'info',
      );
    }
  };

  // Admin dynamic Categories operations
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryErrorMessage(null);

    const categoryName = editingCategory ? editCategoryName : newCategoryName;
    if (!categoryName.trim()) {
      setCategoryErrorMessage(
        translate('web.autoText21', {
          defaultValue:
            currentLang === 'AR'
              ? 'يرجى إدخال اسم الصنف.'
              : 'Veuillez saisir un nom de catégorie.',
        }),
      );
      return;
    }

    const normalized = categoryName.trim();
    const duplicate = reduxCategories.find(
      c =>
        c.name.toLowerCase() === normalized.toLowerCase() &&
        c.id !== editingCategory?.id,
    );
    if (duplicate) {
      setCategoryErrorMessage(
        translate('web.autoText22', {
          defaultValue:
            currentLang === 'AR'
              ? 'هذا الصنف موجود بالفعل'
              : 'Catégorie déjà existante.',
        }),
      );
      return;
    }

    if (editingCategory) {
      const renamed = {
        ...editingCategory,
        name: normalized,
        imageUri: newCategoryImage || editingCategory.imageUri,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateCategory(renamed));
      showToast(
        translate('web.autoText25', {
          defaultValue:
            currentLang === 'AR'
              ? 'تمت إعادة تسمية الصنف !'
              : 'Catégorie modifiée !',
        }),
        'success',
      );
    } else {
      const newCat = {
        id: 'cat-' + Date.now(),
        name: normalized,
        imageUri: newCategoryImage || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addCategory(newCat));
      showToast(
        translate('web.autoText23', {
          defaultValue:
            currentLang === 'AR'
              ? 'تمت إضافة الصنف بنجاح !'
              : 'Catégorie ajoutée avec succès !',
        }),
        'success',
      );
    }

    setEditingCategory(null);
    setNewCategoryName('');
    setEditCategoryName('');
    setNewCategoryImage(null);
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (
      window.confirm(
        translate('web.autoText26', {
          defaultValue:
            currentLang === 'AR'
              ? `هل أنت متأكد من حذف صنف "${name}" ؟`
              : `Voulez-vous supprimer la catégorie "${name}" ?`,
        }),
      )
    ) {
      dispatch(deleteCategory(id));
      showToast(
        translate('web.autoText27', {
          defaultValue:
            currentLang === 'AR' ? 'تم حذف الصنف' : 'Catégorie supprimée !',
        }),
        'info',
      );
    }
  };

  // Inline category add/edit handled via `editingCategory`, `newCategoryName`, `editCategoryName`, and image state.

  // Admin User status toggles
  const handleToggleUserRole = (userId: string, currentVal: string) => {
    const target = usersList.find(u => u.id === userId);
    if (!target) return;

    const updated = {
      ...target,
      role: currentVal === 'admin' ? 'user' : 'admin',
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateUser(updated));
    showToast(
      translate('web.autoText28', {
        defaultValue:
          currentLang === 'AR'
            ? 'تم تغيير رتبة المستخدم'
            : "Rôle de l'utilisateur modifié !",
      }),
      'success',
    );
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const target = usersList.find(u => u.id === userId);
    if (!target) return;

    // Check that we aren't locking ourselves
    if (
      sessionUser &&
      target.email.toLowerCase() === sessionUser.email.toLowerCase()
    ) {
      showToast(
        translate('web.autoText29', {
          defaultValue:
            currentLang === 'AR'
              ? 'لا يمكنك حظر حسابك الخاص !'
              : 'Impossible de bloquer votre propre compte admin !',
        }),
        'error',
      );
      return;
    }

    const updated = {
      ...target,
      status: (currentStatus === 'active' ? 'rejected' : 'active') as
        | 'active'
        | 'rejected',
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateUser(updated));
    showToast(
      currentLang === 'AR'
        ? currentStatus === 'active'
          ? 'تم حظر المستخدم بنجاح'
          : 'تم تنشيط حساب المستخدم'
        : currentStatus === 'active'
        ? 'Utilisateur bloqué avec succès !'
        : 'Compte réactivé !',
      'info',
    );
  };

  const handleStartEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserPhone(user.phone || '');
    setEditUserRole(user.role === 'admin' ? 'admin' : 'user');
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUser: UserAccount = {
      ...editingUser,
      name: editUserName.trim(),
      email: editUserEmail.trim().toLowerCase(),
      phone: editUserPhone.trim() || undefined,
      role: editUserRole,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateUser(updatedUser));
    showToast(
      currentLang === 'AR'
        ? 'تم تحديث المستخدم بنجاح'
        : 'Utilisateur mis à jour avec succès !',
      'success',
    );
    setEditingUser(null);
  };

  const handleCancelEditUser = () => {
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string, userRole: string) => {
    if (userRole === 'admin') {
      showToast(
        currentLang === 'AR'
          ? 'لا يمكنك حذف حساب المسؤول'
          : 'Impossible de supprimer un compte administrateur.',
        'error',
      );
      return;
    }

    if (
      window.confirm(
        currentLang === 'AR'
          ? 'هل أنت متأكد أنك تريد حذف هذا المستخدم؟'
          : 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      )
    ) {
      dispatch(deleteUser(userId));
      showToast(
        currentLang === 'AR'
          ? 'تم حذف المستخدم بنجاح'
          : 'Utilisateur supprimé avec succès !',
        'info',
      );
    }
  };

  // Note: admin profile and brand update handlers were previously defined here but are not currently used in this web navigator.

  // Product Visual visual components
  const ProductVisual = ({
    image,
    className = 'w-16 h-16',
  }: {
    image: string;
    className?: string;
  }) => {
    if (image === 'faucet') return <FaucetSVG className={className} />;
    if (image === 'boiler') return <BoilerSVG className={className} />;
    return <CopperFittingsSVG className={className} />;
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        currentTheme === 'dark'
          ? 'bg-[#0B0F19] text-slate-100'
          : 'bg-slate-50 text-slate-800'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ==========================================
          SPLASH SCREEN
          ========================================== */}
      {showSplash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#0F2942',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
                  transition: 'width 0.15s ease',
                }}
              />
            </div>
          </div>
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">
            {translate('web.autoText30', {
              defaultValue:
                currentLang === 'AR'
                  ? 'جاري تحميل التطبيق الفاخر...'
                  : 'Chargement premium...',
            })}{' '}
            {loadingProgress}%
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
                <span className="text-2xl font-black tracking-tight text-white">
                  {businessName}
                </span>
                <p className="text-[9px] text-[#F97316] font-extrabold tracking-widest uppercase mt-0.5">
                  {translations.FR.tagline}
                </p>
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
                Bénéficiez de dépannages sanitaires immédiats par des plombiers
                agréés et d'un marketplace premium pour acheter des pièces
                détachées d'occasion révisées et garanties.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <div className="text-2xl font-black text-[#F97316]">
                    24h/24
                  </div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase mt-1">
                    Intervention Urgente
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#F97316]">
                    100% testé
                  </div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase mt-1">
                    Garantie Pièces
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-bold relative z-10">
              © 2026 {businessName}. Développé pour les particuliers et
              professionnels.
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
                  {nextLanguage === 'AR'
                    ? 'العربية'
                    : nextLanguage === 'EN'
                    ? 'English'
                    : 'Français'}
                </button>

                {/* Dark Mode toggle icon button */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
                  }
                  className="w-8 h-8 rounded-lg border flex items-center justify-center transition shadow-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                  title={
                    currentTheme === 'light'
                      ? tCommon('web.enableDarkMode', 'Activer Mode Sombre')
                      : tCommon('web.enableLightMode', 'Activer Mode Clair')
                  }
                >
                  {currentTheme === 'light' ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-amber-400"
                    >
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
                  {authTab === 'signin' &&
                    tCommon(
                      'web.signinTitle',
                      translate('web.autoText31', {
                        defaultValue:
                          currentLang === 'AR' ? 'تسجيل الدخول' : 'Connexion',
                      }),
                    )}
                  {authTab === 'signup' &&
                    tCommon(
                      'web.signupTitle',
                      translate('web.autoText32', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'إنشاء حساب جديد'
                            : 'Inscription',
                      }),
                    )}
                  {authTab === 'forgot' &&
                    (currentLang === 'AR'
                      ? 'نسيت كلمة المرور'
                      : 'Mot de passe oublié')}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-semibold">
                  {authTab === 'signin' &&
                    tCommon(
                      'web.signinSubtitle',
                      translate('web.autoText33', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'سجل دخولك للوصول إلى حسابك الفاخر'
                            : 'Connectez-vous pour accéder à votre espace premium.',
                      }),
                    )}
                  {authTab === 'signup' &&
                    tCommon(
                      'web.signupSubtitle',
                      translate('web.autoText34', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'قم بإنشاء حسابك المجاني في ثوانٍ معدودة'
                            : 'Créez votre compte client gratuit en quelques secondes.',
                      }),
                    )}
                  {authTab === 'forgot' &&
                    (currentLang === 'AR'
                      ? 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور.'
                      : 'Entrez votre email pour recevoir les instructions de réinitialisation.')}
                </p>
              </div>

              {/* SIGN IN FORM */}
              {authTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                      {tCommon(
                        'web.emailLabel',
                        translate('web.autoText35', {
                          defaultValue:
                            currentLang === 'AR'
                              ? 'البريد الإلكتروني'
                              : 'Adresse Email',
                        }),
                      )}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="exemple@email.com"
                      value={signinEmail}
                      onChange={e => setSigninEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                      {tCommon(
                        'web.passwordLabel',
                        translate('web.autoText36', {
                          defaultValue:
                            currentLang === 'AR'
                              ? 'كلمة المرور'
                              : 'Mot de Passe',
                        }),
                      )}
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signinPassword}
                      onChange={e => setSigninPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('forgot');
                        setForgotEmail(signinEmail);
                        setForgotStatusMessage(null);
                      }}
                      className="text-[#F97316] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {currentLang === 'AR'
                        ? 'هل نسيت كلمة المرور؟'
                        : 'Forgot Password?'}
                    </button>
                    <span className="text-[10px]">
                      {currentLang === 'AR' ? 'تسجيل آمن' : 'Secure login'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
                  >
                    {tCommon(
                      'web.secureLoginButton',
                      translate('web.autoText37', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'دخول آمن'
                            : 'Connexion Sécurisée',
                      }),
                    )}
                  </button>

                  {/* PRE-FILL BUTTONS */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-6">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-bold mb-2.5">
                      {tCommon(
                        'web.demoAccountsLabel',
                        translate('web.autoText38', {
                          defaultValue:
                            currentLang === 'AR'
                              ? 'حسابات التجربة الفورية'
                              : 'COMPTES DE DÉMO DE PLOMBERIE (ACCÈS DIRECT)',
                        }),
                      )}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSigninEmail('user@demo.com');
                          setSigninPassword('user123');
                          showToast(
                            tCommon(
                              'web.signingIn',
                              translate('web.autoText39', {
                                defaultValue:
                                  currentLang === 'AR'
                                    ? 'جاري تسجيل الدخول...'
                                    : 'Connexion en cours...',
                              }),
                            ),
                            'info',
                          );
                          setTimeout(() => {
                            const userSession: WebSessionUser = {
                              id: 'user-web-demo',
                              name: 'Ahmed Ben Ali',
                              email: 'user@demo.com',
                              role: 'user',
                              phone: '+216 22 456 789',
                              status: 'active',
                              addresses: ['Ariana'],
                              city: 'Ariana',
                            };
                            startWebSession(userSession, 'Accueil');
                            showToast(
                              translate('web.autoText40', {
                                defaultValue:
                                  currentLang === 'AR'
                                    ? 'مرحباً بك أحمد بن علي'
                                    : 'Ravi de vous revoir, Ahmed Ben Ali !',
                              }),
                              'success',
                            );
                          }, 250);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-250 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black py-2.5 rounded-lg transition"
                      >
                        Client (Ahmed Ben Ali)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSigninEmail('admin@demo.com');
                          setSigninPassword('admin123');
                          showToast(
                            tCommon(
                              'web.signingIn',
                              translate('web.autoText41', {
                                defaultValue:
                                  currentLang === 'AR'
                                    ? 'جاري تسجيل الدخول...'
                                    : 'Connexion en cours...',
                              }),
                            ),
                            'info',
                          );
                          setTimeout(() => {
                            const adminSession: WebSessionUser = {
                              id: 'admin-web-demo',
                              name: 'Admin Plombier',
                              email: 'admin@demo.com',
                              role: 'admin',
                              phone: '+216 22 000 111',
                              status: 'active',
                              addresses: ['Tunis'],
                              city: 'Tunis',
                            };
                            startWebSession(adminSession, 'AdminAccueil');
                            showToast(
                              translate('web.autoText42', {
                                defaultValue:
                                  currentLang === 'AR'
                                    ? 'مرحباً بك حضرة المدير'
                                    : "Bienvenue dans votre espace d'administration !",
                              }),
                              'success',
                            );
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
                      {translate('web.autoText43', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'ليس لديك حساب؟'
                            : `Nouveau sur ${businessName} ?`,
                      })}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('signup');
                          setSigninEmail('');
                          setSigninPassword('');
                        }}
                        className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                      >
                        {translate('web.autoText44', {
                          defaultValue:
                            currentLang === 'AR'
                              ? 'أنشئ حساباً جديداً'
                              : 'Créer un compte',
                        })}
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {authTab === 'forgot' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                      {tCommon(
                        'web.emailLabel',
                        translate('web.autoText35', {
                          defaultValue:
                            currentLang === 'AR'
                              ? 'البريد الإلكتروني'
                              : 'Adresse Email',
                        }),
                      )}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="exemple@email.com"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                    />
                  </div>

                  {forgotStatusMessage && (
                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {forgotStatusMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
                  >
                    {currentLang === 'AR'
                      ? 'إرسال رابط إعادة التعيين'
                      : 'Send reset link'}
                  </button>

                  <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signin');
                        setForgotStatusMessage(null);
                      }}
                      className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {currentLang === 'AR'
                        ? 'العودة إلى تسجيل الدخول'
                        : 'Back to sign in'}
                    </button>
                  </div>
                </form>
              )}

              {/* SIGN UP FORM */}
              {authTab === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                      {translate('web.autoText45', {
                        defaultValue:
                          currentLang === 'AR' ? 'الاسم الكامل' : 'Nom Complet',
                      })}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ahmed Ben Salem"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                        {translate('web.autoText46', {
                          defaultValue:
                            currentLang === 'AR'
                              ? 'البريد الإلكتروني'
                              : 'Email',
                        })}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nom@email.tn"
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                        {translate('web.autoText47', {
                          defaultValue:
                            currentLang === 'AR' ? 'الهاتف' : 'Téléphone',
                        })}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+216 22 111 222"
                        value={signupPhone}
                        onChange={e => setSignupPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                      {translate('web.autoText48', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'المدينة / الولاية'
                            : 'Ville / Gouvernorat',
                      })}
                    </label>
                    <select
                      value={signupCity}
                      onChange={e => setSignupCity(e.target.value)}
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
                        {translate('web.autoText49', {
                          defaultValue:
                            currentLang === 'AR'
                              ? 'كلمة المرور'
                              : 'Mot de Passe',
                        })}
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                        {translate('web.autoText50', {
                          defaultValue:
                            currentLang === 'AR'
                              ? 'تأكيد كلمة المرور'
                              : 'Confirmation',
                        })}
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={e => setSignupConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-3.5 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
                  >
                    {translate('web.autoText51', {
                      defaultValue:
                        currentLang === 'AR'
                          ? 'إنشاء حساب جديد'
                          : 'Créer mon compte client',
                    })}
                  </button>

                  {/* LINK TO SIGN IN SCREEN */}
                  <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {translate('web.autoText52', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'لديك حساب بالفعل؟'
                            : 'Déjà inscrit ?',
                      })}{' '}
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
                        {translate('web.autoText53', {
                          defaultValue:
                            currentLang === 'AR'
                              ? 'تسجيل الدخول'
                              : 'Se connecter',
                        })}
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
                    showToast(
                      translate('web.autoText54', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'تصفح بصفتك زائر'
                            : 'Accès Invité autorisé.',
                      }),
                      'info',
                    );
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-850 text-slate-650 hover:text-slate-800 dark:text-slate-350 dark:hover:text-white text-xs font-black py-3.5 rounded-xl transition flex items-center justify-center gap-2 hover:scale-[1.01] transform"
                >
                  <span>
                    {translate('web.autoText55', {
                      defaultValue:
                        currentLang === 'AR'
                          ? 'المواصلة كزائر (مجهول) ←'
                          : "Continuer en tant qu'invité (Anonyme) →",
                    })}
                  </span>
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
        <header
          className={`sticky top-0 z-50 border-b transition-colors backdrop-blur-md ${
            currentTheme === 'dark'
              ? 'bg-[#0F172A]/90 border-slate-800'
              : 'bg-white/95 border-slate-200'
          } shadow-sm`}
        >
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
                <span
                  className={`text-xl font-black tracking-tight ${
                    isRTL ? 'font-arabic font-extrabold' : ''
                  }`}
                >
                  {businessName}
                </span>
                <p className="text-[9px] text-[#F97316] font-bold tracking-widest uppercase mt-0.5 leading-none">
                  {t.tagline}
                </p>
              </div>
            </button>

            {/* Navigation Tabs based on Role */}
            <nav className="hidden lg:flex items-center gap-7 font-black text-xs uppercase tracking-wider">
              {currentRole === 'admin'
                ? // ADMIN PANELS: Accueil | Gestion Annonce | Gestion Catégorie | Galerie | Gestion User | Profil | Analytics
                  [
                    {
                      id: 'AdminAccueil',
                      label: translate('web.autoText56', {
                        defaultValue:
                          currentLang === 'AR' ? 'الرئيسية' : 'Accueil',
                      }),
                    },
                    {
                      id: 'GestionAnnonce',
                      label: translate('web.autoText57', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'إدارة الإعلانات'
                            : 'Gestion Annonce',
                      }),
                    },
                    {
                      id: 'GestionCategorie',
                      label: translate('web.autoText58', {
                        defaultValue:
                          currentLang === 'AR'
                            ? 'إدارة الأصناف'
                            : 'Gestion Catégorie',
                      }),
                    },
                    {
                      id: 'AdminGallery',
                      label:
                        currentLang === 'AR' ? 'المعرض' : galleryManageLabel,
                    },
                    {
                      id: 'AdminServices',
                      label: currentLang === 'AR' ? 'الخدمات' : 'Services',
                    },
                    {
                      id: 'GestionUser',
                      label:
                        currentLang === 'AR'
                          ? 'إدارة المستخدمين'
                          : 'Gestion User',
                    },
                    {
                      id: 'AdminProfile',
                      label: currentLang === 'AR' ? 'ملف الإدارة' : 'Profil',
                    },
                    {
                      id: 'Analytics',
                      label:
                        currentLang === 'AR'
                          ? 'التحليلات الماليّة'
                          : 'Analytics',
                    },
                  ].map(link => (
                    <button
                      key={link.id}
                      onClick={() => setActiveTab(link.id)}
                      className={`transition-colors py-2.5 relative leading-none ${
                        activeTab === link.id
                          ? 'text-[#F97316]'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <span>{link.label}</span>
                      {activeTab === link.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316] rounded-full" />
                      )}
                    </button>
                  ))
                : // USER PANELS: Accueil | Services | Zone d'intervention | Pièces d'occasion | Profil | Paiement
                  [
                    { id: 'Accueil', label: t.accueil },
                    { id: 'Services', label: t.services },
                    { id: 'Zones', label: t.zones },
                    { id: 'Marketplace', label: t.pieces },
                    { id: 'Gallery', label: galleryTitle },
                    { id: 'Profile', label: t.mon_profil },
                  ].map(link => (
                    <button
                      key={link.id}
                      onClick={() => setActiveTab(link.id)}
                      className={`transition-colors py-2.5 relative leading-none ${
                        activeTab === link.id
                          ? 'text-[#F97316]'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <span>{link.label}</span>
                      {activeTab === link.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316] rounded-full" />
                      )}
                    </button>
                  ))}
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
                onClick={() =>
                  setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
                }
                className="w-9 h-9 rounded-lg border flex items-center justify-center bg-slate-50 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
              >
                {currentTheme === 'light' ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-amber-400"
                  >
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
                    {currentLang === 'AR'
                      ? 'تسجيل الدخول'
                      : "Connexion / S'inscrire"}
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
            {currentRole === 'admin'
              ? [
                  {
                    id: 'AdminAccueil',
                    label: currentLang === 'AR' ? 'الرئيسية' : 'Accueil',
                  },
                  {
                    id: 'GestionAnnonce',
                    label: currentLang === 'AR' ? 'الإعلانات' : 'Annonces',
                  },
                  {
                    id: 'GestionCategorie',
                    label: currentLang === 'AR' ? 'الأصناف' : 'Catégories',
                  },
                  {
                    id: 'AdminGallery',
                    label: currentLang === 'AR' ? 'المعرض' : galleryManageLabel,
                  },
                  {
                    id: 'AdminServices',
                    label: currentLang === 'AR' ? 'الخدمات' : 'Services',
                  },
                  {
                    id: 'GestionUser',
                    label: currentLang === 'AR' ? 'المستخدمين' : 'Membres',
                  },
                  {
                    id: 'AdminProfile',
                    label: currentLang === 'AR' ? 'الملف' : 'Profil',
                  },
                  {
                    id: 'Analytics',
                    label: currentLang === 'AR' ? 'التحليلات' : 'Analytics',
                  },
                ].map(link => (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition ${
                      activeTab === link.id
                        ? 'bg-[#F97316] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {link.label}
                  </button>
                ))
              : [
                  { id: 'Accueil', label: t.accueil },
                  { id: 'Services', label: t.services },
                  { id: 'Zones', label: t.zones },
                  { id: 'Marketplace', label: t.pieces },
                  { id: 'Gallery', label: galleryTitle },
                  { id: 'Profile', label: t.mon_profil },
                ].map(link => (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition ${
                      activeTab === link.id
                        ? 'bg-[#F97316] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
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
                      {currentLang === 'AR'
                        ? 'أفضل وأسرع خدمات الترصيص والصيانة في تونس'
                        : 'Vos Urgences Plomberie Réglées en un Record'}
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
                        href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
                          t.whatsapp_msg,
                        )}`}
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
                      {
                        val: `${experienceYears}+`,
                        lbl: t.experience_lbl,
                        color: 'text-[#1E3A5F] dark:text-sky-400',
                      },
                      {
                        val: t.dispo_val,
                        lbl: t.dispo_lbl,
                        color: 'text-[#F97316]',
                      },
                      {
                        val: t.gov_val,
                        lbl: t.gov_lbl,
                        color: 'text-[#1E3A5F] dark:text-sky-400',
                      },
                      {
                        val: t.satisfaction_val,
                        lbl: t.satisfaction_lbl,
                        color: 'text-emerald-500',
                      },
                    ].map((stat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div
                          className={`text-3xl sm:text-4xl font-black tracking-tight ${stat.color}`}
                        >
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
                    {translate('webServices.nos_services')}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
                    {translate('webServices.nos_services_subtitle')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {(
                    [
                      {
                        title: t.plomberie_generale,
                        icon: 'plumbing',
                        desc:
                          currentLang === 'AR'
                            ? 'إصلاح التسربات وتجديد شبكات المياه المنزلية والعمومية.'
                            : 'Recherche de fuites, installations de sanitaires et de chauffe-eau.',
                      },
                      {
                        title: t.climatisation,
                        icon: 'ac',
                        desc:
                          currentLang === 'AR'
                            ? 'تركيب المكيفات، صيانة شاملة وشحن الغاز المعتمد.'
                            : 'Installation de climatiseurs split, recharges de gaz et entretien.',
                      },
                      {
                        title: t.installation_gaz,
                        icon: 'gas',
                        desc:
                          currentLang === 'AR'
                            ? 'تمديد وتوصيل مواسير الغاز المنزلي مع السلامة الكلية.'
                            : 'Tuyauteries de gaz conformes, branchements et détection de fuites.',
                      },
                      {
                        title: t.chauffage_central,
                        icon: 'heater',
                        desc:
                          currentLang === 'AR'
                            ? 'صيانة وضبط المراجل الحرارية والمشعات للتوفير.'
                            : 'Chaudières, détartrages de radiateurs et régulations connectées.',
                      },
                    ] as Array<{
                      title: string;
                      icon: ServiceIconName;
                      desc: string;
                    }>
                  ).map((serv, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab('Services')}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:border-[#F97316] hover:shadow-lg transition-all duration-300 text-left group hover:-translate-y-1 transform focus:outline-none"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20 flex items-center justify-center text-[#1E3A5F] dark:text-sky-400 group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-colors mb-5">
                        <ServiceIcon
                          name={serv.icon}
                          className="w-6 h-6"
                          title={serv.title}
                        />
                      </div>
                      <h3 className="text-base font-black group-hover:text-[#F97316] transition-colors">
                        {serv.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {serv.desc}
                      </p>
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

              {/* Real Photo Gallery Preview */}
              <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
                      Galerie Réalisations
                    </span>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                      {currentLang === 'AR'
                        ? 'صور من عملنا الحقيقي'
                        : 'Nos Réalisations en Images'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 max-w-2xl">
                      {currentLang === 'AR'
                        ? 'استعرض صور المشاريع الحقيقية التي تم تنفيذها بواسطة فريقنا، مع عناوين ووصف موجز لكل عمل.'
                        : 'Découvrez une sélection de projets réels ajoutés par l’administrateur, accompagnés de titres, sous-titres et descriptions.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('Gallery')}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#F97316] bg-transparent px-6 py-3 text-xs font-black uppercase tracking-wider text-[#F97316] shadow-sm transition hover:bg-[#F97316] hover:text-white"
                  >
                    {currentLang === 'AR' ? 'عرض المزيد' : 'Voir la galerie'}
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryItems.slice(0, 3).map(item => (
                    <div
                      key={item.id}
                      className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-sm"
                    >
                      <div className="h-56 overflow-hidden">
                        <img
                          src={item.imageUri}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                          {item.title}
                        </div>
                        {item.subtitle ? (
                          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            {item.subtitle}
                          </div>
                        ) : null}
                        {item.description ? (
                          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {galleryItems.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400">
                      {currentLang === 'AR'
                        ? 'لم يتم إضافة أي صورة بعد. ستظهر هنا الصور الواقعية بمجرد إضافتها من قبل المسؤول.'
                        : 'Aucune photo ajoutée pour le moment. Les réalisations réelles apparaîtront ici dès qu’elles seront publiées par l’administrateur.'}
                    </div>
                  )}
                </div>
              </section>

              {/* Used Parts Showcase Grid */}
              <section className="bg-slate-100 dark:bg-slate-900/60 py-20 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">
                        {t.pieces}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
                        {currentLang === 'AR'
                          ? 'استعرض أحدث قطع الغيار المستعملة المضمونة المتوفرة في الكتالوج لدينا.'
                          : "Équipez-vous au meilleur prix avec nos pièces d'occasion révisées et testées."}
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
                            onClick={e => toggleFavorite(prod.id, e)}
                            className="absolute top-3 left-3 z-10 w-8 h-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill={
                                favorites.includes(prod.id)
                                  ? 'currentColor'
                                  : 'none'
                              }
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className={
                                favorites.includes(prod.id)
                                  ? 'text-rose-500'
                                  : ''
                              }
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>

                          <ProductVisual image={prod.image} />
                        </div>

                        <div className="p-4 text-left flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider">
                              {prod.category}
                            </span>
                            <h4 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-100 mt-1 leading-tight group-hover:text-[#F97316] transition-colors">
                              {prod.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-750 pt-3 mt-4">
                            <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                              {prod.price}{' '}
                              <span className="text-[9px] font-bold">DT</span>
                            </div>

                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedProduct(prod);
                              }}
                              className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg transition"
                            >
                              {currentLang === 'AR'
                                ? 'اتصل لشراء'
                                : 'Commander'}
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
            <ServicesScreen supportWhatsAppDigits={supportWhatsAppDigits} />
          )}

          {/* ------------------------------------------
              USER TAB 3: ZONES D'INTERVENTION (MAP + LEADS FORM)
              ------------------------------------------ */}
          {activeTab === 'Zones' && (
            <ZonesScreen
              currentLang={currentLang}
              t={t}
              supportWhatsAppDigits={supportWhatsAppDigits}
              supportWhatsAppNumber={supportWhatsAppNumber}
            />
          )}

          {/* ------------------------------------------
              USER TAB 4: PIECES D'OCCASION (MARKETPLACE SHOP)
              ------------------------------------------ */}
          {activeTab === 'Marketplace' && (
            <MarketplaceScreen
              currentLang={currentLang}
              t={t}
              setSelectedProduct={setSelectedProduct}
            />
          )}

          {/* ------------------------------------------
              USER TAB : GALERIE D'IMAGES
              ------------------------------------------ */}
          {activeTab === 'Gallery' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <GalleryScreen />
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
                    {currentLang === 'AR'
                      ? 'سجل دخولك لتفعيل حسابك الشخصي'
                      : 'Identification Requise'}
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
                      {currentLang === 'AR'
                        ? 'تسجيل الدخول / إنشاء حساب'
                        : "Accéder à l'écran de connexion"}
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
                  <h1 className="text-3xl font-black tracking-tight">
                    {t.tableau_bord}
                  </h1>
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
                          <h3 className="text-base font-black text-slate-850 dark:text-slate-100">
                            {profileName}
                          </h3>
                          <span className="inline-block mt-1 text-[9px] font-black px-3 py-1 rounded-full uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                            {t.compte_particulier}
                          </span>
                        </div>

                        {/* Profile information */}
                        <div className="border-t border-slate-100 dark:border-slate-700 pt-5 space-y-3.5 text-left font-semibold text-xs text-slate-500 dark:text-slate-450">
                          <div className="space-y-1">
                            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">
                              Email
                            </span>
                            <p className="font-black text-slate-800 dark:text-slate-200">
                              {profileEmail}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">
                              {t.telephone}
                            </span>
                            <p className="font-black text-slate-800 dark:text-slate-200">
                              {profilePhone}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">
                              {t.ville}
                            </span>
                            <p className="font-black text-slate-800 dark:text-slate-200">
                              {profileCity}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Security details updates */}
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-wider">
                          {t.securite}
                        </h3>

                        <form
                          onSubmit={e => {
                            e.preventDefault();
                            if (!currentMdp || !newMdp) return;
                            showToast(
                              currentLang === 'AR'
                                ? 'تم تحديث كلمة المرور بنجاح'
                                : 'Sécurité mise à jour avec succès !',
                              'success',
                            );
                            setCurrentMdp('');
                            setNewMdp('');
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {t.mdp_actuel}
                            </label>
                            <input
                              type="password"
                              required
                              value={currentMdp}
                              onChange={e => setCurrentMdp(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {t.nouveau_mdp}
                            </label>
                            <input
                              type="password"
                              required
                              value={newMdp}
                              onChange={e => setNewMdp(e.target.value)}
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

                      {/* Payment maintenance card (moved into Profile) */}
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                        <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-extrabold text-[9px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                          {t.maintenance}
                        </span>

                        <h3 className="text-lg font-black text-slate-850 dark:text-slate-100">
                          {t.bientot_dispo}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-semibold">
                          {t.maintenance_desc}
                        </p>

                        <div className="space-y-3 pt-4 max-w-full">
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
                            Tests d'homologation de sécurité SSL et cryptage en
                            cours avec la SMT.
                          </p>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4">
                          <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest text-center">
                            {currentLang === 'AR'
                              ? 'أعلمني عند الإطلاق'
                              : "M'avertir lors de la mise en service"}
                          </h4>
                          <form
                            onSubmit={e => {
                              e.preventDefault();
                              if (!newsletterEmail) return;
                              showToast(
                                currentLang === 'AR'
                                  ? 'شكراً ! سيتم إعلامك بالبريد الإلكتروني.'
                                  : 'Merci ! Vous recevrez une alerte prioritaire.',
                                'success',
                              );
                              setNewsletterEmail('');
                            }}
                            className="mt-3 flex gap-2"
                          >
                            <input
                              type="email"
                              required
                              placeholder="votre.email@domaine.tn"
                              value={newsletterEmail}
                              onChange={e => setNewsletterEmail(e.target.value)}
                              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-4 py-3 rounded-xl transition"
                            >
                              {t.avertir}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Right Favorites grid (lg:col-span-8) */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-wider">
                          {t.mes_favoris}
                        </h3>
                        <button
                          onClick={() => setActiveTab('Marketplace')}
                          className="text-xs font-black text-[#F97316] hover:underline"
                        >
                          {t.parcourir_market}
                        </button>
                      </div>

                      {favorites.length === 0 ? (
                        <div className="border border-dashed border-slate-350 dark:border-slate-700 rounded-2xl p-10 text-center space-y-3">
                          <p className="text-xs text-slate-400 font-bold">
                            {t.plus_favoris_desc}
                          </p>
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
                                    onClick={e => toggleFavorite(prod.id, e)}
                                    className="absolute top-2 right-2 w-7.5 h-7.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-rose-500 hover:scale-110 transition"
                                  >
                                    ✕
                                  </button>
                                  <ProductVisual
                                    image={prod.image}
                                    className="w-12 h-12"
                                  />
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
              USER TAB 5.5: LEGAL INFORMATION & POLICY PAGES
              ------------------------------------------ */}
          {activeTab === 'Informations' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm">
                <div className="space-y-4 text-center">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
                    {t.informations}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
                    {t.informations}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    {t.informations_desc}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mt-10">
                  {[
                    {
                      id: 'Politique',
                      label: t.politique,
                      desc: t.privacy_intro,
                    },
                    {
                      id: 'Conditions',
                      label: t.conditions_util,
                      desc: t.terms_intro,
                    },
                    {
                      id: 'PlanSite',
                      label: t.plan_site,
                      desc: t.sitemap_intro,
                    },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="text-left bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 hover:border-[#F97316] transition"
                    >
                      <p className="text-xs uppercase font-black text-[#F97316]">
                        {item.label}
                      </p>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Politique' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
                    {t.politique}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
                    {t.politique}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.privacy_intro}
                  </p>
                </div>

                <ul className="grid gap-4 sm:grid-cols-3">
                  {[
                    t.privacy_point_1,
                    t.privacy_point_2,
                    t.privacy_point_3,
                  ].map((point, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('Informations')}
                    className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3A5F] hover:text-[#F97316] transition"
                  >
                    {t.retour_accueil}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('PlanSite')}
                    className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F] transition"
                  >
                    {t.plan_site}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Conditions' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
                    {t.conditions_util}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
                    {t.conditions_util}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.terms_intro}
                  </p>
                </div>

                <ol className="list-decimal list-inside space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-200 font-semibold">
                  <li>{t.terms_point_1}</li>
                  <li>{t.terms_point_2}</li>
                  <li>{t.terms_point_3}</li>
                </ol>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('Informations')}
                    className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3A5F] hover:text-[#F97316] transition"
                  >
                    {t.retour_accueil}
                  </button>
                  <button
                    onClick={() => setActiveTab('Politique')}
                    className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F] transition"
                  >
                    {t.politique}
                  </button>
                </div>

                {/* category modal removed — forms are inline now */}
              </div>
            </div>
          )}

          {activeTab === 'PlanSite' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
                    {t.plan_site}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
                    {t.plan_site}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.sitemap_intro}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700 dark:text-slate-200 font-semibold">
                  {[
                    { label: t.sitemap_page_accueil, tab: 'Accueil' },
                    { label: t.sitemap_page_services, tab: 'Services' },
                    { label: t.sitemap_page_zones, tab: 'Zones' },
                    { label: t.sitemap_page_pieces, tab: 'Marketplace' },
                    { label: t.sitemap_page_profil, tab: 'Profile' },
                    { label: t.sitemap_page_contact, tab: 'Profile' },
                  ].map((item, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActiveTab(item.tab)}
                      className="text-left rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 hover:border-[#F97316] transition"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('Informations')}
                    className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3A5F] hover:text-[#F97316] transition"
                  >
                    {t.retour_accueil}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Conditions')}
                    className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F] transition"
                  >
                    {t.conditions_util}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment tab removed — functionality folded into Profile maintenance card */}

          {/* ------------------------------------------
              ADMIN TAB 1: ACCUEIL (DASHBOARD METRICS)
              ------------------------------------------ */}
          {activeTab === 'AdminAccueil' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <h1 className="text-3xl font-black tracking-tight text-slate-850 dark:text-white">
                {currentLang === 'AR'
                  ? 'لوحة قيادة المدير'
                  : 'Tableau de Bord Administration'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
                {currentLang === 'AR'
                  ? `إليك مؤشرات النشاط الحالية ومستجدات العمل لـ ${businessName}.`
                  : "Suivez l'état général des stocks de pièces détachées et des membres inscrits."}
              </p>

              {/* Metrics cards row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[
                  {
                    title:
                      currentLang === 'AR'
                        ? 'إجمالي القطع المعروضة'
                        : 'Annonces Actives',
                    val: products.length,
                    desc:
                      currentLang === 'AR'
                        ? 'قطعة غيار مستعملة'
                        : 'Pièces en catalogue',
                    color: 'border-l-4 border-blue-500',
                  },
                  {
                    title:
                      currentLang === 'AR' ? 'الأصناف المتوفرة' : 'Catégories',
                    val: reduxCategories.length,
                    desc:
                      currentLang === 'AR'
                        ? 'صنفاً ديناميكياً'
                        : 'Familles de produits',
                    color: 'border-l-4 border-amber-500',
                  },
                  {
                    title:
                      currentLang === 'AR'
                        ? 'حسابات الأعضاء'
                        : 'Membres Inscrits',
                    val: usersList.length,
                    desc:
                      currentLang === 'AR'
                        ? 'حساباً مسجلاً'
                        : 'Clients enregistrés',
                    color: 'border-l-4 border-emerald-500',
                  },
                  {
                    title:
                      currentLang === 'AR'
                        ? 'طلبات الصيانة الواردة'
                        : 'Urgences Leads',
                    val: 12,
                    desc:
                      currentLang === 'AR'
                        ? 'طلب تدخل سريع'
                        : "Demandes d'interventions",
                    color: 'border-l-4 border-rose-500',
                  },
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className={`bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm ${m.color}`}
                  >
                    <span className="text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest">
                      {m.title}
                    </span>
                    <h3 className="text-3xl font-black text-slate-850 dark:text-white mt-2 leading-none">
                      {m.val}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-2 font-semibold">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Activity Ledgers / System logs */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm mt-10">
                <h3 className="text-base font-black text-slate-850 dark:text-white mb-6">
                  {currentLang === 'AR'
                    ? 'سجل العمليات الأخير للرئيس'
                    : 'Historique Récents des Actions Admin'}
                </h3>

                <div className="space-y-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {[
                    {
                      log:
                        currentLang === 'AR'
                          ? 'قام أحمد بن علي بطلب تدخل سريع بجهة أريانة.'
                          : "Ahmed Ben Ali (user@demo.com) a sollicité une intervention plomberie d'urgence à Ariana.",
                      time: 'Il y a 5 minutes',
                      badge: 'Intervention',
                      color:
                        'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
                    },
                    {
                      log:
                        currentLang === 'AR'
                          ? 'تمت إضافة قطعة غيار جديدة : "مزيج مطبخ غروهي".'
                          : 'Nouvelle pièce ajoutée : Mélangeur Cuisine Grohe dans le catalogue.',
                      time: 'Il y a 20 minutes',
                      badge: 'Catalogue',
                      color:
                        'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
                    },
                    {
                      log:
                        currentLang === 'AR'
                          ? 'تمت إضافة صنف جديد : "مضخات مياه".'
                          : "Catégorie 'Pompes de circulation' créée par Admin.",
                      time: 'Il y a 2 heures',
                      badge: 'Catégorie',
                      color:
                        'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
                    },
                    {
                      log:
                        currentLang === 'AR'
                          ? 'تم تحديث دور المستخدم "user@demo.com" لرتبة عميل.'
                          : 'Statut réactivé pour le client user@demo.com.',
                      time: 'Il y a 1 jour',
                      badge: 'Utilisateur',
                      color:
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
                    },
                  ].map((l, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-750 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            l.badge === 'Intervention'
                              ? 'bg-rose-100 text-rose-600'
                              : l.badge === 'Catalogue'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {l.badge}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200">
                          {l.log}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {l.time}
                      </span>
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
                  <h1 className="text-3xl font-black tracking-tight">
                    {currentLang === 'AR'
                      ? 'إدارة إعلانات قطع الغيار'
                      : 'Gestion des Annonces'}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
                    {currentLang === 'AR'
                      ? 'قم بإضافة، تعديل أو حذف إعلانات قطع الغيار المعروضة في الكتالوج.'
                      : 'Créez de nouvelles fiches produits, modifiez les descriptifs et gérez les disponibilités.'}
                  </p>
                </div>

                <button
                  onClick={openAddAnnonce}
                  className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-md transition"
                >
                  {currentLang === 'AR'
                    ? '+ إضافة إعلان جديد'
                    : '+ Ajouter une annonce'}
                </button>
              </div>

              {/* Listings Admin Table */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-semibold">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400">
                      <tr>
                        <th className="px-6 py-4">
                          {currentLang === 'AR' ? 'القطعة' : 'Pièce'}
                        </th>
                        <th className="px-6 py-4">
                          {currentLang === 'AR' ? 'الصنف' : 'Catégorie'}
                        </th>
                        <th className="px-6 py-4">
                          {currentLang === 'AR' ? 'السعر' : 'Prix'}
                        </th>
                        <th className="px-6 py-4">
                          {currentLang === 'AR' ? 'الحالة' : 'État'}
                        </th>
                        <th className="px-6 py-4">
                          {currentLang === 'AR' ? 'الوضعية' : 'Statut'}
                        </th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-200">
                      {products.map(prod => (
                        <tr
                          key={prod.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition"
                        >
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                              <ProductVisual
                                image={prod.image}
                                className="w-6 h-6"
                              />
                            </div>
                            <div>
                              <div className="font-black text-slate-850 dark:text-slate-100">
                                {prod.title}
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {prod.subtitle}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                            {prod.category}
                          </td>
                          <td className="px-6 py-4 font-black">
                            {prod.price} TND
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-150 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-600 dark:text-slate-350">
                              {prod.condition}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                                prod.isAvailable
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/10'
                                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-500/10'
                              }`}
                            >
                              {prod.isAvailable
                                ? currentLang === 'AR'
                                  ? 'متوفر'
                                  : 'Disponible'
                                : currentLang === 'AR'
                                ? 'مباع'
                                : 'Vendu'}
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
              <h1 className="text-3xl font-black tracking-tight">
                {currentLang === 'AR'
                  ? 'إدارة أصناف المنتجات'
                  : 'Gestion des Catégories'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
                {currentLang === 'AR'
                  ? 'تحكم في القائمة الديناميكية للأصناف المستعملة في الفرز.'
                  : 'Ajoutez de nouvelles familles de produits et réorganisez le catalogue.'}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm mt-8">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    {editingCategory
                      ? currentLang === 'AR'
                        ? 'تعديل الصنف الحالي'
                        : 'Modifier la catégorie'
                      : currentLang === 'AR'
                      ? 'إضافة صنف جديد'
                      : 'Créer une nouvelle catégorie'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xl">
                    {currentLang === 'AR'
                      ? 'استخدم الزر لإضافة صنف جديد عبر نافذة منبثقة. يمكنك تعديل أسماء الأصناف من خلال جدول الأصناف أدناه.'
                      : 'Ajoutez de nouvelles catégories via la fenêtre modale. Vous pouvez renommer les catégories existantes depuis le tableau ci-dessous.'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {editingCategory ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setEditCategoryName('');
                        setNewCategoryImage(null);
                        setCategoryErrorMessage(null);
                      }}
                      className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-250 text-xs font-black px-5 py-3 rounded-xl transition"
                    >
                      {currentLang === 'AR'
                        ? 'إلغاء التعديل'
                        : 'Annuler la modification'}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={openAddCategoryModal}
                    className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
                  >
                    {currentLang === 'AR'
                      ? '+ إضافة صنف جديد'
                      : '+ Ajouter une catégorie'}
                  </button>
                </div>
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
                      const count = products.filter(
                        p => p.category === cat.name,
                      ).length;
                      return (
                        <tr
                          key={cat.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {cat.imageUri ? (
                                <img
                                  src={cat.imageUri}
                                  alt={cat.name}
                                  className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
                              )}
                              <span className="font-black">{cat.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                            {count} articles
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openEditCategoryModal(cat)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 py-1 rounded-lg transition"
                              >
                                {currentLang === 'AR'
                                  ? 'تعديل الاسم'
                                  : 'Renommer'}
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCategory(cat.id, cat.name)
                                }
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
              ADMIN TAB : GALERIE (EDITOR)
              ------------------------------------------ */}
          {activeTab === 'AdminGallery' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <AdminGalleryEditor />
            </div>
          )}

          {activeTab === 'AdminServices' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <AdminServicesEditor />
            </div>
          )}

          {/* ------------------------------------------
              ADMIN TAB 4: GESTION USER (MEMBERS & STATUS TOGGLES)
              ------------------------------------------ */}
          {activeTab === 'GestionUser' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <h1 className="text-3xl font-black tracking-tight">
                {currentLang === 'AR'
                  ? 'إدارة حسابات المستخدمين'
                  : 'Gestion des Comptes Membres'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
                {currentLang === 'AR'
                  ? 'استعرض الأعضاء المسجلين وقم بترقية أدوارهم أو تجميد حساباتهم.'
                  : 'Visualisez la liste des inscrits, modifiez les rôles ou désactivez temporairement des accès.'}
              </p>

              {editingUser && (
                <div className="mt-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-xl font-black">
                        {currentLang === 'AR'
                          ? 'تعديل المستخدم'
                          : 'Modifier un utilisateur'}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        {currentLang === 'AR'
                          ? 'قم بتعديل بيانات هذا المستخدم ثم احفظ التغييرات.'
                          : 'Mettez à jour les informations utilisateur puis enregistrez.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelEditUser}
                      className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      {currentLang === 'AR' ? 'إلغاء' : 'Annuler'}
                    </button>
                  </div>

                  <form
                    onSubmit={handleSaveUserEdit}
                    className="grid gap-4 mt-6 md:grid-cols-2"
                  >
                    <input
                      value={editUserName}
                      onChange={e => setEditUserName(e.target.value)}
                      placeholder={
                        currentLang === 'AR' ? 'الاسم الكامل' : 'Nom complet'
                      }
                      required
                      className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    />
                    <input
                      type="email"
                      value={editUserEmail}
                      onChange={e => setEditUserEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    />
                    <input
                      value={editUserPhone}
                      onChange={e => setEditUserPhone(e.target.value)}
                      placeholder={
                        currentLang === 'AR' ? 'الهاتف' : 'Téléphone'
                      }
                      className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    />
                    <select
                      value={editUserRole}
                      onChange={e =>
                        setEditUserRole(e.target.value as 'admin' | 'user')
                      }
                      className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                    <div className="md:col-span-2 flex justify-end gap-3">
                      <button
                        type="submit"
                        className="bg-[#F97316] text-white px-6 py-3 rounded-3xl font-black hover:bg-[#e0630b] transition"
                      >
                        {currentLang === 'AR' ? 'حفظ التغييرات' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

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
                        <tr
                          key={u.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition"
                        >
                          <td className="px-6 py-4 font-black">{u.name}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                            {u.email}
                          </td>
                          <td className="px-6 py-4">{u.phone || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded text-[9.5px] font-black uppercase ${
                                u.role === 'admin'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                                u.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-rose-50 text-rose-600'
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-wrap justify-center gap-2">
                              <button
                                onClick={() => handleStartEditUser(u)}
                                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-white px-2.5 py-1 rounded transition"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.role)}
                                disabled={u.role === 'admin'}
                                className={`px-2.5 py-1 rounded font-black transition ${
                                  u.role === 'admin'
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                                }`}
                              >
                                {u.role === 'admin'
                                  ? currentLang === 'AR'
                                    ? 'محمي'
                                    : 'Admin protégé'
                                  : currentLang === 'AR'
                                  ? 'حذف'
                                  : 'Supprimer'}
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleUserRole(u.id, u.role)
                                }
                                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-white px-2.5 py-1 rounded transition"
                              >
                                {u.role === 'admin'
                                  ? 'Rétrograder'
                                  : 'Promouvoir'}
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleUserStatus(u.id, u.status)
                                }
                                className={`px-2.5 py-1 rounded text-white transition font-black ${
                                  u.status === 'active'
                                    ? 'bg-rose-600 hover:bg-rose-700'
                                    : 'bg-emerald-600 hover:bg-emerald-700'
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
            <AdminProfileScreen currentLang={currentLang} t={tCommon} />
          )}

          {/* ------------------------------------------
              ADMIN TAB 6: ANALYTICS (styled premium graphics)
              ------------------------------------------ */}
          {activeTab === 'Analytics' && (
            <AdminAnalyticsScreen currentLang={currentLang} t={t} />
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
                <ProductVisual
                  image={selectedProduct.image}
                  className="w-24 h-24"
                />
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 mt-1">
                      {selectedProduct.title}
                    </h2>
                    <p className="text-xs text-slate-450 mt-1 leading-relaxed font-semibold">
                      {selectedProduct.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {selectedProduct.description}
                  </p>

                  <div className="text-xl font-black text-[#F97316]">
                    {selectedProduct.price}{' '}
                    <span className="text-sm font-bold">DT</span>
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
                      `Bonjour, je suis intéressé par l'achat de la pièce d'occasion : ${selectedProduct.title} - ${selectedProduct.price} DT.`,
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
                {editingProduct
                  ? currentLang === 'AR'
                    ? 'تعديل بيانات الإعلان'
                    : "Modifier l'annonce"
                  : currentLang === 'AR'
                  ? 'إضافة إعلان جديد'
                  : 'Créer une annonce'}
              </h2>

              <form
                onSubmit={handleSaveAnnonce}
                className="space-y-4 text-xs font-semibold"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mitigeur évier"
                      value={annonceTitle}
                      onChange={e => setAnnonceTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Sous-Titre / Marque
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: GROHE chromé"
                      value={annonceSubtitle}
                      onChange={e => setAnnonceSubtitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Catégorie
                    </label>
                    <select
                      value={annonceCategory}
                      onChange={e => setAnnonceCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                    >
                      {reduxCategories.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Prix (TND) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={annoncePrice}
                      onChange={e => setAnnoncePrice(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      État
                    </label>
                    <select
                      value={annonceCondition}
                      onChange={e => setAnnonceCondition(e.target.value as any)}
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
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Représentation Visuelle
                    </label>
                    <select
                      value={annonceImage}
                      onChange={e => setAnnonceImage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                    >
                      <option value="faucet">
                        Haut-de-gamme Robinet (Faucet)
                      </option>
                      <option value="boiler">
                        Chauffe-eau / Chaudière (Boiler)
                      </option>
                      <option value="copper_fittings">
                        Canalisation / Raccords (Pipes)
                      </option>
                    </select>
                  </div>

                  <div className="flex gap-4 items-center justify-around h-full pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-750 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={annonceIsFeatured}
                        onChange={e => setAnnonceIsFeatured(e.target.checked)}
                        className="accent-[#F97316] w-4.5 h-4.5"
                      />
                      <span>En Vedette</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-750 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={annonceIsAvailable}
                        onChange={e => setAnnonceIsAvailable(e.target.checked)}
                        className="accent-[#F97316] w-4.5 h-4.5"
                      />
                      <span>Disponible</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    Description technique *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Détails du produit..."
                    value={annonceDescription}
                    onChange={e => setAnnonceDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-md uppercase tracking-wider"
                >
                  {currentLang === 'AR'
                    ? 'حفظ الإعلان'
                    : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-lg w-full shadow-2xl overflow-hidden relative">
            <button
              onClick={closeCategoryModal}
              className="absolute top-4 right-4 z-10 w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-500 hover:text-slate-850 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-slate-850 dark:text-white">
                {editingCategory
                  ? currentLang === 'AR'
                    ? 'تعديل الصنف'
                    : 'Modifier la catégorie'
                  : currentLang === 'AR'
                  ? 'إضافة صنف جديد'
                  : 'Ajouter une catégorie'}
              </h2>

              {categoryErrorMessage && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {categoryErrorMessage}
                </div>
              )}

              <form
                onSubmit={handleSaveCategory}
                className="space-y-4 text-xs font-semibold"
              >
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    {currentLang === 'AR' ? 'اسم الصنف' : 'Nom de la catégorie'}{' '}
                    *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      currentLang === 'AR'
                        ? 'مثال: مضخات مياه'
                        : 'Ex: Pompes et Accessoires'
                    }
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    {currentLang === 'AR'
                      ? 'صورة الصنف (اختياري)'
                      : 'Image de catégorie (optionnel)'}
                  </label>
                  <CategoryImageInput
                    imageUri={newCategoryImage || undefined}
                    onImageSelected={setNewCategoryImage}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeCategoryModal}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-250 text-xs font-black px-5 py-3 rounded-xl transition"
                  >
                    {currentLang === 'AR' ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
                  >
                    {editingCategory
                      ? currentLang === 'AR'
                        ? 'حفظ التعديل'
                        : 'Enregistrer'
                      : currentLang === 'AR'
                      ? 'إضافة'
                      : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          COMMON SITE FOOTER
          ========================================== */}
      {(bypassAuth || sessionUser) && (
        <footer
          className={`border-t transition-colors ${
            currentTheme === 'dark'
              ? 'bg-[#0B0F19] border-slate-800 text-slate-400'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          } py-12`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div className="space-y-4">
              <span className="text-lg font-black text-slate-850 dark:text-slate-105 flex items-center gap-2">
                🛠️ {businessName}
              </span>
              <p className="text-xs leading-relaxed font-semibold">
                {t.foot_desc}
              </p>
            </div>

            <FooterLinks
              setActiveTab={setActiveTab}
              currentRole={currentRole}
              supportWhatsAppDigits={supportWhatsAppDigits}
              supportWhatsAppNumber={supportWhatsAppNumber}
              supportEmail={supportEmail}
            />
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
          href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
            t.whatsapp_msg,
          )}`}
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
