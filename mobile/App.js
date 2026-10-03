import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import JobsScreen from './src/screens/JobsScreen';
import WorkersScreen from './src/screens/WorkersScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import PaymentsScreen from './src/screens/PaymentsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'workers', label: 'Workers' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'payments', label: 'Payments' },
  { key: 'settings', label: 'Settings' },
];

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  const handleAuth = (sessionUser) => {
    setUser(sessionUser);
    setScreen('app');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    setScreen('login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return <JobsScreen />;
      case 'workers':
        return <WorkersScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'payments':
        return <PaymentsScreen />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;
      case 'dashboard':
      default:
        return <DashboardScreen user={user} />;
    }
  };

  if (screen === 'splash') {
    return <SplashScreen onReady={() => setScreen(user ? 'app' : 'login')} />;
  }

  if (screen === 'login') {
    return <LoginScreen onAuth={handleAuth} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>BuildMate</Text>
        <Text style={styles.roleBadge}>{user?.role || 'WORKER'}</Text>
      </View>

      <View style={styles.content}>{renderTabContent()}</View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#064F8B',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  roleBadge: {
    backgroundColor: '#0F7BBD',
    color: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontWeight: '700',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    minWidth: 90,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    margin: 4,
  },
  tabButtonActive: {
    backgroundColor: '#E0F2FE',
  },
  tabText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#064F8B',
  },
});
