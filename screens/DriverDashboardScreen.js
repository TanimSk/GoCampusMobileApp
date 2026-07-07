import React, { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Switch,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getDriverProfile, getDriverStats } from '../api/gocampus';
import { formatCurrency, getInitials } from '../utils/formatters';

const ACTIONS = [
  { id: 'scan', label: 'Scan Student ID', iconName: 'qr-code', tab: 'Scanner' },
  { id: 'map', label: 'Live Map', iconName: 'map', tab: 'DMap' },
  { id: 'history', label: 'Ride History', iconName: 'time', tab: 'History' },
  { id: 'earnings', label: 'Earnings', iconName: 'cash', tab: 'Earnings' },
];

export default function DriverDashboardScreen({ navigation }) {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigation.navigate('DriverLogin');
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadDashboard() {
        if (!session?.accessToken) {
          return;
        }

        setLoading(true);

        try {
          const [profileData, statsData] = await Promise.all([
            getDriverProfile(session.accessToken),
            getDriverStats(session.accessToken),
          ]);

          if (!active) {
            return;
          }

          setProfile(profileData);
          setStats(statsData);
        } catch (error) {
          if (active) {
            Alert.alert('Unable to Load Dashboard', error.message || 'Please try again.');
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadDashboard();

      return () => {
        active = false;
      };
    }, [session?.accessToken])
  );

  const cards = [
    { id: 'earnings', iconName: 'cash', iconBg: '#DCFCE7', iconColor: '#22C55E', value: formatCurrency(stats?.todays_earnings), label: "Today's Earnings" },
    { id: 'trips', iconName: 'navigate', iconBg: '#EEF2FF', iconColor: '#6366F1', value: String(stats?.total_trips_today ?? 0), label: 'Trips Today' },
    { id: 'occ', iconName: 'people', iconBg: '#FFF7ED', iconColor: '#F59E0B', value: String(stats?.occupied_count ?? 0), label: 'Occupancy' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Cart</Text>
            <Text style={styles.headerTitle}>{profile?.ecart_id_num || session?.user?.username || 'Driver'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials(profile?.driver_name, 'DR')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusDot, { backgroundColor: profile?.is_online ? '#22C55E' : '#9CA3AF' }]} />
            <View>
              <Text style={styles.statusTitle}>{profile?.is_online ? 'Online' : 'Offline'}</Text>
              <Text style={styles.statusSub}>
                {profile?.driver_name ? `${profile.driver_name} is ${profile.is_online ? 'accepting rides' : 'not accepting rides'}` : 'Driver status'}
              </Text>
            </View>
          </View>
          <Switch
            value={Boolean(profile?.is_online)}
            disabled
            trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
            thumbColor="#FFF"
          />
        </View>

        <Text style={styles.sectionTitle}>Today's Overview</Text>
        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#22C55E" />
            <Text style={styles.loadingText}>Loading driver stats…</Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            {cards.map((s) => (
              <View key={s.id} style={[styles.statCard, s.id === 'occ' && styles.statCardHalf]}>
                <View style={[styles.statIconBox, { backgroundColor: s.iconBg }]}>
                  <Ionicons name={s.iconName} size={20} color={s.iconColor} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

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

        <View style={{ height: 34 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 26, paddingBottom: 20,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerSub: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  logoutText: { color: '#DC2626', fontSize: 13, fontWeight: '700' },
  avatarCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  statusCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFF', marginHorizontal: 24, borderRadius: 16,
    padding: 18, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  statusSub: { fontSize: 12, color: '#64748B', marginTop: 1 },
  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: '#0F172A',
    paddingHorizontal: 24, marginBottom: 14, letterSpacing: -0.3,
  },
  loadingCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748B' },
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
