import React from 'react';
import { ServiceIcon, ServiceIconName } from '../../../components/ServiceIcon';

type Lang = 'FR' | 'AR' | 'EN';
interface ServicesScreenProps {
  currentLang: Lang;
  t: Record<string, any>;
  supportWhatsAppDigits: string;
}

const ServicesScreen = ({ currentLang, t, supportWhatsAppDigits }: ServicesScreenProps) => {
  const services = [
    {
      name: t.plomberie_generale,
      icon: 'plumbing' as ServiceIconName,
      desc:
        currentLang === 'AR'
          ? 'تركيب وتصليح جميع الأجهزة الصحية المنزلية من حنفيات، مصارف، كشف تسرب المياه المجهول وحل المشاكل التقنية المعقدة.'
          : "Installation, réparation et maintenance de tous vos systèmes sanitaires. Nous intervenons sur les fuites complexes, le débouchage de canalisations, et la rénovation complète de salles de bain.",
      pts: [t.plomberie_desc_1, t.plomberie_desc_2, t.plomberie_desc_3],
      whatsappText: t.devis_msg + t.plomberie_generale,
      imgBefore:
        currentLang === 'AR'
          ? 'أنابيب نحاسية قديمة ومتآكلة وتسريب مياه مستمر'
          : 'Réseau cuivre vétuste avec fuites régulières',
      imgAfter:
        currentLang === 'AR'
          ? 'شبكة أنابيب نحاسية جديدة وملحومة بمعايير عالية'
          : 'Tubes cuivre neufs avec soudures professionnelles',
    },
    {
      name: t.climatisation,
      icon: 'ac' as ServiceIconName,
      desc:
        currentLang === 'AR'
          ? 'صيانة دورية للمكيفات وتركيب الوحدات وشحن غاز التبريد لضمان استهلاك طاقة مثالي وتبريد ممتاز في الصيف.'
          : 'Expertise complète en systèmes de refroidissement. De l\'installation de splits muraux à la maintenance de centrales de climatisation, nous assurons une température optimale.',
      pts: [t.clim_desc_1, t.clim_desc_2, t.clim_desc_3],
      whatsappText: t.devis_msg + t.climatisation,
      imgBefore:
        currentLang === 'AR'
          ? 'مروحة مكيف متسخة ومترسبة بالغبار والبكتيريا'
          : 'Filtres encrassés provoquant une surconsommation',
      imgAfter:
        currentLang === 'AR'
          ? 'مكيف نظيف ومعقم بالكامل وتبريد ممتاز'
          : 'Turbine nettoyée et désinfectée de fond en comble',
    },
    {
      name: t.installation_gaz,
      icon: 'gas' as ServiceIconName,
      desc:
        currentLang === 'AR'
          ? 'تركيب شبكات الغاز الطبيعي المنزلي والصناعي مع اختبارات صارمة لمنع تسرب الغاز وضمان مطابقتها للمواصفات الحكومية.'
          : 'La sécurité est notre priorité absolue. Nous réalisons vos installations de gaz de ville ou bouteille selon les normes de sécurité les plus strictes de la STEG.',
      pts: [t.gaz_desc_1, t.gaz_desc_2, t.gaz_desc_3],
      whatsappText: t.devis_msg + t.installation_gaz,
      imgBefore:
        currentLang === 'AR'
          ? 'خرطوم غاز قديم جداً ومهترئ يشكل خطراً كبيراً'
          : 'Raccord souple expiré et robinet de gaz oxydé',
      imgAfter:
        currentLang === 'AR'
          ? 'تمديدات نحاسية ملحومة وآمنة مع صمام أمان نحاسي'
          : 'Tuyauterie cuivre rigide soudée aux normes STEG',
    },
    {
      name: t.chauffage_central,
      icon: 'heater' as ServiceIconName,
      desc:
        currentLang === 'AR'
          ? 'ضبط وصيانة المراجل وشبكات التدفئة المركزية وتطهير المشعات من الرواسب الكلسية لتدفئة متجانسة وقوية.'
          : 'Solutions de chauffage performantes pour un hiver serein. Nous installons des chaudières à condensation haute performance et des radiateurs révisés.',
      pts: [t.chauffage_desc_1, t.chauffage_desc_2, t.chauffage_desc_3],
      whatsappText: t.devis_msg + t.chauffage_central,
      imgBefore:
        currentLang === 'AR'
          ? 'مشع تدفئة مليء بالرواسب الكلسية والمياه الطينية'
          : 'Radiateurs froids par embouage du circuit d\'eau',
      imgAfter:
        currentLang === 'AR'
          ? 'دورة تدفئة مطهرة بالكامل وتدفئة ممتازة'
          : 'Désembouage hydrodynamique et chauffage parfait',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left bg-slate-50 dark:bg-transparent">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="bg-[#1E3A5F] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
          {t.nos_services}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-6">{t.nos_services}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 font-semibold">{t.nos_services_subtitle}</p>
      </div>

      <div className="space-y-16">
        {services.map((service, idx) => (
          <div
            key={service.name}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-slate-200 dark:border-slate-800 pb-16 last:border-b-0 last:pb-0 ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white font-extrabold text-sm">
                  <ServiceIcon name={service.icon} className="w-5 h-5" title={service.name} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-slate-100">{service.name}</h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-405 leading-relaxed font-semibold">
                {service.desc}
              </p>

              <ul className="space-y-2.5 font-bold text-xs text-slate-650 dark:text-slate-300">
                {service.pts.map((point: string, idx2: number) => (
                  <li key={idx2} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(service.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-md hover:scale-[1.02] transform"
              >
                <span>{t.demander_devis}</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-4.5 border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                <span className="absolute top-2.5 left-2.5 bg-slate-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded uppercase">
                  {currentLang === 'AR' ? 'قبل التدخل' : 'AVANT'}
                </span>
                <div className="flex-1 flex items-center justify-center p-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase leading-tight mt-6">
                  {service.imgBefore}
                </div>
                <div className="h-1 bg-amber-500 rounded-full w-full" />
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-4.5 border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded uppercase">
                  {currentLang === 'AR' ? 'بعد التدخل' : 'APRÈS'}
                </span>
                <div className="flex-1 flex items-center justify-center p-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase leading-tight mt-6">
                  {service.imgAfter}
                </div>
                <div className="h-1 bg-emerald-500 rounded-full w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesScreen;
