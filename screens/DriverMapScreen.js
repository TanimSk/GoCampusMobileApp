import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CAMPUS_CENTER = { latitude: 23.7279, longitude: 90.3921 };

// My cart's current position
const MY_CART = {
  id: 'EC-12',
  latitude: 23.7279,
  longitude: 90.3921,
  status: 'online',
};

// Other active carts on campus
const OTHER_CARTS = [
  { id: 'EC-05', latitude: 23.7295, longitude: 90.3905, status: 'online',  passenger: 'Sadia Islam' },
  { id: 'EC-08', latitude: 23.7265, longitude: 90.3940, status: 'online',  passenger: 'Rahim Uddin' },
  { id: 'EC-11', latitude: 23.7250, longitude: 90.3910, status: 'offline', passenger: null },
];

// Campus stops / pickup points
const STOPS = [
  { id: 's1', name: 'Main Gate',      latitude: 23.7305, longitude: 90.3930 },
  { id: 's2', name: 'Main Library',   latitude: 23.7290, longitude: 90.3900 },
  { id: 's3', name: 'Cafeteria',      latitude: 23.7275, longitude: 90.3920 },
  { id: 's4', name: 'Eng. Block',     latitude: 23.7260, longitude: 90.3945 },
  { id: 's5', name: 'Admin Block',    latitude: 23.7255, longitude: 90.3910 },
  { id: 's6', name: 'Sports Complex', latitude: 23.7240, longitude: 90.3925 },
];

const RECENT_PICKUPS = [
  { id: 'r1', student: 'STU-034', from: 'Main Gate',    to: 'Cafeteria',  time: '10:15 AM', fare: '৳8.00' },
  { id: 'r2', student: 'STU-091', from: 'Library',      to: 'Eng. Block', time: '10:48 AM', fare: '৳10.00' },
  { id: 'r3', student: 'STU-012', from: 'Admin Block',  to: 'Sports',     time: '11:20 AM', fare: '৳12.00' },
];

export default function DriverMapScreen() {
  const mapRef = useRef(null);
  const [myStatus, setMyStatus] = useState('online');

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>EC-12 · Live View</Text>
            <Text style={styles.headerTitle}>Campus Map</Text>
          </View>
          <View style={[styles.statusPill, myStatus === 'online' ? styles.statusOnline : styles.statusOffline]}>
            <View style={[styles.statusDot, { backgroundColor: myStatus === 'online' ? '#22C55E' : '#9CA3AF' }]} />
            <Text style={[styles.statusText, { color: myStatus === 'online' ? '#166534' : '#6B7280' }]}>
              {myStatus === 'online' ? 'Online' : 'Offline'}
            </Text>
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
          latitudeDelta: 0.014,
          longitudeDelta: 0.014,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        mapType="standard"
      >
        {/* My cart marker */}
        <Marker
          coordinate={{ latitude: MY_CART.latitude, longitude: MY_CART.longitude }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.myCartMarker}>
            <MaterialCommunityIcons name="bus-electric" size={18} color="#FFF" />
          </View>
          <Callout tooltip>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>You · {MY_CART.id}</Text>
              <Text style={styles.calloutSub}>Current location</Text>
            </View>
          </Callout>
        </Marker>

        {/* Other carts */}
        {OTHER_CARTS.map(cart => (
          <Marker
            key={cart.id}
            coordinate={{ latitude: cart.latitude, longitude: cart.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[styles.otherCartMarker, cart.status === 'offline' && styles.otherCartOffline]}>
              <Text style={styles.otherCartLabel}>{cart.id}</Text>
            </View>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{cart.id}</Text>
                <Text style={styles.calloutSub}>
                  {cart.passenger ? `Passenger: ${cart.passenger}` : 'No passenger'}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Campus stops */}
        {STOPS.map(stop => (
          <Marker
            key={stop.id}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.stopMarker}>
              <Ionicons name="location" size={10} color="#3B82F6" />
            </View>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{stop.name}</Text>
                <Text style={styles.calloutSub}>Campus stop</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Bottom Panel */}
      <View style={styles.bottomCard}>
        <View style={styles.bottomHandle} />

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Active Carts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Stops</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>৳30</Text>
            <Text style={styles.statLabel}>Last Fare</Text>
          </View>
        </View>

        {/* Recent pickups */}
        <View style={styles.pickupsHeader}>
          <Text style={styles.pickupsTitle}>Recent Pickups</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {RECENT_PICKUPS.map(p => (
            <View key={p.id} style={styles.pickupRow}>
              <View style={styles.pickupIcon}>
                <Ionicons name="person" size={16} color="#3B82F6" />
              </View>
              <View style={styles.pickupInfo}>
                <Text style={styles.pickupStudent}>{p.student}</Text>
                <Text style={styles.pickupRoute}>{p.from} → {p.to}</Text>
                <Text style={styles.pickupTime}>{p.time}</Text>
              </View>
              <Text style={styles.pickupFare}>{p.fare}</Text>
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
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1,
  },
  statusOnline: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  statusOffline: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '700' },

  map: { flex: 1 },

  // My cart marker
  myCartMarker: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#22C55E',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 5, elevation: 6,
  },

  // Other cart markers
  otherCartMarker: {
    backgroundColor: '#F97316', borderRadius: 16,
    paddingHorizontal: 10, paddingVertical: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  otherCartOffline: { backgroundColor: '#94A3B8' },
  otherCartLabel: { color: '#FFF', fontSize: 11, fontWeight: '800' },

  // Stop marker
  stopMarker: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#EEF2FF', borderWidth: 1.5, borderColor: '#3B82F6',
    justifyContent: 'center', alignItems: 'center',
  },

  // Callout
  callout: {
    backgroundColor: '#FFF', borderRadius: 10, padding: 12, minWidth: 130,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  calloutTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  calloutSub: { fontSize: 11, color: '#64748B' },

  // Bottom panel
  bottomCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingHorizontal: 20,
    maxHeight: 300,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 8,
  },
  bottomHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 16,
  },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 14,
    padding: 14, marginBottom: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  statDivider: { width: 1, height: 32, backgroundColor: '#E2E8F0' },

  pickupsHeader: { marginBottom: 8 },
  pickupsTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },

  pickupRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  pickupIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  pickupInfo: { flex: 1 },
  pickupStudent: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  pickupRoute: { fontSize: 12, color: '#64748B', marginBottom: 1 },
  pickupTime: { fontSize: 11, color: '#94A3B8' },
  pickupFare: { fontSize: 14, fontWeight: '800', color: '#22C55E' },
});
