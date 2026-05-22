import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';

type Lang = 'FR' | 'AR' | 'EN';
interface ZonesScreenProps {
  currentLang: Lang;
  t: Record<string, any>;
  supportWhatsAppDigits: string;
  supportWhatsAppNumber: string;
}

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

const ZonesScreen = ({ currentLang, t, supportWhatsAppDigits, supportWhatsAppNumber }: ZonesScreenProps) => {
  const { showToast } = useToast();
  const [selectedGovernorat, setSelectedGovernorat] = useState<string | null>('Grand Tunis');
  const [interventionName, setInterventionName] = useState('');
  const [interventionPhone, setInterventionPhone] = useState('');
  const [interventionGov, setInterventionGov] = useState('Tunis');
  const [interventionProblem, setInterventionProblem] = useState("Fuite d'eau");
  const [interventionDetails, setInterventionDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interventionName || !interventionPhone) {
      showToast(currentLang === 'AR' ? 'الرجاء ملء الاسم والهاتف' : 'Nom et téléphone requis.', 'error');
      return;
    }

    showToast(
      currentLang === 'AR'
        ? 'تم تسجيل طلبك بنجاح ! سيتصل بك الفني الآن.'
        : 'Demande urgente enregistrée ! Un technicien vous appelle sous 10 min.',
      'success',
    );
    setInterventionName('');
    setInterventionPhone('');
    setInterventionDetails('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="bg-[#1E3A5F] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
          {t.zones_directes}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-6">{t.zones}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 font-semibold">{t.zone_tagline}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[500px]">
          <div>
            <h3 className="text-base font-black text-slate-850 dark:text-slate-100">{t.carte_interactive}</h3>
            <p className="text-slate-400 text-xs mt-1 font-semibold">
              {currentLang === 'AR'
                ? 'انقر على الولاية المظللة بالبرتقالي لعرض تفاصيل التغطية الفورية لدينا.'
                : 'Cliquez sur les gouvernorats oranges pour voir notre temps de réponse moyen.'}
            </p>
          </div>

          <div className="flex justify-center py-8 relative">
            <svg width="220" height="380" viewBox="0 0 100 180" fill="none" className="filter drop-shadow-md">
              <path
                d="M38 12 C 43 8, 48 9, 52 14 L 46 22 Z"
                fill={selectedGovernorat === 'Grand Tunis' ? '#f97316' : '#1e3a5f'}
                className="cursor-pointer transition hover:opacity-85"
                onClick={() => setSelectedGovernorat('Grand Tunis')}
              />
              <path
                d="M48 20 C 53 18, 55 24, 52 28 L 45 26 Z"
                fill={selectedGovernorat === 'Grand Tunis' ? '#F97316' : '#2563EB'}
                className="cursor-pointer transition hover:scale-105 transform origin-center"
                onClick={() => setSelectedGovernorat('Grand Tunis')}
              />
              <path
                d="M53 23 C 58 18, 68 20, 61 31 L 52 28 Z"
                fill={selectedGovernorat === 'Sahel' ? '#F97316' : '#3B82F6'}
                className="cursor-pointer transition hover:opacity-85"
                onClick={() => setSelectedGovernorat('Sahel')}
              />
              <path
                d="M52 30 C 58 31, 62 42, 57 52 L 48 40 Z"
                fill={selectedGovernorat === 'Sahel' ? '#F97316' : '#1D4ED8'}
                className="cursor-pointer transition hover:scale-105 transform origin-center"
                onClick={() => setSelectedGovernorat('Sahel')}
              />
              <path
                d="M46 54 C 54 58, 58 70, 52 82 L 38 72 Z"
                fill={selectedGovernorat === 'Sfax' ? '#F97316' : '#60A5FA'}
                className="cursor-pointer transition hover:opacity-85"
                onClick={() => setSelectedGovernorat('Sfax')}
              />
              <path d="M36 24 L44 38 L38 52 L36 68 L22 88 L14 118 L24 140 L38 170 L52 145 L48 112 L44 86 L40 70 Z" fill="#E2E8F0" className="opacity-30 pointer-events-none" />
            </svg>

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
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{t.villes_couvertes}</h4>
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
              * {currentLang === 'AR' ? 'تغطية فورية وسريعة على مدار الساعة' : "Zone couverte par les équipes d'intervention directes."}
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

        <div className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-extrabold text-[8.5px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              {currentLang === 'AR' ? 'حالة طوارئ قصوى' : 'URGENT'}
            </span>
            <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 mt-3">{t.demande_intervention}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-semibold text-xs">
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
                  <option value="Panne Chauffe-eau">Panne Chauffe-eau</option>
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
  );
};

export default ZonesScreen;
