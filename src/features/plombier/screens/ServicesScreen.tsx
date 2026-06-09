import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, Image } from 'react-native';
import { ServiceIcon, ServiceIconName } from '../../../components/ServiceIcon';
import { useSelector, useDispatch } from 'react-redux';
import { selectServices } from '../../../store/slices/servicesSlice';
import {
  trackPageView,
  trackShare,
  trackCallClick,
} from '../../../store/slices/analyticsSlice';
import { useTranslation } from 'react-i18next';

const SERVICE_TRANSLATION_PREFIX = 'services_local.';

const ServicesScreen = ({
  supportWhatsAppDigits,
}: {
  supportWhatsAppDigits?: string;
}) => {
  const services = useSelector(selectServices);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(trackPageView('Services'));
  }, [dispatch]);

  const handleShare = (
    serviceName: string,
    platform: 'facebook' | 'whatsapp',
  ) => {
    dispatch(trackShare({ platform, item: serviceName }));
    const pageUrl =
      Platform.OS === 'web' && typeof window !== 'undefined'
        ? (window as any).location?.href || 'https://plombier.example.com/services'
        : 'https://plombier.example.com/services';
    const url = encodeURIComponent(pageUrl);
    const text = encodeURIComponent(`Découvrez nos services : ${serviceName}`);

    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else {
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
    }

    Linking.openURL(shareUrl);
  };

  const translateServiceField = (key?: string) => {
    const trimmedKey = key?.trim();
    if (!trimmedKey) return '';

    const namespacedKey = trimmedKey.startsWith(SERVICE_TRANSLATION_PREFIX)
      ? trimmedKey
      : `${SERVICE_TRANSLATION_PREFIX}${trimmedKey}`;

    return t(namespacedKey, {
      defaultValue: t(trimmedKey, { defaultValue: trimmedKey }),
    });
  };

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left bg-slate-50 dark:bg-transparent">
      <View className="text-center max-w-3xl mx-auto mb-16">
        <Text className="bg-[#1E3A5F] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
          {t('webServices.nos_services')}
        </Text>
        <Text className="text-3xl sm:text-4xl font-black tracking-tight mt-6 text-slate-900 dark:text-slate-100">
          {t('webServices.nos_services')}
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 font-semibold">
          {t('webServices.nos_services_subtitle')}
        </Text>
      </View>

      <View className="space-y-16">
        {services.map((service, idx) => (
          <View
            key={service.id || `${service.name}-${idx}`}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-slate-200 dark:border-slate-800 pb-16 last:border-b-0 last:pb-0 ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <View className="space-y-6">
              <View className="flex items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white font-extrabold text-sm">
                  <ServiceIcon
                    name={service.icon as ServiceIconName}
                    className="w-5 h-5"
                    title={translateServiceField(service.name)}
                  />
                </View>
                <Text className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                  {translateServiceField(service.name)}
                </Text>
              </View>

              <Text className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {translateServiceField(service.desc)}
              </Text>

              <View style={{ gap: 10 }}>
                {service.pts &&
                  service.pts.map((point: string, idx2: number) => (
                    <View key={idx2} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                      <Text className="text-emerald-500 font-black" style={{ lineHeight: 18 }}>•</Text>
                      <Text className="text-slate-600 dark:text-slate-300 flex-1 text-xs font-bold">
                        {translateServiceField(point)}
                      </Text>
                    </View>
                  ))}
              </View>

              <View className="flex flex-col sm:flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    dispatch(trackCallClick());
                    Linking.openURL(
                      `https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
                        (service.whatsappText
                          ? t(service.whatsappText, {
                              defaultValue: service.whatsappText,
                            })
                          : '') +
                          ' ' +
                          translateServiceField(service.name),
                      )}`,
                    );
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-md hover:scale-[1.02] transform"
                >
                  <Text className="text-white">{t('demander_devis')}</Text>
                </TouchableOpacity>

                {/* Share Buttons */}
                <View className="flex flex-row gap-2">
                  <TouchableOpacity
                    onPress={() =>
                      handleShare(
                        translateServiceField(service.name),
                        'facebook',
                      )
                    }
                    className="bg-[#1877F2] rounded-xl px-4 py-3.5 flex items-center justify-center transition hover:bg-[#166FE5]"
                  >
                    <Text className="text-white text-[10px] font-black">
                      FB
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      handleShare(
                        translateServiceField(service.name),
                        'whatsapp',
                      )
                    }
                    className="bg-[#25D366] rounded-xl px-4 py-3.5 flex items-center justify-center transition hover:bg-[#20BD5A]"
                  >
                    <Text className="text-white text-[10px] font-black">
                      WA
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="grid grid-cols-2 gap-4">
              <View className="bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden flex flex-col min-h-[170px]">
                {service.imgBefore && (service.imgBefore.startsWith('data:') || service.imgBefore.startsWith('http')) ? (
                  <Image source={{ uri: service.imgBefore }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <View className="flex-1 flex items-center justify-center p-2 mt-6 z-10">
                    <Text className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase leading-tight text-center">
                      {service.imgBefore ? translateServiceField(service.imgBefore) : ''}
                    </Text>
                  </View>
                )}
                <Text className="absolute top-2.5 left-2.5 bg-slate-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded uppercase overflow-hidden z-20">
                  {t('services_local.before_intervention')}
                </Text>
                <View className="h-1 bg-amber-500 absolute bottom-0 left-0 right-0 z-20" />
              </View>

              <View className="bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden flex flex-col min-h-[170px]">
                {service.imgAfter && (service.imgAfter.startsWith('data:') || service.imgAfter.startsWith('http')) ? (
                  <Image source={{ uri: service.imgAfter }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <View className="flex-1 flex items-center justify-center p-2 mt-6 z-10">
                    <Text className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase leading-tight text-center">
                      {service.imgAfter ? translateServiceField(service.imgAfter) : ''}
                    </Text>
                  </View>
                )}
                <Text className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded uppercase overflow-hidden z-20">
                  {t('services_local.after_intervention')}
                </Text>
                <View className="h-1 bg-emerald-500 absolute bottom-0 left-0 right-0 z-20" />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ServicesScreen;
