import React, { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, SafeAreaView, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getStudentProfile, getStudentStats } from '../api/gocampus';
import { formatCurrency, getInitials } from '../utils/formatters';

const ACTIONS = [
  { id: 'map',     label: 'View Campus Map', iconName: 'map',       iconBg: '#EEF2FF', iconColor: '#3B82F6', tab: 'SMap' },
  { id: 'wallet',  label: 'Top Up Wallet',   iconName: 'wallet',    iconBg: '#DCFCE7', iconColor: '#22C55E', tab: 'Wallet' },
  { id: 'history', label: 'Ride History',    iconName: 'time',      iconBg: '#FFF7ED', iconColor: '#F59E0B', tab: 'StudentHistory' },
];

export default function StudentDashboardScreen({ navigation }) {
  const { session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
            getStudentProfile(session.accessToken),
            getStudentStats(session.accessToken),
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
    { id: 'wallet', iconName: 'wallet', iconBg: '#EEF2FF', iconColor: '#3B82F6', value: formatCurrency(stats?.balance), label: 'Wallet Balance' },
    { id: 'rides', iconName: 'navigate', iconBg: '#DCFCE7', iconColor: '#22C55E', value: String(stats?.total_rides ?? 0), label: 'Total Rides' },
    { id: 'fare', iconName: 'pricetag', iconBg: '#FFF7ED', iconColor: '#F59E0B', value: formatCurrency(stats?.last_ride_fare), label: 'Last Ride Fare' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreet}>Hello,</Text>
            <Text style={styles.headerName}>{profile?.student_name || 'Student'}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(profile?.student_name, 'ST')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Stats</Text>
        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading your account data…</Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            {cards.map((s) => (
              <View key={s.id} style={[styles.statCard, s.id === 'fare' && styles.statCardHalf]}>
                <View style={[styles.statIconBox, { backgroundColor: s.iconBg }]}>
                  <Ionicons name={s.iconName} size={20} color={s.iconColor} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

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
