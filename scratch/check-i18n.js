const fs = require('fs');
const ar = JSON.parse(fs.readFileSync('src/i18n/locales/ar.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('src/i18n/locales/fr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8'));

console.log("AR:");
console.log("- prix:", ar.prix);
console.log("- web.maxLabel:", ar.web?.maxLabel);
console.log("- web.categories:", ar.web?.categories);
console.log("- toutes_categories:", ar.toutes_categories);
console.log("- tri:", ar.tri);

console.log("\nFR:");
console.log("- prix:", fr.prix);
console.log("- web.maxLabel:", fr.web?.maxLabel);
console.log("- web.categories:", fr.web?.categories);
console.log("- toutes_categories:", fr.toutes_categories);
console.log("- tri:", fr.tri);

// Add missing keys
const update = (json, lang) => {
  let changed = false;
  if (!json.web) json.web = {};
  if (!json.web.maxLabel) {
    json.web.maxLabel = lang === 'ar' ? 'أقصى' : (lang === 'fr' ? 'Max' : 'Max');
    changed = true;
  }
  if (!json.web.categories) {
    json.web.categories = lang === 'ar' ? 'الأصناف' : (lang === 'fr' ? 'Catégories' : 'Categories');
    changed = true;
  }
  if (!json.toutes_categories) {
    json.toutes_categories = lang === 'ar' ? 'جميع الأصناف' : (lang === 'fr' ? 'Toutes les catégories' : 'All categories');
    changed = true;
  }
  if (!json.tri) {
    json.tri = lang === 'ar' ? 'ترتيب حسب' : (lang === 'fr' ? 'Trier par' : 'Sort by');
    changed = true;
  }
  return changed;
};

if (update(ar, 'ar')) fs.writeFileSync('src/i18n/locales/ar.json', JSON.stringify(ar, null, 2));
if (update(fr, 'fr')) fs.writeFileSync('src/i18n/locales/fr.json', JSON.stringify(fr, null, 2));
if (update(en, 'en')) fs.writeFileSync('src/i18n/locales/en.json', JSON.stringify(en, null, 2));

console.log("\nDone updating.");
