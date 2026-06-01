import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RootState } from '../store';
import {
  setActiveTab as setActiveTabAction,
  setCurrentLang as setCurrentLangAction,
  setCurrentTheme as setCurrentThemeAction,
  setBypassAuth as setBypassAuthAction,
} from '../store/slices/uiSlice';
import {
  setSessionUser,
  setCurrentRole,
  clearSession,
} from '../store/slices/webSessionSlice';
import { addCategory } from '../store/slices/categoriesSlice';
import { setServices } from '../store/slices/servicesSlice';
import { initialWebCategories, initialWebServices } from './webData';
import { renderWebScreen } from './webScreenMap';
import { toggleFavoriteAction } from '../store/slices/partsSlice';

// Shared Components & Screens
import { WebSplashScreen } from '../features/plombier/components/WebSplashScreen';
import { WebAuthScreen } from '../features/plombier/screens/WebAuthScreen';
import { WebNavbar } from '../features/plombier/components/WebNavbar';
import { WebFooter } from '../features/plombier/components/WebFooter';
import { ProductDetailModal } from '../features/plombier/components/ProductDetailModal';

import {
  Role,
  WebSessionUser,
} from '../features/plombier/utils/webTranslations';
import { User } from '../services/authService';

const WebAppNavigator = () => {
  const { user: authUser, signIn, signOut } = useAuth();
  const { showToast } = useToast();
  const { t: translate, i18n } = useTranslation();

  const dispatch = useDispatch();
  const products = useSelector(
    (state: RootState) => state.parts?.listings || [],
  );
  const favorites = useSelector(
    (state: RootState) => state.parts?.favorites || [],
  );
  const reduxCategories = useSelector(
    (state: RootState) => state.categories?.items || [],
  );
  const usersList = useSelector((state: RootState) => state.users?.items || []);
  const galleryItems = useSelector(
    (state: RootState) => state.gallery?.items || [],
  );
  const plombierSettings =
    useSelector((state: RootState) => state.plombierSettings) || ({} as any);
  const uiState = useSelector((state: RootState) => state.ui) || ({} as any);
  const {
    currentLang = 'FR',
    currentTheme = 'light',
    activeTab = 'Accueil',
    bypassAuth = false,
  } = uiState;

  const { sessionUser, currentRole } =
    useSelector((state: RootState) => (state as any).webSession) || {};

  // Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const galleryTitle = translate('web.gallery.title', {
    defaultValue: 'Galerie',
  });
  const galleryManageLabel = translate('web.gallery.manageGallery', {
    defaultValue: 'Gérer la galerie',
  });
  const isRTL = i18n.language === 'ar';
  const businessName = plombierSettings.businessName || 'Plombier Tunisie';
  const experienceYears = plombierSettings.experienceYears || 15;
  const dispoVal =
    plombierSettings.dispoVal ||
    translate('web.dispo_val', { defaultValue: '24/7' });
  const govVal =
    plombierSettings.govVal || translate('web.gov_val', { defaultValue: '24' });
  const languageOrder: Array<'FR' | 'AR' | 'EN'> = ['FR', 'AR', 'EN'];
  const nextLanguage =
    languageOrder[
      (languageOrder.indexOf(currentLang) + 1) % languageOrder.length
    ];

  const profileName = sessionUser?.name || '';
  const profileEmail = sessionUser?.email || '';
  const profilePhone = sessionUser?.phone || '';
  const profileCity = sessionUser?.city || '';

  const supportEmail =
    plombierSettings.supportEmail || profileEmail || sessionUser?.email || '';
  const supportWhatsAppNumber =
    plombierSettings.supportPhone || profilePhone || sessionUser?.phone || '';
  const supportWhatsAppDigits = supportWhatsAppNumber.replace(/\D/g, '');
  const tCommon = (key: string, defaultValue: string) =>
    translate(key, { defaultValue });

  const setActiveTab = (tab: string) => dispatch(setActiveTabAction(tab));
  const setCurrentLang = (lang: 'FR' | 'AR' | 'EN') =>
    dispatch(setCurrentLangAction(lang));
  const setCurrentTheme = (theme: 'light' | 'dark') =>
    dispatch(setCurrentThemeAction(theme));
  const setBypassAuth = (value: boolean) =>
    dispatch(setBypassAuthAction(value));

  const startWebSession = async (userData: WebSessionUser, tab: string) => {
    dispatch(setSessionUser(userData));
    dispatch(setCurrentRole(userData.role as Role));
    setBypassAuth(true);
    setActiveTab(tab);
    await signIn(userData as unknown as User);
  };

  const handleLogout = async () => {
    dispatch(clearSession());
    setBypassAuth(false);
    setActiveTab('Accueil');
    await signOut();
    showToast(
      tCommon('web.logoutSuccess', 'Déconnexion réussie ! A bientôt.'),
      'info',
    );
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentRole === 'anonyme') {
      showToast(
        tCommon(
          'web.favoriteLoginRequired',
          'Veuillez vous connecter pour gérer vos favoris.',
        ),
        'info',
      );
      return;
    }
    dispatch(toggleFavoriteAction(id));
    if (favorites.includes(id)) {
      showToast(tCommon('web.favoriteRemoved', 'Retiré des favoris'), 'info');
    } else {
      showToast(
        tCommon('web.favoriteAdded', 'Ajouté aux favoris !'),
        'success',
      );
    }
  };

  // Seed initial web state only on web
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (reduxCategories.length === 0) {
      initialWebCategories.forEach(cat => dispatch(addCategory(cat)));
    }
    const servicesSeeded = (window as any).__initialServicesSeeded;
    if (!servicesSeeded) {
      dispatch(setServices(initialWebServices));
      (window as any).__initialServicesSeeded = true;
    }
  }, [reduxCategories, dispatch]);

  useEffect(() => {
    i18n.changeLanguage(currentLang.toLowerCase());
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang, i18n]);

  useEffect(() => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 22 + 9;
      if (prog >= 100) {
        prog = 100;
        setLoadingProgress(100);
        clearInterval(interval);
        setTimeout(() => setShowSplash(false), 450);
      } else {
        setLoadingProgress(Math.round(prog));
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!authUser) {
      dispatch(clearSession());
      setBypassAuth(true);
      setActiveTab('Accueil');
      return;
    }
    const restoredUser: WebSessionUser = {
      ...authUser,
      role: authUser.role as Role,
      city: authUser.addresses?.[0] || 'Tunis',
      status: authUser.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(setSessionUser(restoredUser));
    dispatch(setCurrentRole(restoredUser.role as Role));
    setBypassAuth(true);
    if (!sessionUser) {
      setActiveTab(restoredUser.role === 'admin' ? 'AdminAccueil' : 'Accueil');
    }
  }, [authUser]);

  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  useEffect(() => {
    document.title = businessName ? `${businessName} | Plombier` : 'Plombier';
  }, [businessName]);

  const activeScreen = renderWebScreen({
    activeTab,
    nextLanguage,
    experienceYears,
    dispoVal,
    govVal,
    supportWhatsAppDigits,
    galleryItems,
    products,
    favorites,
    translate,
    setActiveTab,
    setSelectedProduct,
    toggleFavorite,
    supportWhatsAppNumber,
    interventionZones: plombierSettings.interventionZones || [],
    usersList,
    reduxCategories,
    currentRole,
    currentLang,
    businessName,
    profileName,
    profileEmail,
    profilePhone,
    profileCity,
    showToast,
    setBypassAuth,
    setSigninEmail: () => {},
    setSigninPassword: () => {},
  });

  return (
    <View
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        currentTheme === 'dark'
          ? 'bg-[#0B0F19] text-slate-100'
          : 'bg-slate-50 text-slate-800'
      }`}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <WebSplashScreen
        showSplash={showSplash}
        loadingProgress={loadingProgress}
        businessName={businessName}
        t={translate}
      />

      {!bypassAuth && !sessionUser && (
        <WebAuthScreen
          businessName={businessName}
          nextLanguage={nextLanguage}
          currentTheme={currentTheme}
          setCurrentLang={setCurrentLang}
          setCurrentTheme={setCurrentTheme}
          t={translate}
          showToast={showToast}
          startWebSession={startWebSession}
          setBypassAuth={setBypassAuth}
          setCurrentRole={role => dispatch(setCurrentRole(role))}
          setSessionUser={user => dispatch(setSessionUser(user))}
          setActiveTab={setActiveTab}
        />
      )}

      {(bypassAuth || sessionUser) && (
        <WebNavbar
          businessName={businessName}
          nextLanguage={nextLanguage}
          currentTheme={currentTheme}
          currentRole={currentRole}
          sessionUser={sessionUser}
          activeTab={activeTab}
          isRTL={isRTL}
          galleryManageLabel={galleryManageLabel}
          galleryTitle={galleryTitle}
          t={translate}
          setActiveTab={setActiveTab}
          setCurrentLang={setCurrentLang}
          setCurrentTheme={setCurrentTheme}
          handleLogout={handleLogout}
          setBypassAuth={setBypassAuth}
          setSessionUser={user => dispatch(setSessionUser(user))}
        />
      )}

      {(bypassAuth || sessionUser) && (
        <View className="min-h-[calc(100vh-280px)] bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-100 transition-colors duration-300">
          {activeScreen}
        </View>
      )}

      <ProductDetailModal
        selectedProduct={selectedProduct}
        supportWhatsAppDigits={supportWhatsAppDigits}
        t={translate}
        setSelectedProduct={setSelectedProduct}
      />

      {(bypassAuth || sessionUser) && (
        <WebFooter
          businessName={businessName}
          currentTheme={currentTheme}
          currentRole={currentRole}
          supportWhatsAppDigits={supportWhatsAppDigits}
          supportWhatsAppNumber={supportWhatsAppNumber}
          supportEmail={supportEmail}
          t={translate}
          setActiveTab={setActiveTab}
        />
      )}
    </View>
  );
};

const MobileAppNavigator = () => (
  <View style={styles.mobileContainer}>
    <Text style={styles.mobileTitle}>Plombier mobile</Text>
    <Text style={styles.mobileBody}>
      Le même fichier `AppNavigator.tsx` gère maintenant à la fois web et
      mobile.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  mobileTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  mobileBody: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export const AppNavigator = () =>
  Platform.OS === 'web' ? <WebAppNavigator /> : <MobileAppNavigator />;

export default AppNavigator;
