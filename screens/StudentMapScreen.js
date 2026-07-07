import React, { useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet,
  ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import useGeolocationSocket from '../hooks/useGeolocationSocket';
import { getInitials } from '../utils/formatters';

const { width } = Dimensions.get('window');

const CAMPUS_CENTER = { latitude: 23.7279, longitude: 90.3921 };

function formatCoordinate(value) {
  return Number(value).toFixed(5);
}

function LiveUserMarker({ entry, isCurrentUser }) {
  return (
    <Marker
      coordinate={{ latitude: entry.latitude, longitude: entry.longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.markerBubble, isCurrentUser && styles.markerBubbleCurrent]}>
          <Text style={styles.markerLabel}>{isCurrentUser ? 'YOU' : entry.user_id}</Text>
        </View>
        <View style={[styles.markerTail, isCurrentUser && styles.markerTailCurrent]} />
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutDriver}>{isCurrentUser ? 'Your location' : entry.user_id}</Text>
          <Text style={styles.calloutRoute}>Lat {formatCoordinate(entry.latitude)}</Text>
          <Text style={styles.calloutEta}>Lng {formatCoordinate(entry.longitude)}</Text>
        </View>
      </Callout>
    </Marker>
  );
}

export default function StudentMapScreen() {
  const { session } = useAuth();
  const mapRef = useRef(null);
  const userId = session?.user?.username || 'student';
  const { locations, connectionStatus, permissionGranted } = useGeolocationSocket(userId);

  const sortedLocations = useMemo(
    () => [...locations].sort((a, b) => (a.user_id === userId ? -1 : b.user_id === userId ? 1 : a.user_id.localeCompare(b.user_id))),
    [locations, userId]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Campus Map</Text>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Live Locations</Text>
              <View style={styles.liveBadge}>
                <View style={[styles.liveDot, connectionStatus === 'open' ? styles.liveDotOpen : styles.liveDotClosed]} />
                <Text style={[styles.liveText, connectionStatus !== 'open' && styles.liveTextClosed]}>
                  {connectionStatus === 'open' ? 'LIVE' : connectionStatus.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userId, 'ST')}</Text>
          </View>
        </View>
      </SafeAreaView>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...CAMPUS_CENTER,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
        showsUserLocation={permissionGranted}
        showsMyLocationButton={permissionGranted}
        mapType="standard"
      >
        {sortedLocations.map((entry) => (
          <LiveUserMarker key={entry.user_id} entry={entry} isCurrentUser={entry.user_id === userId} />
        ))}
      </MapView>

      <View style={styles.bottomCard}>
        <View style={styles.bottomHandle} />
        <View style={styles.ridesSectionHeader}>
          <Text style={styles.ridesSectionTitle}>Socket Feed</Text>
          <View style={styles.ongoingBadge}>
            <Text style={styles.ongoingText}>{sortedLocations.length} tracked</Text>
          </View>
        </View>

        <Text style={styles.helperText}>
          {permissionGranted
            ? 'Your phone is publishing coordinates and rendering live websocket updates.'
            : 'Location permission is off. Live websocket updates still render when available.'}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {sortedLocations.map((entry) => {
            const isCurrentUser = entry.user_id === userId;

            return (
              <View key={entry.user_id} style={styles.rideRow}>
                <View style={[styles.rideCartBadge, isCurrentUser && styles.rideCartBadgeCurrent]}>
                  <MaterialCommunityIcons
                    name={isCurrentUser ? 'crosshairs-gps' : 'map-marker'}
                    size={18}
                    color={isCurrentUser ? '#2563EB' : '#F97316'}
                  />
                </View>
                <View style={styles.rideInfo}>
                  <Text style={styles.rideDriver}>{isCurrentUser ? 'You' : entry.user_id}</Text>
                  <Text style={styles.rideRoute}>Latitude {formatCoordinate(entry.latitude)}</Text>
                  <Text style={styles.rideStudent}>Longitude {formatCoordinate(entry.longitude)}</Text>
                </View>
                <View style={styles.rideMeta}>
                  <Text style={styles.rideFare}>{isCurrentUser ? 'Self' : 'Peer'}</Text>
                  <Text style={styles.rideEta}>{connectionStatus}</Text>
                </View>
              </View>
            );
          })}
          {!sortedLocations.length && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No live locations yet</Text>
              <Text style={styles.emptyText}>The websocket has not emitted any user coordinates yet.</Text>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FEF2F2', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  liveDot: { width: 7, height: 7, borderRadius: 3.5 },
  liveDotOpen: { backgroundColor: '#10B981' },
  liveDotClosed: { backgroundColor: '#EF4444' },
  liveText: { fontSize: 11, fontWeight: '800', color: '#10B981', letterSpacing: 0.5 },
  liveTextClosed: { color: '#EF4444' },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  map: { flex: 1 },
  markerContainer: { alignItems: 'center' },
  markerBubble: {
    backgroundColor: '#F97316', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
  },
  markerBubbleCurrent: { backgroundColor: '#2563EB' },
  markerLabel: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  markerTail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#F97316',
  },
  markerTailCurrent: { borderTopColor: '#2563EB' },
  callout: {
    backgroundColor: '#FFF', borderRadius: 10, padding: 12,
    minWidth: 160, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15,
    shadowRadius: 6, elevation: 4,
  },
  calloutDriver: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  calloutRoute: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  calloutEta: { fontSize: 11, fontWeight: '600', color: '#22C55E' },
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
  ridesSectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 8,
  },
  ridesSectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  ongoingBadge: {
    backgroundColor: '#DBEAFE', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  ongoingText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  helperText: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 8 },
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
  rideCartBadgeCurrent: { backgroundColor: '#DBEAFE' },
  rideInfo: { flex: 1 },
  rideDriver: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  rideRoute: { fontSize: 12, color: '#64748B', marginBottom: 1 },
  rideStudent: { fontSize: 12, color: '#94A3B8' },
  rideMeta: { alignItems: 'flex-end' },
  rideFare: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 3 },
  rideEta: { fontSize: 12, color: '#64748B' },
  emptyState: { paddingVertical: 20, alignItems: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptyText: { fontSize: 12, color: '#64748B', textAlign: 'center' },
});
