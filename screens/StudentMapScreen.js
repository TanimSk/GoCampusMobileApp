import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, Dimensions,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dhaka University campus centre (example campus)
const CAMPUS_CENTER = { latitude: 23.7279, longitude: 90.3921 };

const CART_LOCATIONS = [
  { id: 'C01', driver: 'Rahman',   latitude: 23.7295, longitude: 90.3905, from: 'Main Library',  to: 'Cafeteria',  student: 'Sadia Islam',  fare: '৳8.00',  eta: '4 min' },
  { id: 'C03', driver: 'Hasan',    latitude: 23.7265, longitude: 90.3940, from: 'Eng. Block',    to: 'Admin',      student: 'Rahim Uddin',  fare: '৳12.00', eta: '7 min' },
  { id: 'C04', driver: 'Nabil',    latitude: 23.7250, longitude: 90.3910, from: 'Dorm A',        to: 'Sports',     student: 'Mitu Akter',   fare: '৳6.00',  eta: '2 min' },
];

function CartMarker({ cart }) {
  return (
    <Marker
      coordinate={{ latitude: cart.latitude, longitude: cart.longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.markerContainer}>
        <View style={styles.markerBubble}>
          <Text style={styles.markerLabel}>{cart.id}</Text>
        </View>
        <View style={styles.markerTail} />
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutDriver}>{cart.driver}</Text>
          <Text style={styles.calloutRoute}>{cart.from} → {cart.to}</Text>
          <Text style={styles.calloutEta}>{cart.eta} away</Text>
        </View>
      </Callout>
    </Marker>
  );
}

export default function StudentMapScreen() {
  const mapRef = useRef(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Campus Map</Text>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Active Rides</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AJ</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Google Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...CAMPUS_CENTER,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
        showsUserLocation
        showsMyLocationButton
        mapType="standard"
      >
        {CART_LOCATIONS.map(cart => (
          <CartMarker key={cart.id} cart={cart} />
        ))}
      </MapView>

      {/* Active Rides Bottom Card */}
      <View style={styles.bottomCard}>
        <View style={styles.bottomHandle} />
        <View style={styles.ridesSectionHeader}>
          <Text style={styles.ridesSectionTitle}>Active Rides</Text>
          <View style={styles.ongoingBadge}>
            <Text style={styles.ongoingText}>{CART_LOCATIONS.length} ongoing</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {CART_LOCATIONS.map((ride) => (
            <View key={ride.id} style={styles.rideRow}>
              <View style={styles.rideCartBadge}>
                <Text style={styles.rideCartText}>{ride.id}</Text>
              </View>
              <View style={styles.rideInfo}>
                <Text style={styles.rideDriver}>{ride.driver}</Text>
                <Text style={styles.rideRoute}>{ride.from} → {ride.to}</Text>
                <Text style={styles.rideStudent}>{ride.student}</Text>
              </View>
              <View style={styles.rideMeta}>
                <Text style={styles.rideFare}>{ride.fare}</Text>
                <Text style={styles.rideEta}>{ride.eta}</Text>
              </View>
            </View>
          ))}
          <View style={{ height: 12 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  headerSafe: { backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12,
  },
  headerSub: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 2 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FEF2F2', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#EF4444' },
  liveText: { fontSize: 11, fontWeight: '800', color: '#EF4444', letterSpacing: 0.5 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: '#FFF' },

  map: { flex: 1 },

  // Cart marker
  markerContainer: { alignItems: 'center' },
  markerBubble: {
    backgroundColor: '#F97316', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
  },
  markerLabel: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  markerTail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#F97316',
  },
  callout: {
    backgroundColor: '#FFF', borderRadius: 10, padding: 12,
    minWidth: 160, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15,
    shadowRadius: 6, elevation: 4,
  },
  calloutDriver: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  calloutRoute: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  calloutEta: { fontSize: 11, fontWeight: '600', color: '#22C55E' },

  // Bottom panel
  bottomCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingHorizontal: 20,
    maxHeight: 280,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 8,
  },
  bottomHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 16,
  },
  ridesSectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 8,
  },
  ridesSectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  ongoingBadge: {
    backgroundColor: '#FEF2F2', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  ongoingText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },

  rideRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  rideCartBadge: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: '#FEF3E2',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  rideCartText: { fontSize: 11, fontWeight: '800', color: '#F97316' },
  rideInfo: { flex: 1 },
  rideDriver: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  rideRoute: { fontSize: 12, color: '#64748B', marginBottom: 1 },
  rideStudent: { fontSize: 12, color: '#94A3B8' },
  rideMeta: { alignItems: 'flex-end' },
  rideFare: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 3 },
  rideEta: { fontSize: 12, color: '#64748B' },
});
