import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView,
  StyleSheet, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getDriverEarnings } from '../api/gocampus';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export default function EarningsScreen() {
  const { session } = useAuth();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadEarnings() {
        if (!session?.accessToken) {
          return;
        }

        setLoading(true);

        try {
          const payload = await getDriverEarnings(session.accessToken);

          if (active) {
            setEarnings(payload);
          }
        } catch (error) {
          if (active) {
            Alert.alert('Unable to Load Earnings', error.message || 'Please try again.');
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadEarnings();

      return () => {
        active = false;
      };
    }, [session?.accessToken])
  );

  const rides = earnings?.todays_rides || [];
  const todayTotal = Number(earnings?.todays_earnings || 0);
  const avgPerTrip = rides.length ? Math.round(todayTotal / rides.length) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Earnings</Text>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconBox}>
              <Ionicons name="trending-up" size={20} color="#FFF" />
            </View>
            <Text style={styles.heroLabel}>Today's Total</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.heroAmount}>{formatCurrency(todayTotal)}</Text>
          )}
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMeta}>
              <Ionicons name="navigate-outline" size={13} color="rgba(255,255,255,0.75)" />
              <Text style={styles.heroMetaText}> {earnings?.trips_today ?? 0} trips</Text>
            </View>
            <View style={styles.heroMeta}>
              <Ionicons name="cash-outline" size={13} color="rgba(255,255,255,0.75)" />
              <Text style={styles.heroMetaText}> Avg ৳{avgPerTrip}/trip</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryStrip}>
          <View style={styles.stripItem}>
            <Text style={styles.stripValue}>{formatCurrency(earnings?.this_week_earnings)}</Text>
            <Text style={styles.stripLabel}>This Week</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripValue}>{earnings?.trips_today ?? 0}</Text>
            <Text style={styles.stripLabel}>Trips Today</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripValue}>{earnings?.cart_id || session?.user?.username || 'N/A'}</Text>
            <Text style={styles.stripLabel}>Cart ID</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Today's Rides</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color="#22C55E" />
            <Text style={styles.loadingText}>Loading earnings…</Text>
          </View>
        ) : rides.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cash-outline" size={24} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No earnings yet today</Text>
            <Text style={styles.emptyText}>The API returned no completed rides for this driver today.</Text>
          </View>
        ) : (
          rides.map((ride, index) => (
            <View key={ride.id || `${ride.created_at}-${index}`} style={styles.rideCard}>
              <View style={styles.rideAvatarBox}>
                <Ionicons name="person" size={20} color="#22C55E" />
              </View>
              <View style={styles.rideInfo}>
                <Text style={styles.rideId}>{ride.student_id || ride.student_name || 'Student Rider'}</Text>
                <Text style={styles.rideTime}>{formatDateTime(ride.created_at)}</Text>
              </View>
              <Text style={styles.rideAmount}>{formatCurrency(ride.fee)}</Text>
            </View>
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  pageTitle: {
    fontSize: 28, fontWeight: '800', color: '#0F172A',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20, letterSpacing: -0.5,
  },

  heroCard: {
    backgroundColor: '#22C55E', marginHorizontal: 24, borderRadius: 20,
    padding: 24, marginBottom: 16,
    shadowColor: '#22C55E', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  heroIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  heroLabel: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  heroAmount: { fontSize: 44, fontWeight: '900', color: '#FFF', letterSpacing: -1.5, marginBottom: 16 },
  heroMetaRow: { flexDirection: 'row', gap: 20 },
  heroMeta: { flexDirection: 'row', alignItems: 'center' },
  heroMetaText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },

  summaryStrip: {
    flexDirection: 'row', backgroundColor: '#FFF',
    marginHorizontal: 24, borderRadius: 16,
    padding: 18, marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  stripItem: { flex: 1, alignItems: 'center' },
  stripValue: { fontSize: 17, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  stripLabel: { fontSize: 12, color: '#64748B', marginTop: 3, fontWeight: '500' },
  stripDivider: { width: 1, backgroundColor: '#F1F5F9' },

  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: '#0F172A',
    paddingHorizontal: 24, marginBottom: 14, letterSpacing: -0.3,
  },
  loadingWrap: { alignItems: 'center', paddingVertical: 32 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748B' },
  emptyCard: {
    backgroundColor: '#FFF', marginHorizontal: 24, marginBottom: 10,
    borderRadius: 14, padding: 20, alignItems: 'center',
  },
  emptyTitle: { marginTop: 10, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  emptyText: { marginTop: 6, fontSize: 13, color: '#64748B', textAlign: 'center' },

  rideCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', marginHorizontal: 24, marginBottom: 10,
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 1,
  },
  rideAvatarBox: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  rideInfo: { flex: 1 },
  rideId: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  rideTime: { fontSize: 12, color: '#64748B', marginTop: 3 },
  rideAmount: { fontSize: 16, fontWeight: '800', color: '#22C55E', letterSpacing: -0.3 },
});
