import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectTotalPageViews,
  selectTotalShares,
  selectCallClicks,
  selectPageViews,
} from '../../../store/slices/analyticsSlice';
import { selectAllCategories } from '../../../store/slices/categoriesSlice';
import { selectAllUsers } from '../../../store/slices/usersSlice';
import { selectGalleryItems } from '../../../store/slices/gallerySlice';
import { selectServices } from '../../../store/slices/servicesSlice';

interface AdminDashboardProps {
  businessName: string;
  products: any[];
  t: any;
  setActiveTab?: (tab: string) => void;
}

const NavButton = ({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.navButton,
      Platform.OS === 'web' && styles.navButtonWeb,
      pressed && styles.navButtonPressed,
      style,
    ]}
  >
    {children}
  </Pressable>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  businessName,
  products,
  t,
  setActiveTab,
}) => {
  const tCommon = (
    key: string,
    defaultValue: string,
    options?: Record<string, any>,
  ) => t(key, { defaultValue, ...options });

  const nav = (tab: string) => () => setActiveTab && setActiveTab(tab);

  // Selectors for other modules
  const categories = useSelector(selectAllCategories) || [];
  const users = useSelector(selectAllUsers) || [];
  const galleryItems = useSelector(selectGalleryItems) || [];
  const services = useSelector(selectServices) || [];

  // Analytics
  const totalViews = useSelector(selectTotalPageViews);
  const totalShares = useSelector(selectTotalShares);
  const callClicks = useSelector(selectCallClicks);
  const pageViewsMap = useSelector(selectPageViews) || {};

  const overviewCards = [
    {
      title: tCommon('adminAnnonces.title', 'Annonces'),
      count: products.length,
      desc: tCommon('admin.activeListingsDesc', 'Fiches dans le catalogue'),
      icon: '📦',
      bg: '#EFF6FF',
      countColor: '#2563EB',
      tab: 'GestionAnnonce',
    },
    {
      title: tCommon('admin.categoriesTitle', 'Catégories'),
      count: categories.length,
      desc: tCommon('admin.categoriesDesc', 'Familles de produits'),
      icon: '🗂️',
      bg: '#F5F3FF',
      countColor: '#7C3AED',
      tab: 'GestionCategorie',
    },
    {
      title: tCommon('webServices.services_title', 'Services'),
      count: services.length,
      desc: "Services d'interventions",
      icon: '🔧',
      bg: '#FFFBEB',
      countColor: '#D97706',
      tab: 'AdminServices',
    },
    {
      title: tCommon('admin.registeredUsersTitle', 'Utilisateurs'),
      count: users.length,
      desc: tCommon('admin.registeredUsersDesc', 'Membres inscrits'),
      icon: '👥',
      bg: '#ECFDF5',
      countColor: '#059669',
      tab: 'GestionUser',
    },
    {
      title: tCommon('gallery.title', 'Galerie'),
      count: galleryItems.length,
      desc: 'Photos de réalisations',
      icon: '🖼️',
      bg: '#FFF1F2',
      countColor: '#E11D48',
      tab: 'AdminGallery',
    },
  ];

  const quickActions = [
    {
      id: 'GestionAnnonce',
      label: tCommon('admin.manageProducts', 'Gérer les Annonces'),
      desc: 'Créez de nouvelles fiches produits et gérez les disponibilités.',
      icon: '📢',
      gradientFrom: '#3B82F6',
      gradientTo: '#06B6D4',
    },
    {
      id: 'GestionCategorie',
      label: tCommon('admin.manageCategories', 'Gérer les Catégories'),
      desc: 'Organisez vos familles de produits et pièces.',
      icon: '🗂️',
      gradientFrom: '#A855F7',
      gradientTo: '#6366F1',
    },
    {
      id: 'AdminServices',
      label: 'Gérer les Services',
      desc: "Modifiez les services proposés et les illustrations avant/après.",
      icon: '🔧',
      gradientFrom: '#F59E0B',
      gradientTo: '#F97316',
    },
    {
      id: 'GestionUser',
      label: tCommon('web.manageUsers', 'Gérer les Utilisateurs'),
      desc: 'Gérez les comptes membres, mettez à jour les rôles et permissions.',
      icon: '👥',
      gradientFrom: '#10B981',
      gradientTo: '#14B8A6',
    },
    {
      id: 'AdminGallery',
      label: 'Gérer la Galerie',
      desc: 'Ajoutez, modifiez ou supprimez des photos de réalisations.',
      icon: '🖼️',
      gradientFrom: '#EC4899',
      gradientTo: '#F43F5E',
    },
    {
      id: 'AdminProfile',
      label: tCommon('admin.adminProfileTitle', 'Identité & Profil'),
      desc: 'Configurez le nom du site, contact WhatsApp et sécurité.',
      icon: '⚙️',
      gradientFrom: '#475569',
      gradientTo: '#1E293B',
    },
    {
      id: 'Analytics',
      label: tCommon('admin.globalAnalytics', 'Statistiques Détaillées'),
      desc: "Visualisez les graphiques de visites, taux d'engagement et partages.",
      icon: '📈',
      gradientFrom: '#4F46E5',
      gradientTo: '#7C3AED',
    },
  ];

  return (
    <View style={styles.container}>

      {/* Hero Welcome Banner */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <View style={styles.heroPulse} />
          <Text style={styles.heroBadgeText}>
            {tCommon('admin.adminConsole', "Console d'Administration")}
          </Text>
        </View>
        <Text style={styles.heroTitle}>
          {tCommon('common.welcome', 'Bienvenue')},{' '}
          {tCommon('admin.defaultAdminName', 'Admin')} 👋
        </Text>
        <Text style={styles.heroSubtitle}>
          {t('admin.dashboardDescription', {
            defaultValue: `Gérez l'activité globale, le catalogue et les configurations pour ${businessName}.`,
            businessName,
          })}
        </Text>
      </View>

      {/* Overview Stats Grid */}
      <Text style={styles.sectionTitle}>
        {tCommon('admin.status', "Vue d'Ensemble")}
      </Text>
      <View style={styles.overviewGrid}>
        {overviewCards.map((item, idx) => (
          <NavButton key={idx} onPress={nav(item.tab)} style={styles.overviewCard}>
            <View style={styles.overviewCardTop}>
              <View style={[styles.overviewIconBg, { backgroundColor: item.bg }]}>
                <Text style={styles.overviewIcon}>{item.icon}</Text>
              </View>
              <Text style={[styles.overviewCount, { color: item.countColor }]}>
                {item.count}
              </Text>
            </View>
            <Text style={styles.overviewCardTitle}>{item.title}</Text>
            <Text style={styles.overviewCardDesc}>{item.desc}</Text>
          </NavButton>
        ))}
      </View>

      <View style={styles.bottomGrid}>

        {/* Quick Actions */}
        <View style={styles.actionsPanel}>
          <Text style={styles.sectionTitle}>
            {tCommon('admin.quickActions', 'Raccourcis de Gestion')}
          </Text>
          <View style={styles.actionsCard}>
            {quickActions.map(action => (
              <NavButton
                key={action.id}
                onPress={nav(action.id)}
                style={styles.actionRow}
              >
                <View
                  style={[
                    styles.actionIconBg,
                    { backgroundColor: action.gradientFrom },
                  ]}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.actionDesc}>{action.desc}</Text>
                </View>
                <Text style={styles.actionArrow}>›</Text>
              </NavButton>
            ))}
          </View>
        </View>

        {/* Activity Panel */}
        <View style={styles.activityPanel}>
          <Text style={styles.sectionTitle}>
            {tCommon('admin.globalAnalytics', 'Activité & Trafic')}
          </Text>
          <View style={styles.activityCard}>
            {/* Quick metric pills */}
            <View style={styles.metricsRow}>
              {[
                { label: 'Vues', value: totalViews },
                { label: 'Partages', value: totalShares },
                { label: 'Appels', value: callClicks },
              ].map((m, i) => (
                <View key={i} style={styles.metricPill}>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                  <Text style={styles.metricValue}>{m.value}</Text>
                </View>
              ))}
            </View>

            {/* Top pages */}
            <Text style={styles.subSectionTitle}>
              {tCommon('admin.viewedPagesDetailTitle', 'Pages les plus consultées')}
            </Text>
            {Object.entries(pageViewsMap).length === 0 ? (
              <Text style={styles.emptyText}>
                {tCommon('admin.noPageViewsData', 'Aucune page consultée pour le moment.')}
              </Text>
            ) : (
              Object.entries(pageViewsMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([page, views], idx) => (
                  <View key={idx} style={styles.pageRow}>
                    <Text style={styles.pageName} numberOfLines={1}>{page}</Text>
                    <Text style={styles.pageViews}>
                      {views} {tCommon('admin.viewsCount', 'vue(s)')}
                    </Text>
                  </View>
                ))
            )}

            {/* Analytics link */}
            <NavButton onPress={nav('Analytics')} style={styles.analyticsBtn}>
              <Text style={styles.analyticsBtnText}>
                {tCommon('admin.globalAnalytics', 'Statistiques Détaillées')} →
              </Text>
            </NavButton>
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 1280,
    marginHorizontal: 'auto' as any,
    paddingHorizontal: 24,
    paddingVertical: 40,
    width: '100%',
  },
  hero: {
    backgroundColor: '#3730A3',
    borderRadius: 24,
    padding: 40,
    marginBottom: 40,
    overflow: 'hidden',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  heroPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
    marginRight: 8,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
  },
  heroSubtitle: {
    color: '#C7D2FE',
    fontSize: 15,
    fontWeight: '500',
    maxWidth: 600,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#475569',
    marginBottom: 14,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 40,
  },
  overviewCard: {
    flexBasis: '18%',
    minWidth: 140,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  overviewIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewIcon: { fontSize: 18 },
  overviewCount: {
    fontSize: 26,
    fontWeight: '900',
  },
  overviewCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 3,
  },
  overviewCardDesc: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    lineHeight: 14,
  },
  bottomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    alignItems: 'flex-start',
  },
  actionsPanel: {
    flex: 2,
    minWidth: 300,
  },
  activityPanel: {
    flex: 1,
    minWidth: 260,
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 2,
  },
  actionIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionIcon: { fontSize: 20 },
  actionText: { flex: 1 },
  actionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    lineHeight: 16,
  },
  actionArrow: {
    fontSize: 22,
    color: '#CBD5E1',
    fontWeight: '700',
    marginLeft: 10,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricPill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
  },
  subSectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#64748B',
    marginBottom: 8,
  },
  pageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pageName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
    marginRight: 8,
  },
  pageViews: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6366F1',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  analyticsBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  analyticsBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
  },
  navButton: {
    cursor: 'pointer' as any,
  },
  navButtonWeb: {
    // Additional web-specific styles if needed
  },
  navButtonPressed: {
    opacity: 0.7,
  },
});

export default AdminDashboard;
