import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

export default function App() {
  const [currentRole, setCurrentRole] = useState('CONTRACTOR');
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🏗️ BuildMate</Text>
        <Text style={styles.roleTag}>{currentRole}</Text>
      </View>

      <View style={styles.rolePicker}>
        {['CONTRACTOR', 'WORKER', 'VENDOR', 'ADMIN'].map((role) => (
          <TouchableOpacity
            key={role}
            style={[styles.roleBtn, currentRole === role && styles.activeRoleBtn]}
            onPress={() => setCurrentRole(role)}
          >
            <Text style={[styles.roleBtnText, currentRole === role && styles.activeRoleText]}>
              {role.slice(0, 4)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'Dashboard' && <DashboardView role={currentRole} />}
        {activeTab === 'Jobs' && <JobsView />}
        {activeTab === 'Marketplace' && <MarketplaceView />}
        {activeTab === 'Payments' && <PaymentsView />}
      </ScrollView>

      <View style={styles.bottomNav}>
        {['Dashboard', 'Jobs', 'Marketplace', 'Payments'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.navItem}>
            <Text style={[styles.navText, activeTab === tab && styles.activeNavText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

function DashboardView({ role }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{role} Dashboard</Text>
      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Text style={styles.cardVal}>12</Text>
          <Text style={styles.cardLabel}>Active Jobs</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardVal}>$24.5k</Text>
          <Text style={styles.cardLabel}>Escrow Funds</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Attendance', 'GPS Location verified!')}>
        <Text style={styles.btnText}>📍 Log Daily Attendance (GPS/QR)</Text>
      </TouchableOpacity>
    </View>
  );
}

function JobsView() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Job Board & Workforce Management</Text>
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>Commercial Concrete Framework</Text>
        <Text style={styles.itemSub}>Budget: $12,000 • 8 Workers Needed</Text>
        <TouchableOpacity style={styles.secBtn} onPress={() => Alert.alert('Submitted', 'Application Sent!')}>
          <Text style={styles.secBtnText}>Apply / Assign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MarketplaceView() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Materials & Equipment Marketplace</Text>
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>CAT Excavator 320</Text>
        <Text style={styles.itemSub}>$450/day • Rental Listing</Text>
        <TouchableOpacity style={styles.secBtn}>
          <Text style={styles.secBtnText}>Rent Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PaymentsView() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Escrow & Financial Ledger</Text>
      <View style={styles.cardFull}>
        <Text style={styles.cardVal}>$18,400.00</Text>
        <Text style={styles.cardLabel}>Pending Escrow Release</Text>
        <TouchableOpacity style={[styles.primaryBtn, { marginTop: 10 }]} onPress={() => Alert.alert('Payment', 'Released to Worker Wallet!')}>
          <Text style={styles.btnText}>Release Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16, backgroundColor: '#0F172A', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  roleTag: { backgroundColor: '#38BDF8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontWeight: 'bold' },
  rolePicker: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 4 },
  roleBtn: { flex: 1, padding: 8, alignItems: 'center' },
  activeRoleBtn: { backgroundColor: '#334155', borderRadius: 4 },
  roleBtnText: { color: '#94A3B8', fontSize: 12 },
  activeRoleText: { color: '#FFFFFF', fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  section: { gap: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  cardFull: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cardVal: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  cardLabel: { fontSize: 12, color: '#64748B' },
  primaryBtn: { backgroundColor: '#2563EB', padding: 14, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' },
  secBtn: { backgroundColor: '#F1F5F9', padding: 8, borderRadius: 4, marginTop: 8, alignItems: 'center' },
  secBtnText: { color: '#2563EB', fontWeight: 'bold' },
  listItem: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  itemSub: { color: '#64748B', marginTop: 4 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#E2E8F0' },
  navItem: { flex: 1, padding: 14, alignItems: 'center' },
  navText: { color: '#64748B', fontSize: 12 },
  activeNavText: { color: '#2563EB', fontWeight: 'bold' }
});
