import React from 'react';
import {
  View, Text, ScrollView,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TODAY_RIDES = [
  { id: 'STU-001', time: '9:15 AM',  date: 'Mar 15, 2026', amount: 15 },
  { id: 'STU-034', time: '10:00 AM', date: 'Mar 15, 2026', amount: 10 },
  { id: 'STU-012', time: '11:30 AM', date: 'Mar 15, 2026', amount: 20 },
  { id: 'STU-087', time: '1:15 PM',  date: 'Mar 15, 2026', amount: 12 },
  { id: 'STU-023', time: '2:45 PM',  date: 'Mar 15, 2026', amount: 18 },
  { id: 'STU-056', time: '4:00 PM',  date: 'Mar 15, 2026', amount: 15 },
];

const todayTotal = TODAY_RIDES.reduce((s, r) => s + r.amount, 0);
const avgPerTrip = Math.round(todayTotal / TODAY_RIDES.length);

export default function EarningsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Earnings</Text>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconBox}>
              <Ionicons name="trending-up" size={20} color="#FFF" />
            </View>
            <Text style={styles.heroLabel}>Today's Total</Text>
          </View>
          <Text style={styles.heroAmount}>৳{todayTotal}.00</Text>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMeta}>
              <Ionicons name="navigate-outline" size={13} color="rgba(255,255,255,0.75)" />
              <Text style={styles.heroMetaText}> {TODAY_RIDES.length} trips</Text>
            </View>
            <View style={styles.heroMeta}>
              <Ionicons name="cash-outline" size={13} color="rgba(255,255,255,0.75)" />
              <Text style={styles.heroMetaText}> Avg ৳{avgPerTrip}/trip</Text>
            </View>
          </View>
        </View>

        {/* Summary strip */}
        <View style={styles.summaryStrip}>
          <View style={styles.stripItem}>
            <Text style={styles.stripValue}>৳320</Text>
            <Text style={styles.stripLabel}>This Week</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripValue}>18</Text>
            <Text style={styles.stripLabel}>Trips Today</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripValue}>EC-12</Text>
            <Text style={styles.stripLabel}>Cart ID</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Today's Rides</Text>

        {TODAY_RIDES.map(ride => (
          <View key={ride.id} style={styles.rideCard}>
            <View style={styles.rideAvatarBox}>
              <Ionicons name="person" size={20} color="#22C55E" />
            </View>
            <View style={styles.rideInfo}>
              <Text style={styles.rideId}>{ride.id}</Text>
              <Text style={styles.rideTime}>{ride.time} · {ride.date}</Text>
            </View>
            <Text style={styles.rideAmount}>৳{ride.amount}.00</Text>
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
