import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LogoSVG } from './LogoSVG';
import { Role, WebSessionUser } from '../utils/webTranslations';

interface WebNavbarProps {
  businessName: string;
  nextLanguage: string;
  currentTheme: string;
  currentRole: Role;
  sessionUser: WebSessionUser | null;
  activeTab: string;
  isRTL: boolean;
  galleryManageLabel: string;
  galleryTitle: string;
  t: any;
  setActiveTab: (tab: string) => void;
  setCurrentLang: (lang: any) => void;
  setCurrentTheme: (theme: any) => void;
  handleLogout: () => void;
  setBypassAuth: (bypass: boolean) => void;
  setSessionUser: (user: any) => void;
}

export const WebNavbar: React.FC<WebNavbarProps> = ({
  businessName,
  nextLanguage,
  currentTheme,
  currentRole,
  sessionUser,
  activeTab,
  isRTL,
  galleryManageLabel,
  galleryTitle,
  t,
  setActiveTab,
  setCurrentLang,
  setCurrentTheme,
  handleLogout,
  setBypassAuth,
  setSessionUser,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const isDark = currentTheme === 'dark';

  // Track scroll for shadow enhancement
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const adminLinks = [
    { id: 'AdminAccueil', label: tCommon('web.adminHome', 'Accueil'), icon: '🏠' },
    { id: 'GestionAnnonce', label: tCommon('web.manageAds', 'Annonces'), icon: '📢' },
    { id: 'GestionCategorie', label: tCommon('web.manageCategories', 'Catégories'), icon: '🗂️' },
    { id: 'AdminGallery', label: tCommon('web.gallery.manageGallery', galleryManageLabel), icon: '🖼️' },
    { id: 'AdminServices', label: tCommon('web.servicesLabel', 'Services'), icon: '🔧' },
    { id: 'GestionUser', label: tCommon('web.manageUsers', 'Membres'), icon: '👥' },
    { id: 'AdminProfile', label: tCommon('web.adminProfile', 'Profil'), icon: '👤' },
    { id: 'Analytics', label: tCommon('web.analyticsLabel', 'Analytics'), icon: '📊' },
  ];

  const userLinks = [
    { id: 'Accueil', label: t('web.accueil', { defaultValue: 'Accueil' }), icon: '🏠' },
    { id: 'Services', label: t('web.services', { defaultValue: 'Services' }), icon: '🔧' },
    { id: 'Zones', label: t('web.zones', { defaultValue: 'Zones' }), icon: '📍' },
    { id: 'Marketplace', label: t('web.pieces', { defaultValue: 'Marketplace' }), icon: '🛒' },
    { id: 'Gallery', label: galleryTitle, icon: '🖼️' },
    { id: 'Profile', label: t('web.mon_profil', { defaultValue: 'Mon profil' }), icon: '👤' },
  ];

  const links = currentRole === 'admin' ? adminLinks : userLinks;

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  /* ─── Inline style helpers for reliable web CSS ─── */
  const navStyle: React.CSSProperties = {
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
    boxShadow: scrolled
      ? isDark
        ? '0 4px 24px 0 rgba(0,0,0,0.45)'
        : '0 4px 24px 0 rgba(30,58,95,0.10)'
      : '0 1px 0 0 rgba(0,0,0,0.07)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    backgroundColor: isDark ? 'rgba(15,23,42,0.93)' : 'rgba(255,255,255,0.96)',
    borderBottom: isDark ? '1px solid rgba(51,65,85,0.6)' : '1px solid rgba(226,232,240,0.8)',
  };

  const barBase: React.CSSProperties = {
    display: 'block',
    width: 22,
    height: 2.5,
    borderRadius: 4,
    backgroundColor: isDark ? '#CBD5E1' : '#334155',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease',
    transformOrigin: 'center',
  };

  const bar1Style: React.CSSProperties = {
    ...barBase,
    transform: mobileOpen ? 'translateY(5.5px) rotate(45deg)' : 'none',
  };
  const bar2Style: React.CSSProperties = {
    ...barBase,
    opacity: mobileOpen ? 0 : 1,
  };
  const bar3Style: React.CSSProperties = {
    ...barBase,
    transform: mobileOpen ? 'translateY(-5.5px) rotate(-45deg)' : 'none',
  };

  const drawerStyle: React.CSSProperties = {
    overflow: 'hidden',
    maxHeight: mobileOpen ? 600 : 0,
    opacity: mobileOpen ? 1 : 0,
    transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
    backgroundColor: isDark ? '#0F172A' : '#ffffff',
    borderTop: isDark ? '1px solid rgba(51,65,85,0.6)' : '1px solid rgba(226,232,240,0.8)',
  };

  return (
    <>
      {/* ═══ NAVBAR ═══════════════════════════════════════════════════════ */}
      {/* @ts-ignore – web-only style prop */}
      <View style={navStyle}>

        {/* ── Top bar ── */}
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex flex-row items-center justify-between">

          {/* Logo */}
          <TouchableOpacity
            onPress={() =>
              setActiveTab(currentRole === 'admin' ? 'AdminAccueil' : 'Accueil')
            }
            className="flex flex-row items-center gap-3"
            accessibilityRole="button"
            accessibilityLabel={businessName}
          >
            <LogoSVG size={42} />
            <View>
              <Text
                className={`text-lg font-black tracking-tight leading-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                } ${isRTL ? 'font-arabic' : ''}`}
              >
                {businessName}
              </Text>
              <Text
                className="text-[9px] font-black tracking-widest uppercase leading-none"
                style={{ color: '#F97316' }}
              >
                {t('tagline', { defaultValue: 'Expert Plombier' })}
              </Text>
            </View>
          </TouchableOpacity>

          {/* ── Desktop Nav links (lg+) ── */}
          <View className="hidden lg:flex flex-row items-center gap-1">
            {links.map(link => {
              const isActive = activeTab === link.id;
              return (
                <TouchableOpacity
                  key={link.id}
                  onPress={() => setActiveTab(link.id)}
                  accessibilityRole="button"
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 10,
                    position: 'relative',
                    transition: 'background 0.18s',
                    backgroundColor: isActive
                      ? 'rgba(249,115,22,0.1)'
                      : 'transparent',
                  } as React.CSSProperties}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '800',
                      letterSpacing: 0.8,
                      textTransform: 'uppercase',
                      color: isActive
                        ? '#F97316'
                        : isDark
                        ? '#94A3B8'
                        : '#475569',
                      transition: 'color 0.18s',
                    } as React.CSSProperties}
                  >
                    {link.label}
                  </Text>
                  {isActive && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 10,
                        right: 10,
                        height: 2,
                        borderRadius: 2,
                        backgroundColor: '#F97316',
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Right controls ── */}
          <View className="flex flex-row items-center gap-2">

            {/* Language switcher */}
            <TouchableOpacity
              onPress={() => setCurrentLang(nextLanguage)}
              style={{
                minHeight: 36,
                minWidth: 44,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isDark ? '#334155' : '#E2E8F0',
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.18s',
              } as React.CSSProperties}
              accessibilityLabel={`Switch to ${nextLanguage}`}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  color: isDark ? '#CBD5E1' : '#475569',
                } as React.CSSProperties}
              >
                {nextLanguage}
              </Text>
            </TouchableOpacity>

            {/* Dark / light toggle */}
            <TouchableOpacity
              onPress={() => setCurrentTheme(isDark ? 'light' : 'dark')}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isDark ? '#334155' : '#E2E8F0',
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.18s',
              } as React.CSSProperties}
              accessibilityLabel={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              <Text style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            {/* Auth badge / logout — desktop only (hidden on mobile) */}
            <View className="hidden md:flex flex-row items-center gap-2">
              {currentRole === 'anonyme' ? (
                <TouchableOpacity
                  onPress={() => {
                    setBypassAuth(false);
                    setSessionUser(null);
                  }}
                  style={{
                    backgroundColor: '#1E3A5F',
                    paddingHorizontal: 16,
                    paddingVertical: 9,
                    borderRadius: 10,
                    transition: 'background 0.18s',
                  } as React.CSSProperties}
                >
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' } as React.CSSProperties}>
                    {tCommon('web.loginAction', "Connexion / S'inscrire")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="flex flex-row items-center gap-2">
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: isDark ? '#1E3A5F' : 'rgba(30,58,95,0.15)',
                      backgroundColor: isDark ? 'rgba(30,58,95,0.2)' : 'rgba(30,58,95,0.05)',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '800',
                        color: isDark ? '#38BDF8' : '#1E3A5F',
                      } as React.CSSProperties}
                    >
                      {sessionUser?.name} · {currentRole.toUpperCase()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleLogout}
                    style={{
                      backgroundColor: '#E11D48',
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      borderRadius: 10,
                      transition: 'background 0.18s',
                    } as React.CSSProperties}
                  >
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' } as React.CSSProperties}>
                      {tCommon('web.logoutAction', 'Déconnexion')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* ── Hamburger button — mobile/tablet only (lg:hidden) ── */}
            <TouchableOpacity
              onPress={() => setMobileOpen(prev => !prev)}
              className="lg:hidden"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: isDark ? '#334155' : '#E2E8F0',
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              } as React.CSSProperties}
              accessibilityLabel={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              accessibilityRole="button"
            >
              {/* 3 bars → animated X */}
              <View style={{ gap: 5, alignItems: 'center' }}>
                <View style={bar1Style} />
                <View style={bar2Style} />
                <View style={bar3Style} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Mobile drawer (slide-down) — hidden on lg+ ── */}
        {/* @ts-ignore */}
        <View className="lg:hidden" style={drawerStyle}>
          <View style={{ padding: 16, gap: 4 }}>
            {links.map(link => {
              const isActive = activeTab === link.id;
              return (
                <TouchableOpacity
                  key={link.id}
                  onPress={() => handleNav(link.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    borderRadius: 12,
                    gap: 12,
                    backgroundColor: isActive
                      ? 'rgba(249,115,22,0.10)'
                      : 'transparent',
                    transition: 'background 0.15s',
                    borderLeftWidth: isActive ? 3 : 0,
                    borderLeftColor: '#F97316',
                  } as React.CSSProperties}
                >
                  <Text style={{ fontSize: 18 }}>{link.icon}</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: isActive
                        ? '#F97316'
                        : isDark
                        ? '#CBD5E1'
                        : '#334155',
                    } as React.CSSProperties}
                  >
                    {link.label}
                  </Text>
                  {isActive && (
                    <View style={{ marginLeft: 'auto' }}>
                      <Text style={{ color: '#F97316', fontSize: 14 }}>›</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Auth row inside mobile drawer */}
            <View
              style={{
                marginTop: 12,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: isDark ? 'rgba(51,65,85,0.6)' : 'rgba(226,232,240,0.8)',
                gap: 10,
              }}
            >
              {currentRole === 'anonyme' ? (
                <TouchableOpacity
                  onPress={() => {
                    setBypassAuth(false);
                    setSessionUser(null);
                    setMobileOpen(false);
                  }}
                  style={{
                    backgroundColor: '#1E3A5F',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' } as React.CSSProperties}>
                    {tCommon('web.loginAction', "Connexion / S'inscrire")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{ gap: 10 }}>
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor: isDark ? 'rgba(30,58,95,0.2)' : 'rgba(30,58,95,0.06)',
                      borderWidth: 1,
                      borderColor: isDark ? '#1E3A5F' : 'rgba(30,58,95,0.15)',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: isDark ? '#38BDF8' : '#1E3A5F',
                      } as React.CSSProperties}
                    >
                      👤 {sessionUser?.name} — {currentRole.toUpperCase()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    style={{
                      backgroundColor: '#E11D48',
                      paddingVertical: 14,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' } as React.CSSProperties}>
                      {tCommon('web.logoutAction', 'Déconnexion')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default WebNavbar;
