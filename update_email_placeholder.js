const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const locales = ['ar.json', 'fr.json', 'en.json', 'de.json', 'es.json', 'hi.json', 'it.json', 'tr.json', 'zh.json'];

const placeholders = {
  "en": "your.email@domain.com",
  "fr": "votre.email@domaine.tn",
  "ar": "بريدك.الإلكتروني@نطاق.tn",
  "de": "deine.email@domain.com",
  "es": "tu.email@dominio.com",
  "hi": "आपका.ईमेल@डोमेन.com",
  "it": "la.tua.email@dominio.com",
  "tr": "epostaniz@alanadi.com",
  "zh": "your.email@domain.com"
};

locales.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.web = data.web || {};
    data.web.email_placeholder = placeholders[lang];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
