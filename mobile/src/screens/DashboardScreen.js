import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { dashboardApi } from '../api/client';

export default function DashboardScreen({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.analytics();
        setData(response);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#064F8B" /></View>;
  }

  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }

  const stats = [
    { label: 'Total jobs', value: data?.totalJobs ?? 0 },
    { label: 'Workers', value: data?.totalWorkers ?? 0 },
    { label: 'Volume', value: `$${Number(data?.totalPaymentVolume || 0).toLocaleString()}` },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Welcome, {user?.name || 'Builder'}</Text>
      <Text style={styles.headerSubtitle}>{user?.role || 'WORKER'} workspace</Text>

      <View style={styles.grid}>
        {stats.map((item) => (
          <View key={item.label} style={styles.card}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Live activity</Text>
        {(data?.analytics || []).slice(0, 4).map((item) => (
          <View key={`${item.metric}-${item.label}`} style={styles.row}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 18 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  headerSubtitle: { color: '#4B5563', marginTop: 6, marginBottom: 20 },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#064F8B' },
  statLabel: { marginTop: 8, fontSize: 12, color: '#6B7280' },
  panel: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },
  panelTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  rowLabel: { color: '#4B5563' },
  rowValue: { fontWeight: '700', color: '#111827' },
  errorText: { color: '#EF4444', fontWeight: '600' },
});
