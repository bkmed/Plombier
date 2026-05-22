import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  setActiveTab: (tab: string) => void;
  currentRole: string;
  supportWhatsAppDigits: string;
  supportWhatsAppNumber: string;
}

export const FooterLinks = ({ setActiveTab, currentRole, supportWhatsAppDigits, supportWhatsAppNumber }: Props) => {
  const { t } = useTranslation();

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
        <Text className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('navigation')}</Text>
        <View className="space-y-2 text-xs font-semibold">
          <TouchableOpacity onPress={() => setActiveTab(currentRole === 'admin' ? 'AdminAccueil' : 'Accueil')}>
            <Text className="hover:text-[#F97316]">{t('accueil')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab(currentRole === 'admin' ? 'AdminProfile' : 'Profile')}>
            <Text className="hover:text-[#F97316]">{t('mon_profil')}</Text>
          </TouchableOpacity>
          {currentRole === 'admin' && (
            <TouchableOpacity onPress={() => setActiveTab('AdminGallery')}>
              <Text className="hover:text-[#F97316]">{t('gallery.manageGallery')}</Text>
            </TouchableOpacity>
          )}
          {currentRole !== 'admin' && (
            <>
              <TouchableOpacity onPress={() => setActiveTab('Services')}>
                <Text className="hover:text-[#F97316]">{t('services')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('Marketplace')}>
                <Text className="hover:text-[#F97316]">{t('pieces')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('Gallery')}>
                <Text className="hover:text-[#F97316]">{t('gallery.title')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View className="space-y-3">
        <Text className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('informations')}</Text>
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
        <Text className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Support</Text>
        <View className="space-y-2 text-xs font-semibold">
          <TouchableOpacity onPress={() => openTel('+21622456789')}>
            <Text className="flex items-center gap-2">📞 +216 22 456 789</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openMail('support@plombier-tunisie.tn')}>
            <Text className="flex items-center gap-2">✉️ support@plombier-tunisie.tn</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openWhatsApp(supportWhatsAppDigits)}>
            <Text className="flex items-center gap-2">{t('support.whatsapp')}: {supportWhatsAppNumber}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default FooterLinks;
