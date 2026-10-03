import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const paymentRows = [
  { label: 'Pending release', value: '$18,400' },
  { label: 'Vendor payouts', value: '$9,360' },
  { label: 'Wallet balance', value: '$14,200' },
];

export default function PaymentsScreen() {
  return (
    <View style={styles.container}>
      {paymentRows.map((row) => (
        <View key={row.label} style={styles.card}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 18,
  },
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
  label: { color: '#4B5563', fontSize: 14 },
  value: { marginTop: 8, color: '#111827', fontSize: 22, fontWeight: '800' },
});
