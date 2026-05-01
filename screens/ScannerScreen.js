import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, SafeAreaView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_SCAN = { name: 'Jane Smith', id: 'STU-2024-034' };

export default function ScannerScreen() {
  const [scanned, setScanned]     = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult]       = useState(null);
  const slideAnim  = useRef(new Animated.Value(140)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scanLineY = scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 180] });

  const handleScan = () => {
    if (scanned || processing) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setScanned(true);
      setResult(MOCK_SCAN);
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 50, friction: 8 }).start();
    }, 1200);
  };

  const handleDismiss = () => {
    Animated.timing(slideAnim, { toValue: 140, duration: 250, useNativeDriver: true }).start(() => {
      setScanned(false);
      setResult(null);
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <Text style={styles.headerTitle}>Scan Student ID</Text>
        <Text style={styles.headerSub}>Point camera at student QR code</Text>
      </SafeAreaView>

      {/* Viewfinder */}
      <TouchableOpacity style={styles.cameraArea} activeOpacity={0.9} onPress={handleScan}>
        {/* Corner brackets */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {/* Scan line */}
        {!scanned && (
          <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]} />
        )}

        <Ionicons name="camera-outline" size={48} color="#4B5563" style={{ marginBottom: 12 }} />
        <Text style={styles.cameraPlaceholder}>Camera preview on device</Text>
        {processing && <Text style={styles.processingText}>Processing…</Text>}
      </TouchableOpacity>

      {!scanned && !processing && (
        <View style={styles.hintWrap}>
          <Text style={styles.hintText}>Tap viewfinder to simulate scan</Text>
        </View>
      )}

      {/* Approved card */}
      {result && (
        <Animated.View style={[styles.approvedCard, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.approvedIconBox}>
            <Ionicons name="checkmark-circle" size={32} color="#22C55E" />
          </View>
          <View style={styles.approvedInfo}>
            <Text style={styles.approvedLabel}>Ride Approved</Text>
            <Text style={styles.approvedName}>{result.name}</Text>
            <Text style={styles.approvedId}>{result.id}</Text>
          </View>
          <TouchableOpacity onPress={handleDismiss} style={styles.dismissBtn}>
            <Ionicons name="close" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </Animated.View>
      )}

      <SafeAreaView style={{ backgroundColor: '#000' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  headerSafe: { paddingTop: Platform.OS === 'android' ? 44 : 16, paddingHorizontal: 24, paddingBottom: 16, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },

  cameraArea: {
    flex: 1, margin: 32, justifyContent: 'center',
    alignItems: 'center', position: 'relative', overflow: 'hidden',
  },

  corner: { position: 'absolute', width: 36, height: 36, borderColor: '#FFF' },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },

  scanLine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9, shadowRadius: 6, elevation: 4,
  },

  cameraPlaceholder: { color: '#6B7280', fontSize: 14 },
  processingText: { color: '#9CA3AF', fontSize: 14, marginTop: 12 },

  hintWrap: { alignItems: 'center', paddingBottom: 16 },
  hintText: { color: '#6B7280', fontSize: 13 },

  approvedCard: {
    backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 10,
  },
  approvedIconBox: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  approvedInfo: { flex: 1 },
  approvedLabel: { fontSize: 13, fontWeight: '700', color: '#22C55E', marginBottom: 3 },
  approvedName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  approvedId: { fontSize: 13, color: '#64748B', marginTop: 2 },
  dismissBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
});
