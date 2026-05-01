import React from 'react';
import {
  View, Text, ScrollView,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TRIPS = [
  { id: '1', from: 'Main Gate',    to: 'Academic Block', date: 'Mar 15, 2026', time: '9:15 AM',  distance: '1.2 km', cart: 'EC-12', cartColor: '#3B82F6', fare: '৳15.00' },
  { id: '2', from: 'Library',      to: 'Cafeteria',      date: 'Mar 14, 2026', time: '2:30 PM',  distance: '0.8 km', cart: 'EC-05', cartColor: '#8B5CF6', fare: '৳10.00' },
  { id: '3', from: 'Dormitory A',  to: 'Sports Complex', date: 'Mar 14, 2026', time: '8:45 AM',  distance: '1.5 km', cart: 'EC-08', cartColor: '#EC4899', fare: '৳20.00' },
  { id: '4', from: 'Science Lab',  to: 'Main Gate',      date: 'Mar 13, 2026', time: '5:00 PM',  distance: '1.0 km', cart: 'EC-12', cartColor: '#3B82F6', fare: '৳12.00' },
  { id: '5', from: 'Main Gate',    to: 'Sports Complex', date: 'Mar 13, 2026', time: '11:00 AM', distance: '1.8 km', cart: 'EC-12', cartColor: '#3B82F6', fare: '৳18.00' },
];

const totalEarned = TRIPS.reduce((s, t) => s + parseFloat(t.fare.replace('৳', '')), 0);
const avgFare     = (totalEarned / TRIPS.length).toFixed(0);

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Trip History</Text>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Ionicons name="navigate" size={22} color="#3B82F6" style={{ marginBottom: 6 }} />
            <Text style={styles.summaryValue}>{TRIPS.length}</Text>
            <Text style={styles.summaryLabel}>Total Trips</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="trending-up" size={22} color="#22C55E" style={{ marginBottom: 6 }} />
            <Text style={styles.summaryValue}>৳{totalEarned}</Text>
            <Text style={styles.summaryLabel}>Total Earned</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="cash" size={22} color="#F59E0B" style={{ marginBottom: 6 }} />
            <Text style={styles.summaryValue}>৳{avgFare}</Text>
            <Text style={styles.summaryLabel}>Avg Fare</Text>
          </View>
        </View>

        <View style={styles.tripsHeader}>
          <Text style={styles.sectionTitle}>All Trips</Text>
          <Text style={styles.sectionSub}>Complete trip record</Text>
        </View>

        {TRIPS.map(trip => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripLeft}>
              <View style={styles.tripDotCol}>
                <View style={styles.tripDot} />
                <View style={styles.tripLine} />
              </View>
              <View style={styles.tripInfo}>
                <View style={styles.tripRouteRow}>
                  <Text style={styles.tripFrom}>{trip.from}</Text>
                  <Ionicons name="arrow-forward" size={12} color="#94A3B8" style={{ marginHorizontal: 4 }} />
                  <Text style={styles.tripTo}>{trip.to}</Text>
                </View>
                <Text style={styles.tripDateTime}>{trip.date} · {trip.time}</Text>
                <View style={styles.tripDistRow}>
                  <Ionicons name="navigate-outline" size={12} color="#94A3B8" />
                  <Text style={styles.tripDistance}> {trip.distance}</Text>
                </View>
              </View>
            </View>
            <View style={styles.tripRight}>
              <Text style={[styles.tripCart, { color: trip.cartColor }]}>{trip.cart}</Text>
              <Text style={styles.tripFare}>{trip.fare}</Text>
            </View>
          </View>
        ))}

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
  summaryValue: { fontSize: 20, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  summaryLabel: { fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },

  tripsHeader: { paddingHorizontal: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  sectionSub: { fontSize: 13, color: '#64748B', marginTop: 2 },

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
  tripRight: { alignItems: 'flex-end', gap: 6 },
  tripCart: { fontSize: 13, fontWeight: '700' },
  tripFare: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
});
