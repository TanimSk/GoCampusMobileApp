import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STATS = [
  { id: 'wallet',  iconName: 'wallet',     iconBg: '#EEF2FF', iconColor: '#3B82F6', value: '৳485.50', label: 'Wallet Balance' },
  { id: 'rides',   iconName: 'navigate',   iconBg: '#DCFCE7', iconColor: '#22C55E', value: '34',      label: 'Total Rides' },
  { id: 'fare',    iconName: 'pricetag',   iconBg: '#FFF7ED', iconColor: '#F59E0B', value: '৳15.00', label: 'Last Ride Fare' },
];

const ACTIONS = [
  { id: 'map',     label: 'View Campus Map', iconName: 'map',       iconBg: '#EEF2FF', iconColor: '#3B82F6', tab: 'SMap' },
  { id: 'wallet',  label: 'Top Up Wallet',   iconName: 'wallet',    iconBg: '#DCFCE7', iconColor: '#22C55E', tab: 'Wallet' },
  { id: 'history', label: 'Ride History',    iconName: 'time',      iconBg: '#FFF7ED', iconColor: '#F59E0B', tab: 'Wallet' },
];

export default function StudentDashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreet}>Hello,</Text>
            <Text style={styles.headerName}>Alex</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AJ</Text>
          </View>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <View key={s.id} style={[styles.statCard, s.id === 'fare' && styles.statCardHalf]}>
              <View style={[styles.statIconBox, { backgroundColor: s.iconBg }]}>
                <Ionicons name={s.iconName} size={20} color={s.iconColor} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsCard}>
          {ACTIONS.map((a, i) => (
            <React.Fragment key={a.id}>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => navigation.navigate(a.tab)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBox, { backgroundColor: a.iconBg }]}>
                  <Ionicons name={a.iconName} size={20} color={a.iconColor} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>
              {i < ACTIONS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24,
  },
  headerGreet: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  headerName: { fontSize: 30, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#FFF' },

  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: '#0F172A',
    paddingHorizontal: 24, marginBottom: 14, letterSpacing: -0.3,
  },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 24, gap: 12, marginBottom: 28,
  },
  statCard: {
    flex: 1, minWidth: '44%',
    backgroundColor: '#FFF', borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statCardHalf: { flex: 0, width: '44%' },
  statIconBox: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },

  actionsCard: {
    backgroundColor: '#FFF', marginHorizontal: 24, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 18,
  },
  actionIconBox: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 18 },
});
