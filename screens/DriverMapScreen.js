import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getDriverProfile } from '../api/gocampus';
import useGeolocationSocket from '../hooks/useGeolocationSocket';

const CAMPUS_CENTER = { latitude: 23.7279, longitude: 90.3921 };

const STOPS = [
  { id: 's1', name: 'Main Gate', latitude: 23.7305, longitude: 90.3930 },
  { id: 's2', name: 'Main Library', latitude: 23.7290, longitude: 90.3900 },
  { id: 's3', name: 'Cafeteria', latitude: 23.7275, longitude: 90.3920 },
  { id: 's4', name: 'Eng. Block', latitude: 23.7260, longitude: 90.3945 },
  { id: 's5', name: 'Admin Block', latitude: 23.7255, longitude: 90.3910 },
  { id: 's6', name: 'Sports Complex', latitude: 23.7240, longitude: 90.3925 },
];

function formatCoordinate(value) {
  return Number(value).toFixed(5);
}

export default function DriverMapScreen() {
  const { session } = useAuth();
  const mapRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const userId = session?.user?.username || 'driver';
  const { locations, connectionStatus, permissionGranted } = useGeolocationSocket(userId);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadProfile() {
        if (!session?.accessToken) {
          return;
        }

        setLoadingProfile(true);

        try {
          const profileData = await getDriverProfile(session.accessToken);

          if (active) {
            setProfile(profileData);
          }
        } catch (error) {
          if (active) {
            Alert.alert('Unable to Load Map Data', error.message || 'Please try again.');
          }
        } finally {
          if (active) {
            setLoadingProfile(false);
          }
        }
      }

      loadProfile();

      return () => {
        active = false;
      };
    }, [session?.accessToken])
  );

  const myCart = useMemo(() => {
    const ownSocketLocation = locations.find((entry) => entry.user_id === userId);

    return {
      id: profile?.ecart_id_num || userId,
      latitude: ownSocketLocation?.latitude ?? Number(profile?.latitude || CAMPUS_CENTER.latitude),
      longitude: ownSocketLocation?.longitude ?? Number(profile?.longitude || CAMPUS_CENTER.longitude),
      status: profile?.is_online ? 'online' : 'offline',
    };
  }, [locations, profile?.ecart_id_num, profile?.is_online, profile?.latitude, profile?.longitude, userId]);

  const otherLiveUsers = useMemo(
    () => locations.filter((entry) => entry.user_id !== userId),
    [locations, userId]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>{myCart.id} · Live View</Text>
            <Text style={styles.headerTitle}>Campus Map</Text>
          </View>
          {loadingProfile ? (
            <ActivityIndicator size="small" color="#22C55E" />
          ) : (
            <View style={[styles.statusPill, myCart.status === 'online' ? styles.statusOnline : styles.statusOffline]}>
              <View style={[styles.statusDot, { backgroundColor: myCart.status === 'online' ? '#22C55E' : '#9CA3AF' }]} />
              <Text style={[styles.statusText, { color: myCart.status === 'online' ? '#166534' : '#6B7280' }]}>
                {myCart.status === 'online' ? 'Online' : 'Offline'}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...CAMPUS_CENTER,
          latitudeDelta: 0.014,
          longitudeDelta: 0.014,
        }}
        showsUserLocation={permissionGranted}
        showsMyLocationButton={permissionGranted}
        mapType="standard"
      >
        <Marker
          coordinate={{ latitude: myCart.latitude, longitude: myCart.longitude }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.myCartMarker}>
            <MaterialCommunityIcons name="bus-electric" size={18} color="#FFF" />
          </View>
          <Callout tooltip>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>You · {myCart.id}</Text>
              <Text style={styles.calloutSub}>Lat {formatCoordinate(myCart.latitude)}</Text>
              <Text style={styles.calloutSub}>Lng {formatCoordinate(myCart.longitude)}</Text>
            </View>
          </Callout>
        </Marker>

        {otherLiveUsers.map((entry) => (
          <Marker
            key={entry.user_id}
            coordinate={{ latitude: entry.latitude, longitude: entry.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.otherCartMarker}>
              <Text style={styles.otherCartLabel}>{entry.user_id}</Text>
            </View>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{entry.user_id}</Text>
                <Text style={styles.calloutSub}>Lat {formatCoordinate(entry.latitude)}</Text>
                <Text style={styles.calloutSub}>Lng {formatCoordinate(entry.longitude)}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {STOPS.map((stop) => (
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

      <View style={styles.bottomCard}>
        <View style={styles.bottomHandle} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{otherLiveUsers.length}</Text>
            <Text style={styles.statLabel}>Other Users</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{STOPS.length}</Text>
            <Text style={styles.statLabel}>Stops</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{connectionStatus === 'open' ? 'Live' : 'Retry'}</Text>
            <Text style={styles.statLabel}>Socket</Text>
          </View>
        </View>

        <View style={styles.pickupsHeader}>
          <Text style={styles.pickupsTitle}>Live Feed</Text>
          <Text style={styles.pickupsSub}>
            {permissionGranted
              ? 'Your cart is publishing geolocation over the websocket.'
              : 'Location permission is required to publish your cart position.'}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {otherLiveUsers.map((entry) => (
            <View key={entry.user_id} style={styles.pickupRow}>
              <View style={styles.pickupIcon}>
                <Ionicons name="navigate" size={16} color="#3B82F6" />
              </View>
              <View style={styles.pickupInfo}>
                <Text style={styles.pickupStudent}>{entry.user_id}</Text>
                <Text style={styles.pickupRoute}>Latitude {formatCoordinate(entry.latitude)}</Text>
                <Text style={styles.pickupTime}>Longitude {formatCoordinate(entry.longitude)}</Text>
              </View>
              <Text style={styles.pickupFare}>Live</Text>
            </View>
          ))}
          {!otherLiveUsers.length && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No other live users</Text>
              <Text style={styles.emptyText}>The websocket has not emitted any other user coordinates yet.</Text>
            </View>
          )}
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
    paddingHorizontal: 24, paddingTop: 18, paddingBottom: 12,
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
  myCartMarker: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#22C55E',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 5, elevation: 6,
  },
  otherCartMarker: {
    backgroundColor: '#F97316', borderRadius: 16,
    paddingHorizontal: 10, paddingVertical: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  otherCartLabel: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  stopMarker: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#EEF2FF', borderWidth: 1.5, borderColor: '#3B82F6',
    justifyContent: 'center', alignItems: 'center',
  },
  callout: {
    backgroundColor: '#FFF', borderRadius: 10, padding: 12, minWidth: 130,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  calloutTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  calloutSub: { fontSize: 11, color: '#64748B' },
  bottomCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingHorizontal: 20,
    maxHeight: 320,
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
  pickupsSub: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 },
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
  emptyState: { paddingVertical: 20, alignItems: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptyText: { fontSize: 12, color: '#64748B', textAlign: 'center' },
});
