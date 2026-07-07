import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CreateAccountScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [showCfm, setShowCfm]   = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleRegister = () => {
    if (!uploaded) { Alert.alert('Required', 'Please upload your ID card photo.'); return; }
    if (!password || password.length < 6) { Alert.alert('Weak Password', 'Minimum 6 characters.'); return; }
    if (password !== confirm) { Alert.alert('Mismatch', 'Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Account created! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('StudentLogin') },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>

          <View style={styles.logoWrap}>
            <View style={styles.logoBox}>
              <Ionicons name="person-add" size={28} color="#3B82F6" />
            </View>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register as a student on GoCampus</Text>

          <Text style={styles.label}>Upload ID Card Photo</Text>
          <TouchableOpacity
            style={[styles.uploadBox, uploaded && styles.uploadBoxDone]}
            onPress={() => setUploaded(true)}
            activeOpacity={0.8}
          >
            {uploaded ? (
              <>
                <Ionicons name="checkmark-circle" size={40} color="#22C55E" />
                <Text style={styles.uploadDoneText}>ID Card uploaded</Text>
              </>
            ) : (
              <>
                <Ionicons name="camera-outline" size={40} color="#3B82F6" />
                <Text style={styles.uploadTapText}>Tap to upload ID card</Text>
                <Text style={styles.uploadHint}>JPG, PNG · Max 5MB</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#C4C9D4"
              secureTextEntry={!showPw}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPw(!showPw)}>
              <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Repeat your password"
              placeholderTextColor="#C4C9D4"
              secureTextEntry={!showCfm}
              value={confirm}
              onChangeText={setConfirm}
            />
            <TouchableOpacity onPress={() => setShowCfm(!showCfm)}>
              <Ionicons name={showCfm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.registerBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.registerBtnText}>{loading ? 'Creating account…' : 'Register'}</Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  inner: { paddingHorizontal: 24, paddingTop: 26, paddingBottom: 34 },

  back: { width: 40, height: 40, justifyContent: 'center' },

  logoWrap: { marginTop: 16, marginBottom: 18 },
  logoBox: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center',
  },

  title: { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748B', marginBottom: 28 },

  label: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 10 },

  uploadBox: {
    borderWidth: 1.5, borderColor: '#CBD5E1', borderStyle: 'dashed',
    borderRadius: 14, paddingVertical: 32,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, backgroundColor: '#FFFFFF', gap: 8,
  },
  uploadBoxDone: { borderColor: '#22C55E', borderStyle: 'solid', backgroundColor: '#F0FDF4' },
  uploadTapText: { fontSize: 15, fontWeight: '600', color: '#3B82F6' },
  uploadHint: { fontSize: 12, color: '#94A3B8' },
  uploadDoneText: { fontSize: 15, fontWeight: '600', color: '#22C55E' },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 14,
    marginBottom: 20, borderWidth: 1.5, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1E293B', padding: 0 },

  registerBtn: {
    backgroundColor: '#3B82F6', borderRadius: 14,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  registerBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
