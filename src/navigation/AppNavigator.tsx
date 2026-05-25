import React, { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { enableScreens } from 'react-native-screens';

if (Platform.OS === 'web') {
  enableScreens(false);
}

import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';

// Import all Plombier screens
import WebAuthScreen from '../features/plombier/screens/WebAuthScreen';
import HomeScreenWeb from '../features/plombier/screens/HomeScreen.web';
import ProfileScreenWeb from '../features/plombier/screens/ProfileScreen.web';
import GalleryScreen from '../features/plombier/screens/GalleryScreen';
import MarketplaceScreen from '../features/plombier/screens/MarketplaceScreen';
import AdminProfileScreen from '../features/plombier/screens/AdminProfileScreen';
import AdminAnalyticsScreen from '../features/plombier/screens/AdminAnalyticsScreen';
import AdminGalleryEditor from '../features/plombier/screens/AdminGalleryEditor';
import AdminServicesEditor from '../features/plombier/screens/AdminServicesEditor';
import ZonesScreen from '../features/plombier/screens/ZonesScreen';
import LegalPages from '../features/plombier/screens/LegalPages';
import MarketplaceServices from '../features/plombier/screens/MarketplaceServices';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootState } from '../store';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  const uiState = useSelector((state: RootState) => state.ui);
  const { currentTheme, bypassAuth } = uiState;
  
  const { user: authUser, isLoading: authLoading } = useAuth();
  const { sessionUser, currentRole } = useSelector(
    (state: RootState) => (state as any).webSession || {},
  );

  const isAuthenticated = (authUser || sessionUser) && !bypassAuth;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: Platform.OS !== 'web',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Group
            screenOptions={{
              animationEnabled: Platform.OS !== 'web',
            }}
          >
            <Stack.Screen
              name="Auth"
              component={WebAuthScreen}
              options={{ animationEnabled: false }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreenWeb} />
            <Stack.Screen name="Profile" component={ProfileScreenWeb} />
            <Stack.Screen name="Gallery" component={GalleryScreen} />
            <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
            <Stack.Screen name="Services" component={MarketplaceServices} />
            <Stack.Screen name="Informations" component={LegalPages} />
            <Stack.Screen name="Politique" component={LegalPages} />
            <Stack.Screen name="Conditions" component={LegalPages} />
            <Stack.Screen name="PlanSite" component={LegalPages} />
            
            {currentRole === 'admin' && (
              <>
                <Stack.Screen name="AdminAccueil" component={HomeScreenWeb} />
                <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
                <Stack.Screen name="AdminGallery" component={AdminGalleryEditor} />
                <Stack.Screen name="AdminAnnouncements" component={AdminServicesEditor} />
                <Stack.Screen name="AdminZones" component={ZonesScreen} />
                <Stack.Screen name="AdminAnalytics" component={AdminAnalyticsScreen} />
              </>
            )}
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
