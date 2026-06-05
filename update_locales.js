const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const locales = ['ar.json', 'fr.json', 'en.json', 'de.json', 'es.json', 'hi.json', 'it.json', 'tr.json', 'zh.json'];

const adminKeys = {
  "en": {
    "servicesInterventionsDesc": "Intervention services",
    "galleryPhotosDesc": "Photos of completed work",
    "manageProductsDesc": "Create new product listings and manage availability.",
    "manageCategoriesDesc": "Organize your product families and spare parts.",
    "manageServicesLabel": "Manage Services",
    "manageServicesDesc": "Edit offered services and before/after illustrations.",
    "manageUsersDesc": "Manage member accounts, update roles and permissions.",
    "manageGalleryLabel": "Manage Gallery",
    "manageGalleryDesc": "Add, edit or delete photos from the gallery.",
    "adminProfileDesc": "Configure the site name, WhatsApp contact and security.",
    "globalAnalyticsDesc": "View visit charts, engagement rates and shares."
  },
  "fr": {
    "servicesInterventionsDesc": "Services d'intervention",
    "galleryPhotosDesc": "Photos de réalisations",
    "manageProductsDesc": "Créez de nouvelles fiches produits et gérez les disponibilités.",
    "manageCategoriesDesc": "Organisez vos familles de produits et pièces.",
    "manageServicesLabel": "Gérer les Services",
    "manageServicesDesc": "Modifiez les services proposés et les illustrations avant/après.",
    "manageUsersDesc": "Gérez les comptes membres, mettez à jour les rôles et permissions.",
    "manageGalleryLabel": "Gérer la Galerie",
    "manageGalleryDesc": "Ajoutez, modifiez ou supprimez des photos de réalisations.",
    "adminProfileDesc": "Configurez le nom du site, contact WhatsApp et sécurité.",
    "globalAnalyticsDesc": "Visualisez les graphiques de visites, taux d'engagement et partages."
  },
  "ar": {
    "servicesInterventionsDesc": "خدمات التدخل",
    "galleryPhotosDesc": "صور الإنجازات",
    "manageProductsDesc": "إنشاء قوائم منتجات جديدة وإدارة التوافر.",
    "manageCategoriesDesc": "تنظيم عائلات المنتجات وقطع الغيار.",
    "manageServicesLabel": "إدارة الخدمات",
    "manageServicesDesc": "تعديل الخدمات المقدمة وصور قبل/بعد.",
    "manageUsersDesc": "إدارة حسابات الأعضاء، تحديث الأدوار والصلاحيات.",
    "manageGalleryLabel": "إدارة المعرض",
    "manageGalleryDesc": "إضافة، تعديل أو حذف صور من المعرض.",
    "adminProfileDesc": "تكوين اسم الموقع، جهة اتصال واتساب والأمان.",
    "globalAnalyticsDesc": "عرض مخططات الزيارات، معدلات المشاركة والمشاركات."
  },
  "de": {
    "servicesInterventionsDesc": "Interventionsdienste",
    "galleryPhotosDesc": "Fotos der abgeschlossenen Arbeiten",
    "manageProductsDesc": "Erstellen Sie neue Produkteinträge und verwalten Sie die Verfügbarkeit.",
    "manageCategoriesDesc": "Organisieren Sie Ihre Produktfamilien und Ersatzteile.",
    "manageServicesLabel": "Dienste verwalten",
    "manageServicesDesc": "Bearbeiten Sie angebotene Dienste und Vorher/Nachher-Illustrationen.",
    "manageUsersDesc": "Mitgliedskonten verwalten, Rollen und Berechtigungen aktualisieren.",
    "manageGalleryLabel": "Galerie verwalten",
    "manageGalleryDesc": "Fotos aus der Galerie hinzufügen, bearbeiten oder löschen.",
    "adminProfileDesc": "Konfigurieren Sie den Website-Namen, WhatsApp-Kontakt und Sicherheit.",
    "globalAnalyticsDesc": "Besuchsdiagramme, Engagement-Raten und Freigaben anzeigen."
  },
  "es": {
    "servicesInterventionsDesc": "Servicios de intervención",
    "galleryPhotosDesc": "Fotos de trabajos completados",
    "manageProductsDesc": "Crear nuevos listados de productos y gestionar la disponibilidad.",
    "manageCategoriesDesc": "Organizar sus familias de productos y repuestos.",
    "manageServicesLabel": "Gestionar Servicios",
    "manageServicesDesc": "Editar los servicios ofrecidos e ilustraciones de antes/después.",
    "manageUsersDesc": "Gestionar cuentas de miembros, actualizar roles y permisos.",
    "manageGalleryLabel": "Gestionar Galería",
    "manageGalleryDesc": "Añadir, editar o eliminar fotos de la galería.",
    "adminProfileDesc": "Configurar el nombre del sitio, contacto de WhatsApp y seguridad.",
    "globalAnalyticsDesc": "Ver gráficos de visitas, tasas de participación y compartidos."
  },
  "hi": {
    "servicesInterventionsDesc": "हस्तक्षेप सेवाएँ",
    "galleryPhotosDesc": "पूरे किए गए काम की तस्वीरें",
    "manageProductsDesc": "नई उत्पाद सूची बनाएँ और उपलब्धता प्रबंधित करें।",
    "manageCategoriesDesc": "अपने उत्पाद परिवारों और स्पेयर पार्ट्स को व्यवस्थित करें।",
    "manageServicesLabel": "सेवाएँ प्रबंधित करें",
    "manageServicesDesc": "प्रस्तावित सेवाओं और पहले/बाद के चित्रों को संपादित करें।",
    "manageUsersDesc": "सदस्य खातों का प्रबंधन करें, भूमिकाएँ और अनुमतियाँ अपडेट करें।",
    "manageGalleryLabel": "गैलरी प्रबंधित करें",
    "manageGalleryDesc": "गैलरी से तस्वीरें जोड़ें, संपादित करें या हटाएँ।",
    "adminProfileDesc": "साइट का नाम, व्हाट्सएप संपर्क और सुरक्षा कॉन्फ़िगर करें।",
    "globalAnalyticsDesc": "विज़िट चार्ट, सहभागिता दरें और शेयर देखें।"
  },
  "it": {
    "servicesInterventionsDesc": "Servizi di intervento",
    "galleryPhotosDesc": "Foto dei lavori completati",
    "manageProductsDesc": "Crea nuovi annunci di prodotti e gestisci la disponibilità.",
    "manageCategoriesDesc": "Organizza le tue famiglie di prodotti e pezzi di ricambio.",
    "manageServicesLabel": "Gestisci Servizi",
    "manageServicesDesc": "Modifica i servizi offerti e le illustrazioni prima/dopo.",
    "manageUsersDesc": "Gestisci gli account dei membri, aggiorna ruoli e permessi.",
    "manageGalleryLabel": "Gestisci Galleria",
    "manageGalleryDesc": "Aggiungi, modifica o elimina foto dalla galleria.",
    "adminProfileDesc": "Configura il nome del sito, il contatto WhatsApp e la sicurezza.",
    "globalAnalyticsDesc": "Visualizza i grafici delle visite, i tassi di coinvolgimento e le condivisioni."
  },
  "tr": {
    "servicesInterventionsDesc": "Müdahale hizmetleri",
    "galleryPhotosDesc": "Tamamlanan işlerin fotoğrafları",
    "manageProductsDesc": "Yeni ürün listeleri oluşturun ve stok durumunu yönetin.",
    "manageCategoriesDesc": "Ürün ailelerinizi ve yedek parçalarınızı düzenleyin.",
    "manageServicesLabel": "Hizmetleri Yönet",
    "manageServicesDesc": "Sunulan hizmetleri ve öncesi/sonrası resimlerini düzenleyin.",
    "manageUsersDesc": "Üye hesaplarını yönetin, rolleri ve izinleri güncelleyin.",
    "manageGalleryLabel": "Galeriyi Yönet",
    "manageGalleryDesc": "Galeriden fotoğraf ekleyin, düzenleyin veya silin.",
    "adminProfileDesc": "Site adını, WhatsApp iletişim bilgisini ve güvenliği yapılandırın.",
    "globalAnalyticsDesc": "Ziyaret grafiklerini, etkileşim oranlarını ve paylaşımları görüntüleyin."
  },
  "zh": {
    "servicesInterventionsDesc": "干预服务",
    "galleryPhotosDesc": "已完成工作的照片",
    "manageProductsDesc": "创建新的产品列表并管理可用性。",
    "manageCategoriesDesc": "组织您的产品系列和备件。",
    "manageServicesLabel": "管理服务",
    "manageServicesDesc": "编辑提供的服务和前后对比图。",
    "manageUsersDesc": "管理会员帐户，更新角色和权限。",
    "manageGalleryLabel": "管理图库",
    "manageGalleryDesc": "添加，编辑或删除图库中的照片。",
    "adminProfileDesc": "配置网站名称，WhatsApp联系人和安全性。",
    "globalAnalyticsDesc": "查看访问图表，参与率和共享。"
  }
};

const profileKeys = {
  "en": {
    "verifiedWallet": "Verified Wallet",
    "display": "Display",
    "language": "Language",
    "currency": "Currency",
    "hideBalances": "Hide Balances",
    "budgetAlerts": "Budget & Alerts",
    "monthlyBudget": "Monthly Budget",
    "notifications": "Notifications",
    "shortcuts": "Shortcuts",
    "data": "Data",
    "exportCsv": "Export CSV",
    "resetTitle": "Reset?",
    "resetMessage": "This cannot be undone",
    "resetConfirm": "Reset",
    "resetAllData": "Reset All Data",
    "signOut": "Sign Out"
  },
  "fr": {
    "verifiedWallet": "Portefeuille vérifié",
    "display": "Affichage",
    "language": "Langue",
    "currency": "Devise",
    "hideBalances": "Masquer les soldes",
    "budgetAlerts": "Budget & Alertes",
    "monthlyBudget": "Budget mensuel",
    "notifications": "Notifications",
    "shortcuts": "Raccourcis",
    "data": "Données",
    "exportCsv": "Exporter CSV",
    "resetTitle": "Réinitialiser ?",
    "resetMessage": "Cette action est irréversible",
    "resetConfirm": "Réinitialiser",
    "resetAllData": "Supprimer toutes les données",
    "signOut": "Se déconnecter"
  },
  "ar": {
    "verifiedWallet": "محفظة تم التحقق منها",
    "display": "العرض",
    "language": "اللغة",
    "currency": "العملة",
    "hideBalances": "إخفاء الأرصدة",
    "budgetAlerts": "الميزانية والتنبيهات",
    "monthlyBudget": "الميزانية الشهرية",
    "notifications": "الإشعارات",
    "shortcuts": "الاختصارات",
    "data": "البيانات",
    "exportCsv": "تصدير CSV",
    "resetTitle": "إعادة تعيين؟",
    "resetMessage": "لا يمكن التراجع عن هذا",
    "resetConfirm": "إعادة تعيين",
    "resetAllData": "إعادة تعيين جميع البيانات",
    "signOut": "تسجيل الخروج"
  },
  "de": {
    "verifiedWallet": "Verifizierte Brieftasche",
    "display": "Anzeige",
    "language": "Sprache",
    "currency": "Währung",
    "hideBalances": "Guthaben ausblenden",
    "budgetAlerts": "Budget & Benachrichtigungen",
    "monthlyBudget": "Monatliches Budget",
    "notifications": "Benachrichtigungen",
    "shortcuts": "Verknüpfungen",
    "data": "Daten",
    "exportCsv": "CSV exportieren",
    "resetTitle": "Zurücksetzen?",
    "resetMessage": "Dies kann nicht rückgängig gemacht werden",
    "resetConfirm": "Zurücksetzen",
    "resetAllData": "Alle Daten zurücksetzen",
    "signOut": "Abmelden"
  },
  "es": {
    "verifiedWallet": "Billetera verificada",
    "display": "Pantalla",
    "language": "Idioma",
    "currency": "Moneda",
    "hideBalances": "Ocultar saldos",
    "budgetAlerts": "Presupuesto y Alertas",
    "monthlyBudget": "Presupuesto mensual",
    "notifications": "Notificaciones",
    "shortcuts": "Atajos",
    "data": "Datos",
    "exportCsv": "Exportar CSV",
    "resetTitle": "¿Reiniciar?",
    "resetMessage": "Esto no se puede deshacer",
    "resetConfirm": "Reiniciar",
    "resetAllData": "Restablecer todos los datos",
    "signOut": "Cerrar sesión"
  },
  "hi": {
    "verifiedWallet": "सत्यापित वॉलेट",
    "display": "प्रदर्शन",
    "language": "भाषा",
    "currency": "मुद्रा",
    "hideBalances": "शेष छिपाएं",
    "budgetAlerts": "बजट और अलर्ट",
    "monthlyBudget": "मासिक बजट",
    "notifications": "सूचनाएं",
    "shortcuts": "शॉर्टकट",
    "data": "डेटा",
    "exportCsv": "CSV निर्यात करें",
    "resetTitle": "रीसेट करें?",
    "resetMessage": "इसे पूर्ववत नहीं किया जा सकता",
    "resetConfirm": "रीसेट",
    "resetAllData": "सभी डेटा रीसेट करें",
    "signOut": "साइन आउट"
  },
  "it": {
    "verifiedWallet": "Portafoglio verificato",
    "display": "Display",
    "language": "Lingua",
    "currency": "Valuta",
    "hideBalances": "Nascondi saldi",
    "budgetAlerts": "Budget e Avvisi",
    "monthlyBudget": "Budget mensile",
    "notifications": "Notifiche",
    "shortcuts": "Scorciatoie",
    "data": "Dati",
    "exportCsv": "Esporta CSV",
    "resetTitle": "Ripristinare?",
    "resetMessage": "Questa operazione non può essere annullata",
    "resetConfirm": "Ripristina",
    "resetAllData": "Ripristina tutti i dati",
    "signOut": "Disconnettiti"
  },
  "tr": {
    "verifiedWallet": "Doğrulanmış Cüzdan",
    "display": "Görünüm",
    "language": "Dil",
    "currency": "Para Birimi",
    "hideBalances": "Bakiyeleri Gizle",
    "budgetAlerts": "Bütçe ve Uyarılar",
    "monthlyBudget": "Aylık Bütçe",
    "notifications": "Bildirimler",
    "shortcuts": "Kısayollar",
    "data": "Veri",
    "exportCsv": "CSV'yi Dışa Aktar",
    "resetTitle": "Sıfırla?",
    "resetMessage": "Bu işlem geri alınamaz",
    "resetConfirm": "Sıfırla",
    "resetAllData": "Tüm Verileri Sıfırla",
    "signOut": "Çıkış Yap"
  },
  "zh": {
    "verifiedWallet": "已验证的钱包",
    "display": "显示",
    "language": "语言",
    "currency": "货币",
    "hideBalances": "隐藏余额",
    "budgetAlerts": "预算与提醒",
    "monthlyBudget": "每月预算",
    "notifications": "通知",
    "shortcuts": "快捷方式",
    "data": "数据",
    "exportCsv": "导出 CSV",
    "resetTitle": "重置？",
    "resetMessage": "此操作无法撤消",
    "resetConfirm": "重置",
    "resetAllData": "重置所有数据",
    "signOut": "退出登录"
  }
};

const sslTexts = {
  "en": "SSL security approval tests and encryption in progress with the SMT.",
  "fr": "Tests d'homologation de sécurité SSL et cryptage en cours avec la SMT.",
  "ar": "تجري حاليًا اختبارات الموافقة الأمنية لـ SSL والتشفير مع SMT.",
  "de": "SSL-Sicherheitszulassungstests und Verschlüsselung mit der SMT im Gange.",
  "es": "Pruebas de aprobación de seguridad SSL y cifrado en progreso con la SMT.",
  "hi": "SMT के साथ SSL सुरक्षा अनुमोदन परीक्षण और एन्क्रिप्शन प्रगति पर है।",
  "it": "Test di approvazione della sicurezza SSL e crittografia in corso con la SMT.",
  "tr": "SMT ile SSL güvenlik onay testleri ve şifreleme devam ediyor.",
  "zh": "与 SMT 正在进行 SSL 安全批准测试和加密。"
};

locales.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add admin keys
    if (adminKeys[lang]) {
      Object.assign(data, adminKeys[lang]);
    }
    
    // Add profile keys
    if (profileKeys[lang]) {
      data.profile = data.profile || {};
      Object.assign(data.profile, profileKeys[lang]);
    }
    
    // Add sslTestsInProgress
    if (sslTexts[lang]) {
      data.web = data.web || {};
      data.web.sslTestsInProgress = sslTexts[lang];
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});

