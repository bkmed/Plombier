import React from 'react';
import { View, Text } from 'react-native';

interface AdminDashboardProps {
  businessName: string;
  products: any[];
  reduxCategories: any[];
  usersList: any[];
  t: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  businessName,
  products,
  reduxCategories,
  usersList,
  t,
}) => {
  const tCommon = (
    key: string,
    defaultValue: string,
    options?: Record<string, any>,
  ) => t(key, { defaultValue, ...options });

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <Text className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
        {tCommon('admin.dashboardTitle', 'Admin dashboard')}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
        {tCommon(
          'admin.dashboardDescription',
          `View current activity metrics and stock status for ${businessName}.`,
          { businessName },
        )}
      </Text>

      {/* Metrics cards row */}
      <View className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[
          {
            title: tCommon('admin.activeListingsTitle', 'Active listings'),
            val: products.length,
            desc: tCommon('admin.activeListingsDesc', 'Spare parts in catalog'),
            color: 'border-l-4 border-blue-500',
          },
          {
            title: tCommon('admin.categoriesTitle', 'Available categories'),
            val: reduxCategories.length,
            desc: tCommon('admin.categoriesDesc', 'Product families'),
            color: 'border-l-4 border-amber-500',
          },
          {
            title: tCommon('admin.registeredUsersTitle', 'Registered users'),
            val: usersList.length,
            desc: tCommon('admin.registeredUsersDesc', 'Accounts created'),
            color: 'border-l-4 border-emerald-500',
          },
          {
            title: tCommon('admin.leadsTitle', 'Incoming service requests'),
            val: 12,
            desc: tCommon('admin.leadsDesc', 'Urgent intervention needs'),
            color: 'border-l-4 border-rose-500',
          },
        ].map((m, idx) => (
          <View
            key={idx}
            className={`bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm ${m.color}`}
          >
            <Text className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {m.title}
            </Text>
            <Text className="text-3xl font-black text-slate-800 dark:text-white mt-2 leading-none">
              {m.val}
            </Text>
            <Text className="text-[10px] text-slate-400 mt-2 font-semibold">
              {m.desc}
            </Text>
          </View>
        ))}
      </View>

      {/* Activity Ledgers / System logs */}
      <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm mt-10">
        <Text className="text-base font-black text-slate-800 dark:text-white mb-6">
          {tCommon('admin.recentActivityTitle', 'Recent admin action history')}
        </Text>

        <View className="space-y-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {[
            {
              log: tCommon(
                'admin.activityIntervention',
                'Ahmed Ben Ali (user@demo.com) requested an urgent plumbing intervention in Ariana.',
              ),
              time: 'Il y a 5 minutes',
              badge: tCommon('admin.badgeIntervention', 'Intervention'),
              color:
                'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
            },
            {
              log: tCommon(
                'admin.activityCatalog',
                'New spare part added: Grohe kitchen mixer is now in the catalog.',
              ),
              time: 'Il y a 20 minutes',
              badge: tCommon('admin.badgeCatalog', 'Catalog'),
              color:
                'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
            },
            {
              log: tCommon(
                'admin.activityCategory',
                "Category 'Water Pumps' created by Admin.",
              ),
              time: 'Il y a 2 heures',
              badge: tCommon('admin.badgeCategory', 'Category'),
              color:
                'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
            },
            {
              log: tCommon(
                'admin.activityUser',
                'User role for user@demo.com was updated to client.',
              ),
              time: 'Il y a 1 jour',
              badge: tCommon('admin.badgeUser', 'User'),
              color:
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
            },
          ].map((l, idx) => (
            <View
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3 last:border-b-0 last:pb-0"
            >
              <View className="flex items-center gap-3">
                <Text
                  className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                    l.badge === 'Intervention'
                      ? 'bg-rose-100 text-rose-600'
                      : l.badge === 'Catalogue'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {l.badge}
                </Text>
                <Text className="text-slate-800 dark:text-slate-200">
                  {l.log}
                </Text>
              </View>
              <Text className="text-[10px] text-slate-400 whitespace-nowrap">
                {l.time}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
export default AdminDashboard;
