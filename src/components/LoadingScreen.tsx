import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../theme';
import { store } from '../store';

export const LoadingScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [businessName, setBusinessName] = useState(() => {
    return store.getState()?.plombierSettings?.businessName || 'Plombier';
  });

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const currentBusinessName = state?.plombierSettings?.businessName || 'Plombier';
      setBusinessName(currentBusinessName);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../public/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.businessName}>
          {businessName}
        </Text>
      </View>
      <ActivityIndicator size="large" color="#005994" style={styles.spinner} />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: theme.spacing.m,
    },
    businessName: {
      ...theme.textVariants.header,
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    spinner: {
      marginTop: theme.spacing.m,
    },
  });
