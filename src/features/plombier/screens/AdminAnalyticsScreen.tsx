import React from 'react';
import { View, Text } from 'react-native';

interface AdminAnalyticsScreenProps {
  t: any;
}

const AdminAnalyticsScreen = ({ t }: AdminAnalyticsScreenProps) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <Text className="text-3xl font-black tracking-tight">
        {tCommon(
          'admin.analyticsTitle',
          'Financial and service performance metrics',
        )}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
        {tCommon(
          'admin.analyticsDescription',
          'Review revenue charts and service request trends in one dashboard.',
        )}
      </Text>

      <View className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          {
            label: tCommon('admin.avgResponseTime', 'Average response time'),
            value: '18 min',
            detail: tCommon('admin.urgentRequests', 'Urgent requests'),
          },
          {
            label: tCommon('admin.avgOrderValue', 'Average order value'),
            value: '164 DT',
            detail: tCommon('admin.usedParts', 'Used parts'),
          },
          {
            label: tCommon('admin.openLeads', 'Open leads'),
            value: '27',
            detail: tCommon('admin.thisWeek', 'This week'),
          },
          {
            label: tCommon('admin.conversionRate', 'Conversion rate'),
            value: '31%',
            detail: tCommon('admin.whatsappToOrder', 'WhatsApp to order'),
          },
        ].map((metric, idx) => (
          <View
            key={idx}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm"
          >
            <Text className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
              {metric.label}
            </Text>
            <Text className="mt-2 block text-2xl font-black text-slate-800 dark:text-white">
              {metric.value}
            </Text>
            <Text className="mt-1 block text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {metric.detail}
            </Text>
          </View>
        ))}
      </View>

      <View className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <Text className="text-sm font-black uppercase tracking-wider">
            {tCommon(
              'admin.monthlyRevenueChartTitle',
              'Monthly revenue evolution (TND)',
            )}
          </Text>
          <View className="space-y-4 pt-4">
            {[
              { month: 'Janvier', val: 3400, percent: '45%' },
              { month: 'Février', val: 4800, percent: '60%' },
              { month: 'Mars', val: 5100, percent: '65%' },
              { month: 'Avril', val: 6800, percent: '80%' },
              { month: 'Mai (Encours)', val: 8200, percent: '100%' },
            ].map((row, idx) => (
              <View key={idx} className="space-y-1.5 text-xs font-semibold">
                <View className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <Text>{row.month}</Text>
                  <Text className="font-black text-slate-800 dark:text-white">
                    {row.val.toFixed(3)} DT
                  </Text>
                </View>
                <View className="h-4 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden relative">
                  <View
                    className="h-full bg-gradient-to-r from-sky-600 to-[#1E3A5F] rounded-lg transition-all duration-500"
                    style={{ width: row.percent as any }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <Text className="text-sm font-black uppercase tracking-wider">
            {tCommon(
              'admin.serviceDemandBreakdownTitle',
              'Service request allocation (%)',
            )}
          </Text>
          <View className="space-y-5 pt-4 text-xs font-bold text-slate-500">
            {[
              {
                name: tCommon('web.plomberie_generale', 'Plomberie générale'),
                share: 45,
                color: 'bg-blue-500',
              },
              {
                name: tCommon('web.chauffage_central', 'Chauffage central'),
                share: 25,
                color: 'bg-amber-500',
              },
              {
                name: tCommon('web.climatisation', 'Climatisation'),
                share: 20,
                color: 'bg-emerald-500',
              },
              {
                name: tCommon('web.installation_gaz', 'Installation gaz'),
                share: 10,
                color: 'bg-rose-500',
              },
            ].map((row, idx) => (
              <View key={idx} className="space-y-1">
                <View className="flex justify-between items-center text-slate-700 dark:text-slate-200">
                  <View className="flex items-center gap-2">
                    <View className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                    <Text>{row.name}</Text>
                  </View>
                  <Text>{row.share}%</Text>
                </View>
                <View className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <View
                    className={`h-full ${row.color}`}
                    style={{ width: `${row.share}%` as any }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <View className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm">
          <Text className="text-sm font-black uppercase tracking-wider">
            Performance par région
          </Text>
          <View className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { region: 'Grand Tunis', requests: 42, satisfaction: '98%' },
              { region: 'Sahel', requests: 26, satisfaction: '96%' },
              { region: 'Sfax', requests: 14, satisfaction: '94%' },
            ].map(row => (
              <View
                key={row.region}
                className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4"
              >
                <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {row.region}
                </Text>
                <Text className="mt-3 text-xl font-black text-slate-800 dark:text-white">
                  {row.requests}
                </Text>
                <Text className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {row.satisfaction} satisfaction
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm">
          <Text className="text-sm font-black uppercase tracking-wider">
            Alertes stock
          </Text>
          <View className="space-y-3 mt-6 text-xs font-semibold">
            {[
              'Robinetterie: 3 références à renouveler',
              'Chauffe-eau: forte demande cette semaine',
              'Vannes: marge moyenne +12%',
            ].map(item => (
              <View
                key={item}
                className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900 px-3 py-2 text-amber-700 dark:text-amber-300"
              >
                <Text>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminAnalyticsScreen;
