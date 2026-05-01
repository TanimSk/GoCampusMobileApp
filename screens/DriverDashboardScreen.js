import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Switch,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CART_ID = 'EC-12';

const STATS = [
  { id: 'earnings', iconName: 'cash',           iconBg: '#DCFCE7', iconColor: '#22C55E', value: '৳320', label: "Today's Earnings" },
  { id: 'trips',    iconName: 'navigate',        iconBg: '#EEF2FF', iconColor: '#6366F1', value: '18',   label: 'Trips Today' },
  { id: 'occ',      iconName: 'people',          iconBg: '#FFF7ED', iconColor: '#F59E0B', value: '3/6',  label: 'Occupancy' },
];

const ACTIONS = [
  { id: 'scan',     label: 'Scan Student ID', iconName: 'qr-code',  iconLib: 'ion', tab: 'Scanner' },
  { id: 'map',      label: 'Live Map',         iconName: 'map',      iconLib: 'ion', tab: 'DMap' },
  { id: 'history',  label: 'Ride History',     iconName: 'time',     iconLib: 'ion', tab: 'History' },
  { id: 'earnings', label: 'Earnings',          iconName: 'cash',     iconLib: 'ion', tab: 'Earnings' },
];

export default function DriverDashboardScreen({ navigation }) {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Cart</Text>
            <Text style={styles.headerTitle}>{CART_ID}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="bus-electric" size={24} color="#FFF" />
          </View>
        </View>

        {/* Online toggle */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#22C55E' : '#9CA3AF' }]} />
            <View>
              <Text style={styles.statusTitle}>{isOnline ? 'Online' : 'Offline'}</Text>
              <Text style={styles.statusSub}>{isOnline ? 'Accepting rides' : 'Not accepting rides'}</Text>
            </View>
          </View>
          <Switch
            value={isOnline} onValueChange={setIsOnline}
            trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
            thumbColor="#FFF"
          />
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <View key={s.id} style={[styles.statCard, s.id === 'occ' && styles.statCardHalf]}>
              <View style={[styles.statIconBox, { backgroundColor: s.iconBg }]}>
                <Ionicons name={s.iconName} size={20} color={s.iconColor} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsCard}>
          {ACTIONS.map((a, i) => (
            <React.Fragment key={a.id}>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => navigation.navigate(a.tab)}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconBox}>
                  <Ionicons name={a.iconName} size={20} color="#64748B" />
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
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20,
  },
  headerSub: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  avatarCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center',
  },

  statusCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFF', marginHorizontal: 24, borderRadius: 16,
    padding: 18, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  statusSub: { fontSize: 12, color: '#64748B', marginTop: 1 },

  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: '#0F172A',
    paddingHorizontal: 24, marginBottom: 14, letterSpacing: -0.3,
  },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 24, gap: 12, marginBottom: 28,
  },
  statCard: {
    flex: 1, minWidth: '44%', backgroundColor: '#FFF',
    borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statCardHalf: { flex: 0, width: '44%' },
  statIconBox: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 4 },
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
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 18 },
});
