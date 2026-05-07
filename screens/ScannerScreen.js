import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, SafeAreaView, Platform, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { scanStudentId } from '../api/gocampus';

export default function ScannerScreen() {
  const { session } = useAuth();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [cardId, setCardId] = useState('');
  const slideAnim = useRef(new Animated.Value(140)).current;
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
  }, [scanLineAnim]);

  const scanLineY = scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 180] });

  const submitScan = async (decodedText) => {
    const normalizedCardId = decodedText?.trim();
    if (scanned || processing || !normalizedCardId || !session?.accessToken) {
      return;
    }

    setProcessing(true);
    setCardId(normalizedCardId);

    try {
      const response = await scanStudentId(session.accessToken, normalizedCardId);
      const payload = response.data || response.student || response;

      setScanned(true);
      setResult({
        name: payload.student_name || payload.name || 'Student approved',
        id: payload.student_id_num || payload.student_id || normalizedCardId,
        message: response.message || 'Ride approved.',
      });
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 50, friction: 8 }).start();
    } catch (error) {
      Alert.alert('Scan Failed', error.message || 'Unable to approve this student ride.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDismiss = () => {
    Animated.timing(slideAnim, { toValue: 140, duration: 250, useNativeDriver: true }).start(() => {
      setScanned(false);
      setResult(null);
    });
  };

  const handleBarcodeScanned = ({ data }) => {
    submitScan(data);
  };

  const handleManualSubmit = () => {
    submitScan(cardId);
  };

  if (!permission) {
    return (
      <View style={styles.loaderState}>
        <ActivityIndicator size="small" color="#22C55E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafe}>
        <Text style={styles.headerTitle}>Scan Student ID</Text>
        <Text style={styles.headerSub}>Point the camera at the student QR code</Text>
      </SafeAreaView>

      {!permission.granted ? (
        <View style={styles.permissionCard}>
          <Ionicons name="camera-outline" size={42} color="#E5E7EB" />
          <Text style={styles.permissionTitle}>Camera permission required</Text>
          <Text style={styles.permissionText}>
            The driver scanner needs camera access to read student QR codes.
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission} activeOpacity={0.85}>
            <Text style={styles.permissionBtnText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraArea}>
          {isFocused && (
            <CameraView
              style={styles.cameraPreview}
              facing="back"
              active={!scanned}
              onBarcodeScanned={scanned || processing ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />
          )}

          <View pointerEvents="none" style={styles.cameraOverlay}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {!scanned && <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]} />}
            <View style={styles.overlayCaption}>
              <Text style={styles.cameraPlaceholder}>Align the QR code inside the frame</Text>
              {processing && <Text style={styles.processingText}>Processing…</Text>}
            </View>
          </View>
        </View>
      )}

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={cardId}
          onChangeText={setCardId}
          placeholder="Decoded QR text or student ID"
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.submitBtn, (!cardId.trim() || processing) && styles.submitBtnDisabled]}
          onPress={handleManualSubmit}
          disabled={!cardId.trim() || processing}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>{processing ? 'Processing…' : 'Re-submit ID'}</Text>
        </TouchableOpacity>
        {!scanned && !processing && (
          <View style={styles.hintWrap}>
            <Text style={styles.hintText}>Scanned QR text will be sent to the API automatically.</Text>
          </View>
        )}
      </View>

      {result && (
        <Animated.View style={[styles.approvedCard, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.approvedIconBox}>
            <Ionicons name="checkmark-circle" size={32} color="#22C55E" />
          </View>
          <View style={styles.approvedInfo}>
            <Text style={styles.approvedLabel}>Ride Approved</Text>
            <Text style={styles.approvedName}>{result.name}</Text>
            <Text style={styles.approvedId}>{result.id}</Text>
            <Text style={styles.approvedMeta}>{result.message}</Text>
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
  loaderState: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },

  headerSafe: { paddingTop: Platform.OS === 'android' ? 44 : 16, paddingHorizontal: 24, paddingBottom: 16, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },

  cameraArea: {
    flex: 1, margin: 24, borderRadius: 28, overflow: 'hidden',
    position: 'relative', backgroundColor: '#111827',
  },
  cameraPreview: { flex: 1 },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  overlayCaption: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },

  corner: { position: 'absolute', width: 36, height: 36, borderColor: '#FFF' },
  cornerTL: { top: '26%', left: '18%', borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  cornerTR: { top: '26%', right: '18%', borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  cornerBL: { bottom: '26%', left: '18%', borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: '26%', right: '18%', borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },

  scanLine: {
    position: 'absolute', top: '26%', left: '18%', right: '18%', height: 2,
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9, shadowRadius: 6, elevation: 4,
  },

  cameraPlaceholder: { color: '#E5E7EB', fontSize: 14, fontWeight: '600' },
  processingText: { color: '#9CA3AF', fontSize: 14, marginTop: 12 },

  hintWrap: { alignItems: 'center', paddingBottom: 16 },
  hintText: { color: '#6B7280', fontSize: 13 },
  inputWrap: { paddingHorizontal: 24, paddingBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#374151', borderRadius: 12,
    color: '#FFF', paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#111827', fontSize: 15,
  },
  submitBtn: {
    marginTop: 12,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: { color: '#052E16', fontSize: 15, fontWeight: '800' },
  permissionCard: {
    flex: 1,
    margin: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  permissionTitle: { marginTop: 16, color: '#FFF', fontSize: 20, fontWeight: '800' },
  permissionText: { marginTop: 10, color: '#9CA3AF', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  permissionBtn: {
    marginTop: 20,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  permissionBtnText: { color: '#052E16', fontSize: 15, fontWeight: '800' },

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
  approvedMeta: { fontSize: 12, color: '#64748B', marginTop: 4 },
  dismissBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
});
