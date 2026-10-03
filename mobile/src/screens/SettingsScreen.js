import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const settingItems = [
  'Profile & verification',
  'Notifications',
  'Payments & escrow',
  'Security & session',
  'Support center',
];

export default function SettingsScreen({ onLogout }) {
  return (
    <View style={styles.container}>
      {settingItems.map((item) => (
        <TouchableOpacity key={item} style={styles.row} onPress={() => Alert.alert('Settings', item)}>
          <Text style={styles.text}>{item}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  text: { color: '#111827', fontSize: 16, fontWeight: '600' },
  arrow: { color: '#6B7280', fontSize: 24 },
  logoutButton: {
    marginTop: 18,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
