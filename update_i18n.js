const path = require('path');
const fs = require('fs');

const locales = ['ar', 'fr', 'en', 'es', 'de'];

const data = {
  ar: {
    web: {
      zones_directes: "مناطق التدخل المباشرة",
      zone_map_instructions: "انقر على منطقة لمزيد من التفاصيل",
      zone_grand_tunis_info: "تدخل سريع في تونس الكبرى",
      zone_sahel_info: "تدخل سريع في الساحل",
      zone_other_info: "التدخل متاح",
      request_name_phone_required: "الاسم ورقم الهاتف مطلوبان",
      request_submitted: "تم إرسال الطلب بنجاح"
    },
    zones: {
      zones: "المناطق المغطاة",
      zone_tagline: "نحن نتدخل بسرعة في هذه المناطق.",
      carte_interactive: "خريطة تفاعلية",
      villes_couvertes: "المدن المغطاة",
      whatsapp_msg: "مرحبًا، أحتاج إلى تدخل عاجل.",
      appeler_whatsapp: "اتصل عبر واتساب",
      urgentCoverageText: "المناطق الملونة مغطاة في أقل من 30 دقيقة.",
      ouvrir_maps: "فتح في خرائط جوجل",
      urgentStatusBadge: "تدخل عاجل",
      demande_intervention: "طلب تدخل",
      nom_complet: "الاسم الكامل",
      telephone: "رقم الهاتف",
      ville: "المدينة",
      envoyer_demande: "إرسال الطلب",
      intervention_express: "تدخل سريع",
      fermer: "إغلاق",
      type_probleme: "نوع المشكلة",
      prob_fuite: "تسرب مياه / أنبوب مكسور",
      prob_chauffe_eau: "عطل سخان المياه",
      prob_climatiseur: "مشكلة في المكيف",
      prob_gaz: "أنابيب الغاز / أمان",
      description: "الوصف",
      desc_placeholder: "حدد عنوانك، الطابق، أو المشكلة...",
      nom_placeholder: "مثال: محمد بن خذر"
    }
  },
  fr: {
    web: {
      zones_directes: "Zones d'intervention directes",
      zone_map_instructions: "Cliquez sur une zone pour plus de détails",
      zone_grand_tunis_info: "Intervention rapide dans le Grand Tunis",
      zone_sahel_info: "Intervention rapide au Sahel",
      zone_other_info: "Intervention disponible",
      request_name_phone_required: "Nom et téléphone requis",
      request_submitted: "Demande envoyée avec succès"
    },
    zones: {
      zones: "Zones Couvertes",
      zone_tagline: "Nous intervenons rapidement dans ces régions.",
      carte_interactive: "Carte Interactive",
      villes_couvertes: "Villes Couvertes",
      whatsapp_msg: "Bonjour, j'ai besoin d'une intervention urgente.",
      appeler_whatsapp: "Contacter WhatsApp",
      urgentCoverageText: "Les zones colorées sont couvertes en moins de 30 minutes.",
      ouvrir_maps: "Ouvrir dans Google Maps",
      urgentStatusBadge: "Intervention Urgente",
      demande_intervention: "Demande d'intervention",
      nom_complet: "Nom Complet",
      telephone: "Téléphone",
      ville: "Ville",
      envoyer_demande: "Envoyer la demande",
      intervention_express: "Intervention Express",
      fermer: "Fermer",
      type_probleme: "Type Problème",
      prob_fuite: "Fuite d'eau / Tuyau cassé",
      prob_chauffe_eau: "Panne Chauffe-eau",
      prob_climatiseur: "Problème Climatiseur",
      prob_gaz: "Tuyauterie Gaz / Sécurité",
      description: "Description",
      desc_placeholder: "Précisez votre adresse, étage, ou problème...",
      nom_placeholder: "Ex: Mohamed Ben Khedher"
    }
  },
  en: {
    web: {
      zones_directes: "Direct Intervention Zones",
      zone_map_instructions: "Click on an area for more details",
      zone_grand_tunis_info: "Quick intervention in Greater Tunis",
      zone_sahel_info: "Quick intervention in Sahel",
      zone_other_info: "Intervention available",
      request_name_phone_required: "Name and phone required",
      request_submitted: "Request submitted successfully"
    },
    zones: {
      zones: "Covered Zones",
      zone_tagline: "We intervene quickly in these regions.",
      carte_interactive: "Interactive Map",
      villes_couvertes: "Covered Cities",
      whatsapp_msg: "Hello, I need an urgent intervention.",
      appeler_whatsapp: "Contact WhatsApp",
      urgentCoverageText: "Colored zones are covered in less than 30 minutes.",
      ouvrir_maps: "Open in Google Maps",
      urgentStatusBadge: "Urgent Intervention",
      demande_intervention: "Intervention Request",
      nom_complet: "Full Name",
      telephone: "Phone",
      ville: "City",
      envoyer_demande: "Send Request",
      intervention_express: "Express Intervention",
      fermer: "Close",
      type_probleme: "Problem Type",
      prob_fuite: "Water Leak / Broken Pipe",
      prob_chauffe_eau: "Water Heater Breakdown",
      prob_climatiseur: "AC Problem",
      prob_gaz: "Gas Piping / Security",
      description: "Description",
      desc_placeholder: "Specify your address, floor, or problem...",
      nom_placeholder: "Ex: John Doe"
    }
  },
  es: {
    web: {
      zones_directes: "Zonas de Intervención Directa",
      zone_map_instructions: "Haz clic en una zona para más detalles",
      zone_grand_tunis_info: "Intervención rápida en el Gran Túnez",
      zone_sahel_info: "Intervención rápida en Sahel",
      zone_other_info: "Intervención disponible",
      request_name_phone_required: "Nombre y teléfono requeridos",
      request_submitted: "Solicitud enviada con éxito"
    },
    zones: {
      zones: "Zonas Cubiertas",
      zone_tagline: "Intervenimos rápidamente en estas regiones.",
      carte_interactive: "Mapa Interactivo",
      villes_couvertes: "Ciudades Cubiertas",
      whatsapp_msg: "Hola, necesito una intervención urgente.",
      appeler_whatsapp: "Contactar WhatsApp",
      urgentCoverageText: "Las zonas coloreadas están cubiertas en menos de 30 minutos.",
      ouvrir_maps: "Abrir en Google Maps",
      urgentStatusBadge: "Intervención Urgente",
      demande_intervention: "Solicitud de Intervención",
      nom_complet: "Nombre Completo",
      telephone: "Teléfono",
      ville: "Ciudad",
      envoyer_demande: "Enviar Solicitud",
      intervention_express: "Intervención Exprés",
      fermer: "Cerrar",
      type_probleme: "Tipo de Problema",
      prob_fuite: "Fuga de Agua / Tubería Rota",
      prob_chauffe_eau: "Avería del Calentador",
      prob_climatiseur: "Problema de Aire Acondicionado",
      prob_gaz: "Tubería de Gas / Seguridad",
      description: "Descripción",
      desc_placeholder: "Especifica tu dirección, piso o problema...",
      nom_placeholder: "Ej: Juan Pérez"
    }
  },
  de: {
    web: {
      zones_directes: "Direkte Interventionszonen",
      zone_map_instructions: "Klicken Sie auf ein Gebiet für weitere Details",
      zone_grand_tunis_info: "Schnelle Intervention im Großraum Tunis",
      zone_sahel_info: "Schnelle Intervention im Sahel",
      zone_other_info: "Intervention verfügbar",
      request_name_phone_required: "Name und Telefonnummer erforderlich",
      request_submitted: "Anfrage erfolgreich gesendet"
    },
    zones: {
      zones: "Abgedeckte Zonen",
      zone_tagline: "Wir greifen in diesen Regionen schnell ein.",
      carte_interactive: "Interaktive Karte",
      villes_couvertes: "Abgedeckte Städte",
      whatsapp_msg: "Hallo, ich brauche eine dringende Intervention.",
      appeler_whatsapp: "WhatsApp kontaktieren",
      urgentCoverageText: "Farbige Zonen werden in weniger als 30 Minuten abgedeckt.",
      ouvrir_maps: "In Google Maps öffnen",
      urgentStatusBadge: "Dringende Intervention",
      demande_intervention: "Interventionsanfrage",
      nom_complet: "Vollständiger Name",
      telephone: "Telefon",
      ville: "Stadt",
      envoyer_demande: "Anfrage senden",
      intervention_express: "Express-Intervention",
      fermer: "Schließen",
      type_probleme: "Problemtyp",
      prob_fuite: "Wasserleck / Rohrleitungsbruch",
      prob_chauffe_eau: "Heizungsausfall",
      prob_climatiseur: "Klimaanlagenproblem",
      prob_gaz: "Gasleitung / Sicherheit",
      description: "Beschreibung",
      desc_placeholder: "Geben Sie Ihre Adresse, Etage oder das Problem an...",
      nom_placeholder: "Bsp: Max Mustermann"
    }
  }
};

locales.forEach(loc => {
  const file = path.join(__dirname, 'src', 'i18n', 'locales', `${loc}.json`);
  if (fs.existsSync(file)) {
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (!content.web) content.web = {};
    if (!content.zones) content.zones = {};

    Object.assign(content.web, data[loc].web);
    Object.assign(content.zones, data[loc].zones);

    fs.writeFileSync(file, JSON.stringify(content, null, 2));
    console.log(`Updated ${loc}.json`);
  }
});
