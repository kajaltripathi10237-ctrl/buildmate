import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { dashboardApi } from '../api/client';

export default function JobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await dashboardApi.jobs();
        setJobs(response || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#064F8B" /></View>;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={jobs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.location}</Text>
          <Text style={styles.meta}>{item.status}</Text>
          <Text style={styles.meta}>Budget: ${Number(item.budget || 0).toLocaleString()}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  list: { padding: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  meta: { marginTop: 6, color: '#4B5563' },
});
