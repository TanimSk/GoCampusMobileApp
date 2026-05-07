import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getDriverHistory, getStudentHistory } from '../api/gocampus';
import { formatCurrency, formatDateTime } from '../utils/formatters';

function EmptyState({ message }) {
  return (
    <View style={styles.emptyCard}>
      <Ionicons name="time-outline" size={24} color="#94A3B8" />
      <Text style={styles.emptyTitle}>No rides yet</Text>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const { session } = useAuth();
  const isDriver = session?.role === 'ECART';
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalTrips: 0,
    totalAmount: 0,
    averageAmount: 0,
  });
  const [trips, setTrips] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadHistory() {
        if (!session?.accessToken) {
          return;
        }

        setLoading(true);

        try {
          if (isDriver) {
            const payload = await getDriverHistory(session.accessToken);
            const nextTrips = payload.trips?.results || [];

            if (!active) {
              return;
            }

            setTrips(nextTrips);
            setSummary({
              totalTrips: payload.total_trips || 0,
              totalAmount: Number(payload.total_earnings || 0),
              averageAmount: Number(payload.avg_fee || 0),
            });
          } else {
            const payload = await getStudentHistory(session.accessToken);
            const nextTrips = payload.results || [];
            const totalAmount = nextTrips.reduce((sum, trip) => sum + Number(trip.fee || 0), 0);

            if (!active) {
              return;
            }

            setTrips(nextTrips);
            setSummary({
              totalTrips: payload.count || nextTrips.length,
              totalAmount,
              averageAmount: nextTrips.length ? totalAmount / nextTrips.length : 0,
            });
          }
        } catch (error) {
          if (active) {
            Alert.alert('Unable to Load History', error.message || 'Please try again.');
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadHistory();

      return () => {
        active = false;
      };
    }, [isDriver, session?.accessToken])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{isDriver ? 'Trip History' : 'Ride History'}</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Ionicons name="navigate" size={22} color="#3B82F6" style={{ marginBottom: 6 }} />
            <Text style={styles.summaryValue}>{summary.totalTrips}</Text>
            <Text style={styles.summaryLabel}>Total Trips</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="trending-up" size={22} color="#22C55E" style={{ marginBottom: 6 }} />
            <Text style={styles.summaryValue}>{formatCurrency(summary.totalAmount)}</Text>
            <Text style={styles.summaryLabel}>{isDriver ? 'Total Earned' : 'Total Spent'}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="cash" size={22} color="#F59E0B" style={{ marginBottom: 6 }} />
            <Text style={styles.summaryValue}>{formatCurrency(summary.averageAmount)}</Text>
            <Text style={styles.summaryLabel}>{isDriver ? 'Avg Fare' : 'Avg Fare'}</Text>
          </View>
        </View>

        <View style={styles.tripsHeader}>
          <Text style={styles.sectionTitle}>All Trips</Text>
          <Text style={styles.sectionSub}>Live data from GoCampus API</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading trip history…</Text>
          </View>
        ) : trips.length === 0 ? (
          <EmptyState
            message={
              isDriver
                ? 'No completed driver trips were returned for this account.'
                : 'No student rides were returned for this account.'
            }
          />
        ) : (
          trips.map((trip, index) => (
            <View key={trip.id || `${trip.created_at}-${index}`} style={styles.tripCard}>
              <View style={styles.tripLeft}>
                <View style={styles.tripDotCol}>
                  <View style={styles.tripDot} />
                  <View style={styles.tripLine} />
                </View>
                <View style={styles.tripInfo}>
                  <View style={styles.tripRouteRow}>
                    <Text style={styles.tripFrom}>{trip.pickup_point || 'Unknown pickup'}</Text>
                    <Ionicons name="arrow-forward" size={12} color="#94A3B8" style={{ marginHorizontal: 4 }} />
                    <Text style={styles.tripTo}>{trip.dropoff_point || 'Unknown dropoff'}</Text>
                  </View>
                  <Text style={styles.tripDateTime}>{formatDateTime(trip.created_at)}</Text>
                  <View style={styles.tripDistRow}>
                    <Ionicons name="person-outline" size={12} color="#94A3B8" />
                    <Text style={styles.tripDistance}>
                      {' '}
                      {isDriver ? (trip.student_name || trip.student_id || 'Student rider') : (trip.ecart_id_num || 'Campus cart')}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.tripRight}>
                <Text style={styles.tripCart}>{isDriver ? (trip.student_id || 'Student') : (trip.ecart_id_num || 'Cart')}</Text>
                <Text style={styles.tripFare}>{formatCurrency(trip.fee)}</Text>
              </View>
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
  summaryCard: {
    flexDirection: 'row', backgroundColor: '#FFF',
    marginHorizontal: 24, borderRadius: 16,
    padding: 20, marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, textAlign: 'center' },
  summaryLabel: { fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },
  tripsHeader: { paddingHorizontal: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  sectionSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  loadingWrap: { alignItems: 'center', paddingVertical: 32 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748B' },
  emptyCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: { marginTop: 10, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  emptyText: { marginTop: 6, fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18 },
  tripCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    backgroundColor: '#FFF', marginHorizontal: 24, marginBottom: 10,
    borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  tripLeft: { flexDirection: 'row', flex: 1, gap: 12 },
  tripDotCol: { alignItems: 'center', paddingTop: 4 },
  tripDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#EEF2FF', borderWidth: 2, borderColor: '#C7D2FE',
  },
  tripLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginTop: 4, marginBottom: -8 },
  tripInfo: { flex: 1, gap: 4 },
  tripRouteRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  tripFrom: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  tripTo: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  tripDateTime: { fontSize: 12, color: '#64748B' },
  tripDistRow: { flexDirection: 'row', alignItems: 'center' },
  tripDistance: { fontSize: 12, color: '#94A3B8' },
  tripRight: { alignItems: 'flex-end', gap: 6, marginLeft: 12 },
  tripCart: { fontSize: 13, fontWeight: '700', color: '#3B82F6' },
  tripFare: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
});
