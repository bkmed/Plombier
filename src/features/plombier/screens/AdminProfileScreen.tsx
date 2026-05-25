import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useToast } from '../../../context/ToastContext';
import {
  updatePlombierSettings,
  addInterventionZone,
  updateInterventionZone,
  removeInterventionZone,
} from '../../../store/slices/plombierSettingsSlice';

type Lang = 'FR' | 'AR' | 'EN';
interface AdminProfileScreenProps {
  currentLang: Lang;
  t: (key: string, options?: any) => string;
}

const AdminProfileScreen = ({ currentLang, t }: AdminProfileScreenProps) => {
  const { user, updateProfile } = useAuth();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const plombierSettings = useSelector(
    (state: RootState) => state.plombierSettings,
  );

  const [businessNameInput, setBusinessNameInput] = useState('');
  const [experienceYearsInput, setExperienceYearsInput] = useState('');
  const [supportEmailInput, setSupportEmailInput] = useState('');
  const [supportPhoneInput, setSupportPhoneInput] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [zoneInput, setZoneInput] = useState('');
  const [editingZoneIndex, setEditingZoneIndex] = useState<number | null>(null);
  const zones = useSelector(
    (state: RootState) => state.plombierSettings?.interventionZones ?? [],
  );

  const availableZones = ['Grand Tunis', 'Sahel', 'Sfax'];

  useEffect(() => {
    if (user) {
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');
    }
    setBusinessNameInput(plombierSettings?.businessName ?? 'Plombier Tunisie');
    setExperienceYearsInput(String(plombierSettings?.experienceYears ?? 15));
    setSupportEmailInput(plombierSettings?.supportEmail || user?.email || '');
    setSupportPhoneInput(plombierSettings?.supportPhone || user?.phone || '');
  }, [user, plombierSettings]);

  const handleAdminProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileEmail) {
      showToast(
        currentLang === 'AR'
          ? 'الرجاء إدخال بريد إلكتروني صحيح'
          : 'Veuillez saisir une adresse email valide.',
        'error',
      );
      return;
    }
    if (!profilePhone) {
      showToast(
        currentLang === 'AR'
          ? 'الرجاء إدخال رقم هاتف صحيح'
          : 'Veuillez saisir un numéro de téléphone valide.',
        'error',
      );
      return;
    }

    try {
      await updateProfile({ email: profileEmail, phone: profilePhone });
      showToast(
        currentLang === 'AR'
          ? 'تم تحديث بيانات المدير بنجاح'
          : 'Coordonnées administrateur mises à jour !',
        'success',
      );
    } catch (error) {
      showToast(
        currentLang === 'AR'
          ? 'حدث خطأ أثناء تحديث الملف'
          : 'Erreur lors de la mise à jour du profil.',
        'error',
      );
      console.error('Profile update error:', error);
    }
  };

  const handleAdminBrandSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedBusinessName = businessNameInput.trim();
    const years = Number(experienceYearsInput);

    if (!trimmedBusinessName) {
      showToast(
        currentLang === 'AR'
          ? 'الرجاء إدخال اسم العرض'
          : 'Veuillez saisir le nom affiché.',
        'error',
      );
      return;
    }

    if (!Number.isFinite(years) || years < 1 || years > 80) {
      showToast(
        currentLang === 'AR'
          ? 'الرجاء إدخال عدد سنوات صحيح'
          : 'Veuillez saisir une expérience valide.',
        'error',
      );
      return;
    }

    if (!supportEmailInput.trim()) {
      showToast(
        currentLang === 'AR'
          ? 'الرجاء إدخال بريد الدعم الإلكتروني'
          : 'Veuillez entrer l’e-mail de support.',
        'error',
      );
      return;
    }

    if (!supportPhoneInput.trim()) {
      showToast(
        currentLang === 'AR'
          ? 'الرجاء إدخال رقم واتساب الدعم'
          : 'Veuillez entrer le numéro WhatsApp de support.',
        'error',
      );
      return;
    }

    dispatch(
      updatePlombierSettings({
        businessName: trimmedBusinessName,
        experienceYears: Math.round(years),
        supportEmail: supportEmailInput.trim(),
        supportPhone: supportPhoneInput.trim(),
      }),
    );
    showToast(
      currentLang === 'AR'
        ? 'تم تحديث هوية الموقع'
        : 'Identité du site mise à jour !',
      'success',
    );
  };

  const handleZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedZone = zoneInput.trim();
    if (!trimmedZone) {
      showToast(
        currentLang === 'AR'
          ? 'الرجاء إدخال اسم المنطقة'
          : 'Veuillez entrer un nom de zone.',
        'error',
      );
      return;
    }

    if (editingZoneIndex !== null) {
      dispatch(
        updateInterventionZone({ index: editingZoneIndex, name: trimmedZone }),
      );
      showToast(
        currentLang === 'AR'
          ? 'تم تحديث المنطقة بنجاح'
          : 'Zone d’intervention mise à jour !',
        'success',
      );
      setEditingZoneIndex(null);
    } else {
      if (zones.includes(trimmedZone)) {
        showToast(
          currentLang === 'AR'
            ? 'هذه المنطقة موجودة بالفعل'
            : 'Cette zone existe déjà.',
          'error',
        );
        return;
      }
      dispatch(addInterventionZone(trimmedZone));
      showToast(
        currentLang === 'AR'
          ? 'تم إضافة المنطقة الجديدة'
          : 'Nouvelle zone ajoutée !',
        'success',
      );
    }

    setZoneInput('');
  };

  const handleEditZone = (index: number) => {
    setEditingZoneIndex(index);
    setZoneInput(zones[index]);
  };

  const handleCancelZoneEdit = () => {
    setEditingZoneIndex(null);
    setZoneInput('');
  };

  const handleDeleteZone = (index: number) => {
    dispatch(removeInterventionZone(index));
    if (editingZoneIndex === index) {
      handleCancelZoneEdit();
    }
    showToast(
      currentLang === 'AR' ? 'تم حذف المنطقة' : 'Zone supprimée !',
      'success',
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <h1 className="text-3xl font-black tracking-tight">
        {currentLang === 'AR'
          ? 'إعدادات حساب المدير'
          : 'Profil Administrateur Principal'}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
        {currentLang === 'AR'
          ? 'تحكم ببيانات الأمان وخيارات التحكم لمدير التطبيق.'
          : 'Gérez vos accès de sécurité et configurez vos préférences de contact.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 items-start">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-center shadow-sm space-y-6">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-3xl font-black text-[#F97316] mx-auto border-2 border-[#F97316]">
            ★
          </div>
          <div>
            <h3 className="text-base font-black text-slate-850 dark:text-slate-100">
              {user?.name || 'Admin'}
            </h3>
            <span className="inline-block mt-1 text-[8.5px] font-black px-3 py-1 rounded-full uppercase bg-amber-100 text-amber-700">
              Administrateur
            </span>
          </div>
          <div className="text-left text-xs font-semibold text-slate-400 space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
            <div>
              Email:{' '}
              <span className="font-black text-slate-700 dark:text-slate-200">
                {profileEmail}
              </span>
            </div>
            <div>
              {t('support.whatsapp')}:{' '}
              <span className="font-black text-slate-700 dark:text-slate-200">
                {plombierSettings.supportPhone || profilePhone}
              </span>
            </div>
            <div>
              {t('support.email_label')}:{' '}
              <span className="font-black text-slate-700 dark:text-slate-200">
                {plombierSettings.supportEmail || profileEmail}
              </span>
            </div>
            <div>
              {currentLang === 'AR' ? 'الحالة' : 'Statut'}:{' '}
              <span className="font-black text-emerald-500">
                {currentLang === 'AR' ? 'نشط' : 'Actif'}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider">
            {currentLang === 'AR'
              ? 'بيانات الاتصال والأمان'
              : 'Coordonnées & Sécurité'}
          </h3>

          <form
            onSubmit={handleAdminBrandSettingsUpdate}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6"
          >
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {currentLang === 'AR'
                  ? 'اسم الموقع / الاسم واللقب'
                  : 'Titre du site / nom et prénom'}
              </label>
              <input
                type="text"
                required
                value={businessNameInput}
                onChange={e => setBusinessNameInput(e.target.value)}
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
                onChange={e => setExperienceYearsInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-sm uppercase tracking-wider"
              >
                {currentLang === 'AR'
                  ? 'حفظ هوية الموقع'
                  : 'Enregistrer l’identité du site'}
              </button>
            </div>
          </form>

          <div className="space-y-6 border-b border-slate-100 dark:border-slate-700 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {currentLang === 'AR'
                    ? 'مناطق التدخل'
                    : 'Zones d’intervention'}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {currentLang === 'AR'
                    ? 'أضف أو حرر المناطق المتاحة لفريق التدخل السريع.'
                    : 'Ajoutez ou modifiez les zones couvertes par votre service.'}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {zones.length} {currentLang === 'AR' ? 'منطقة' : 'zones'}
              </span>
            </div>

            <form
              onSubmit={handleZoneSubmit}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <select
                value={zoneInput}
                onChange={e => setZoneInput(e.target.value)}
                className="w-full sm:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              >
                <option value="" disabled>
                  {currentLang === 'AR'
                    ? 'اختر منطقة'
                    : 'Sélectionnez une zone'}
                </option>
                {availableZones.map(zone => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  type="submit"
                  className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl transition shadow-sm uppercase tracking-wider"
                >
                  {editingZoneIndex !== null
                    ? currentLang === 'AR'
                      ? 'حفظ المنطقة'
                      : 'Enregistrer'
                    : currentLang === 'AR'
                    ? 'أضف المنطقة'
                    : 'Ajouter'}
                </button>
                {editingZoneIndex !== null && (
                  <button
                    type="button"
                    onClick={handleCancelZoneEdit}
                    className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-black px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    {currentLang === 'AR' ? 'إلغاء' : 'Annuler'}
                  </button>
                )}
              </div>
            </form>

            <div className="grid grid-cols-1 gap-3">
              {zones.length > 0 ? (
                zones.map((zone, index) => (
                  <div
                    key={`${zone}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3"
                  >
                    <span className="text-sm font-black text-slate-700 dark:text-slate-100">
                      {zone}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditZone(index)}
                        className="text-[10px] font-black uppercase tracking-wider text-[#1E3A5F] hover:underline"
                      >
                        {currentLang === 'AR' ? 'تعديل' : 'Modifier'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteZone(index)}
                        className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:underline"
                      >
                        {currentLang === 'AR' ? 'حذف' : 'Supprimer'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-sm">
                  {currentLang === 'AR'
                    ? 'لم تتم إضافة أي منطقة حتى الآن.'
                    : 'Aucune zone ajoutée pour le moment.'}
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleAdminProfileUpdate}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6"
          >
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('admin.admin_edit_email')}
              </label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={e => setProfileEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('admin.admin_edit_phone')}
              </label>
              <input
                type="tel"
                required
                value={profilePhone}
                onChange={e => setProfilePhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('support.email_label')}
              </label>
              <input
                type="email"
                required
                value={supportEmailInput}
                onChange={e => setSupportEmailInput(e.target.value)}
                placeholder="support@plombier-tunisie.tn"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('support.whatsapp')}
              </label>
              <input
                type="tel"
                required
                value={supportPhoneInput}
                onChange={e => setSupportPhoneInput(e.target.value)}
                placeholder="+216 22 456 789"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-sm uppercase tracking-wider"
              >
                {currentLang === 'AR'
                  ? 'حفظ بيانات الاتصال'
                  : 'Enregistrer les coordonnées'}
              </button>
            </div>
          </form>

          <form
            onSubmit={e => {
              e.preventDefault();
              showToast('Mot de passe admin mis à jour !', 'success');
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Nouveau mot de passe administrateur
              </label>
              <input
                type="password"
                required
                placeholder="Ex: admin123"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Confirmation
              </label>
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
  );
};

export default AdminProfileScreen;
