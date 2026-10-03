import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen({ onReady }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onReady?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>BuildMate</Text>
      <Text style={styles.subtitle}>Build Faster. Manage Smarter.</Text>
      <ActivityIndicator size="large" color="#064F8B" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 28,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563',
  },
  loader: {
    marginTop: 22,
  },
});
