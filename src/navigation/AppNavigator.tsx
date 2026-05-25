import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { enableScreens } from 'react-native-screens';
if (Platform.OS === 'web') {
  enableScreens(false);
}

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { sessionService } from '../services/sessionService';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { HistoryScreen } from '../screens/wallet/HistoryScreen';
import { ReportsScreen } from '../screens/wallet/ReportsScreen';
import { AccountsScreen } from '../screens/wallet/AccountsScreen';
import { GoalsScreen } from '../screens/wallet/GoalsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { LegalScreen } from '../screens/legal/LegalScreen';
import { AddTransactionSheet } from '../screens/wallet/modals/AddTransactionSheet';
import { AddGoalModal } from '../screens/wallet/modals/AddGoalModal';
import { AddAccountModal } from '../screens/wallet/modals/AddAccountModal';
import { EditShortcutModal } from '../screens/wallet/modals/EditShortcutModal';

const Auth = createNativeStackNavigator();
const Root = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const WALLET_TABS = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'home',
    label: 'navigation.home',
  },
  {
    name: 'History',
    component: HistoryScreen,
    icon: 'receipt-long',
    label: 'history.title',
  },
  {
    name: 'Reports',
    component: ReportsScreen,
    icon: 'analytics',
    label: 'reports.title',
  },
  {
    name: 'Accounts',
    component: AccountsScreen,
    icon: 'account-balance-wallet',
    label: 'accounts.title',
  },
  {
    name: 'Goals',
    component: GoalsScreen,
    icon: 'track-changes',
    label: 'goals.title',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: 'person',
    label: 'profile.title',
  },
] as const;

const AuthStack = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      animation: Platform.OS === 'web' ? 'none' : 'default',
    }}
  >
    <Auth.Screen name="Login" component={LoginScreen} />
    <Auth.Screen name="SignUp" component={SignUpScreen} />
    <Auth.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Auth.Navigator>
);

const WebNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => {
        const item = WALLET_TABS.find(tab => tab.name === route.name);
        return {
          headerShown: false,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            position: 'absolute',
            left: 24,
            right: 24,
            bottom: 20,
            height: 72,
            backgroundColor: 'rgba(248,249,255,0.92)',
            borderTopWidth: 0,
            borderRadius: 24,
            paddingBottom: 10,
            paddingTop: 10,
            boxShadow: '0 -12px 40px rgba(0,0,0,0.06)',
          } as any,
          tabBarItemStyle: {
            borderRadius: 18,
            marginHorizontal: 4,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '800',
            textTransform: 'uppercase',
          },
          tabBarIcon: ({ color, focused, size }) => (
            <View
              className={
                focused ? 'rounded-2xl bg-primary px-3 py-2' : 'px-3 py-2'
              }
            >
              <MaterialIcons
                name={item?.icon || 'circle'}
                size={size}
                color={color}
              />
            </View>
          ),
        };
      }}
    >
      {WALLET_TABS.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ title: t(tab.label) }}
        />
      ))}
    </Tabs.Navigator>
  );
};

const DrawerNavigator = () => {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      screenOptions={({ route }) => {
        const item = WALLET_TABS.find(tab => tab.name === route.name);
        return {
          headerShown: false,
          drawerActiveTintColor: '#005994',
          drawerInactiveTintColor: '#404751',
          drawerStyle: { backgroundColor: '#f8f9ff', width: 292 },
          drawerLabelStyle: { fontWeight: '800' },
          drawerIcon: ({ color, size }) => (
            <MaterialIcons
              name={item?.icon || 'circle'}
              size={size}
              color={color}
            />
          ),
        };
      }}
    >
      {WALLET_TABS.map(tab => (
        <Drawer.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ title: t(tab.label) }}
        />
      ))}
    </Drawer.Navigator>
  );
};

const WalletShell = () => {
  const Shell = Platform.OS === 'web' ? WebNavigator : DrawerNavigator;

  return (
    <Root.Navigator
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'web' ? 'none' : 'default',
      }}
    >
      <Root.Screen name="WalletTabs" component={Shell} />
      <Root.Screen name="LegalScreen" component={LegalScreen} />
      <Root.Screen
        name="AddTransactionSheet"
        component={AddTransactionSheet}
        options={{ presentation: 'transparentModal' }}
      />
      <Root.Screen
        name="AddGoalModal"
        component={AddGoalModal}
        options={{ presentation: 'modal' }}
      />
      <Root.Screen
        name="AddAccountModal"
        component={AddAccountModal}
        options={{ presentation: 'modal' }}
      />
      <Root.Screen
        name="EditShortcutModal"
        component={EditShortcutModal}
        options={{ presentation: 'modal' }}
      />
    </Root.Navigator>
  );
};

const BlockedAccount = ({
  status,
  onLogout,
}: {
  status: string;
  onLogout: () => void;
}) => (
  <View className="flex-1 items-center justify-center bg-background px-6">
    <Text className="mb-3 text-5xl">🚫</Text>
    <Text className="text-center font-headline text-xl font-extrabold text-on-surface">
      {status === 'pending' ? 'Account Pending' : 'Account Rejected'}
    </Text>
    <Text className="mt-2 text-center font-body text-sm text-on-surface-variant">
      {status === 'pending'
        ? 'Your account is currently under review.'
        : 'Your account access has been restricted.'}
    </Text>
    <TouchableOpacity
      className="mt-6 rounded-xl bg-primary px-5 py-3"
      onPress={onLogout}
    >
      <Text className="font-label text-xs font-extrabold uppercase text-on-primary">
        Logout
      </Text>
    </TouchableOpacity>
  </View>
);

const AppStack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user, isLoading, signOut } = useAuth();
  const { theme } = useTheme();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
      primary: '#005994',
      card: '#f8f9ff',
      text: theme.colors.text,
      border: '#c0c7d2',
      notification: '#bc000d',
    },
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="font-body text-on-surface-variant">Loading...</Text>
      </View>
    );
  }

  if (user?.status && user.status !== 'active') {
    return <BlockedAccount status={user.status} onLogout={() => signOut()} />;
  }

  return (
    <NavigationContainer
      theme={navigationTheme}
      onStateChange={() => sessionService.updateLastActivity()}
    >
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'web' ? 'none' : 'default',
        }}
      >
        {user ? (
          <AppStack.Screen name="MainApp" component={WalletShell} />
        ) : (
          <AppStack.Screen name="AuthFlow" component={AuthStack} />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};
