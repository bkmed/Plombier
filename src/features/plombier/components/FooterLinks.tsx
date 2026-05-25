import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  setActiveTab: (tab: string) => void;
  currentRole: string;
  supportWhatsAppDigits: string;
  supportWhatsAppNumber: string;
  supportEmail: string;
}

export const FooterLinks = ({
  setActiveTab,
  currentRole,
  supportWhatsAppDigits,
  supportWhatsAppNumber,
  supportEmail,
}: Props) => {
  const { t } = useTranslation();

  const navLabelRawPreferred = (t as any)('navigation_label');
  const navLabelRaw =
    typeof navLabelRawPreferred !== 'undefined' && navLabelRawPreferred !== null
      ? navLabelRawPreferred
      : (t as any)('navigation');
  const navLabel =
    typeof navLabelRaw === 'string'
      ? navLabelRaw
      : (navLabelRaw && (navLabelRaw.title || navLabelRaw.label)) ||
        'Navigation';

  const openTel = (tel: string) => {
    Linking.openURL(`tel:${tel}`);
  };

  const openMail = (mail: string) => {
    Linking.openURL(`mailto:${mail}`);
  };

  const openWhatsApp = (digits: string) => {
    Linking.openURL(`https://wa.me/${digits}`);
  };

  return (
    <>
      <View className="space-y-3">
        <Text className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          {navLabel}
        </Text>
        <View className="space-y-2 text-xs font-semibold">
          <TouchableOpacity
            onPress={() =>
              setActiveTab(currentRole === 'admin' ? 'AdminAccueil' : 'Accueil')
            }
          >
            <Text className="hover:text-[#F97316]">{t('sitemap_page_accueil')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActiveTab(currentRole === 'admin' ? 'AdminProfile' : 'Profile')
            }
          >
            <Text className="hover:text-[#F97316]">{t('sitemap_page_profil')}</Text>
          </TouchableOpacity>
          {currentRole === 'admin' && (
            <TouchableOpacity onPress={() => setActiveTab('AdminGallery')}>
              <Text className="hover:text-[#F97316]">
                {t('gallery.manageGallery')}
              </Text>
            </TouchableOpacity>
          )}
          {currentRole !== 'admin' && (
            <>
              <TouchableOpacity onPress={() => setActiveTab('Services')}>
                <Text className="hover:text-[#F97316]">{t('sitemap_page_services')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('Marketplace')}>
                <Text className="hover:text-[#F97316]">{t('sitemap_page_pieces')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('Gallery')}>
                <Text className="hover:text-[#F97316]">
                  {t('gallery.title')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View className="space-y-3">
        <Text className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          {t('informations')}
        </Text>
        <View className="space-y-2 text-xs font-semibold">
          <TouchableOpacity onPress={() => setActiveTab('Informations')}>
            <Text className="hover:text-[#F97316]">{t('informations')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Politique')}>
            <Text className="hover:text-[#F97316]">{t('politique')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Conditions')}>
            <Text className="hover:text-[#F97316]">{t('conditions_util')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('PlanSite')}>
            <Text className="hover:text-[#F97316]">{t('plan_site')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="space-y-3">
        <Text className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          {t('support.header') || 'Support'}
        </Text>
        <View className="space-y-2 text-xs font-semibold">
          {supportWhatsAppNumber ? (
            <TouchableOpacity onPress={() => openTel(supportWhatsAppNumber)}>
              <Text className="flex items-center gap-2">
                📞 {supportWhatsAppNumber}
              </Text>
            </TouchableOpacity>
          ) : null}

          {supportEmail ? (
            <TouchableOpacity onPress={() => openMail(supportEmail)}>
              <Text className="flex items-center gap-2">✉️ {supportEmail}</Text>
            </TouchableOpacity>
          ) : null}

          {supportWhatsAppDigits ? (
            <TouchableOpacity
              onPress={() => openWhatsApp(supportWhatsAppDigits)}
            >
              <Text className="flex items-center gap-2">
                {t('support.whatsapp')}: {supportWhatsAppNumber}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default FooterLinks;
