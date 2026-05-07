import { useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';

const WS_URL = 'wss://gc-api.raphysicsedu.com/ws/geolocation/';

function normalizeLocation(entry) {
  if (!entry?.user_id) {
    return null;
  }

  const latitude = Number(entry.latitude);
  const longitude = Number(entry.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    user_id: String(entry.user_id),
    latitude,
    longitude,
  };
}

export default function useGeolocationSocket(userId) {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const wsRef = useRef(null);
  const lastSentRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    let mounted = true;
    let locationSubscription;
    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;
    setConnectionStatus('connecting');

    function sendLocation(payload) {
      if (socket.readyState !== WebSocket.OPEN) {
        return;
      }

      const message = {
        user_id: String(userId),
        latitude: payload.latitude,
        longitude: payload.longitude,
      };

      lastSentRef.current = message;
      socket.send(JSON.stringify(message));
    }

    socket.onopen = () => {
      if (!mounted) {
        return;
      }

      setConnectionStatus('open');

      if (lastSentRef.current) {
        socket.send(JSON.stringify(lastSentRef.current));
      }
    };

    socket.onmessage = (event) => {
      if (!mounted) {
        return;
      }

      try {
        const payload = JSON.parse(event.data);
        const nextLocations = Array.isArray(payload?.message)
          ? payload.message.map(normalizeLocation).filter(Boolean)
          : [];

        if (nextLocations.length || Array.isArray(payload?.message)) {
          setLocations(nextLocations);
        }
      } catch {
        // Ignore malformed websocket payloads.
      }
    };

    socket.onerror = () => {
      if (mounted) {
        setConnectionStatus('error');
      }
    };

    socket.onclose = () => {
      if (mounted) {
        setConnectionStatus('closed');
      }
    };

    async function startLocationTracking() {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!mounted) {
        return;
      }

      const granted = permission.status === 'granted';
      setPermissionGranted(granted);

      if (!granted) {
        return;
      }

      const initialPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!mounted) {
        return;
      }

      const initialPayload = {
        latitude: initialPosition.coords.latitude,
        longitude: initialPosition.coords.longitude,
      };

      setCurrentLocation(initialPayload);
      sendLocation(initialPayload);

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 5,
          timeInterval: 5000,
        },
        (position) => {
          if (!mounted) {
            return;
          }

          const nextPayload = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setCurrentLocation(nextPayload);
          sendLocation(nextPayload);
        }
      );
    }

    startLocationTracking();

    return () => {
      mounted = false;

      if (locationSubscription) {
        locationSubscription.remove();
      }

      socket.close();
      wsRef.current = null;
    };
  }, [userId]);

  const mergedLocations = useMemo(() => {
    const locationMap = new Map(locations.map((entry) => [entry.user_id, entry]));

    if (userId && currentLocation) {
      locationMap.set(String(userId), {
        user_id: String(userId),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    }

    return Array.from(locationMap.values());
  }, [currentLocation, locations, userId]);

  return {
    connectionStatus,
    currentLocation,
    locations: mergedLocations,
    permissionGranted,
  };
}
