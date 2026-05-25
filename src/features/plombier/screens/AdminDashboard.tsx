import React from 'react';

interface AdminDashboardProps {
  currentLang: string;
  businessName: string;
  products: any[];
  reduxCategories: any[];
  usersList: any[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  businessName,
  products,
  reduxCategories,
  usersList,
}) => {
  return (
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
            title: currentLang === 'AR' ? 'الأصناف المتوفرة' : 'Catégories',
            val: reduxCategories.length,
            desc:
              currentLang === 'AR'
                ? 'صنفاً ديناميكياً'
                : 'Familles de produits',
            color: 'border-l-4 border-amber-500',
          },
          {
            title: currentLang === 'AR' ? 'حسابات الأعضاء' : 'Membres Inscrits',
            val: usersList.length,
            desc:
              currentLang === 'AR' ? 'حساباً مسجلاً' : 'Clients enregistrés',
            color: 'border-l-4 border-emerald-500',
          },
          {
            title:
              currentLang === 'AR' ? 'طلبات الصيانة الواردة' : 'Urgences Leads',
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
                  ? 'تمت إضافة قطعة غيار جديدة : "مزيج مطبق غروهي".'
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
                <p className="text-slate-800 dark:text-slate-200">{l.log}</p>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {l.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
