import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DriverLoginScreen({ navigation }) {
  const [cartId, setCartId]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleLogin = () => {
    if (!cartId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter your Cart ID and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('DriverMain');
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="bus-electric" size={30} color="#22C55E" />
          </View>
        </View>

        <Text style={styles.title}>Driver Login</Text>
        <Text style={styles.subtitle}>Sign in with your cart credentials</Text>

        <Text style={styles.label}>Cart ID</Text>
        <View style={styles.inputRow}>
          <Ionicons name="keypad-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. EC-12"
            placeholderTextColor="#C4C9D4"
            value={cartId}
            onChangeText={setCartId}
            autoCapitalize="characters"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#C4C9D4"
            secureTextEntry={!showPw}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginBtn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginBtnText}>{loading ? 'Signing in…' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color="#166534" style={{ marginTop: 1 }} />
          <Text style={styles.infoText}>
            Driver accounts are registered by campus administration. Contact your supervisor for access.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={styles.studentLink}
          onPress={() => navigation.navigate('StudentLogin')}
        >
          <Ionicons name="arrow-back-outline" size={15} color="#64748B" />
          <Text style={styles.studentLinkText}>  Back to Student Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },

  back: { width: 40, height: 40, justifyContent: 'center' },

  logoWrap: { marginTop: 16, marginBottom: 18 },
  logoBox: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center',
  },

  title: { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748B', marginBottom: 28 },

  label: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 8 },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 14,
    marginBottom: 18, borderWidth: 1.5, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1E293B', padding: 0 },

  loginBtn: {
    backgroundColor: '#3B82F6', borderRadius: 14,
    paddingVertical: 17, alignItems: 'center', marginBottom: 20,
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  loginBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  infoBox: {
    flexDirection: 'row', backgroundColor: '#F0FDF4',
    borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#BBF7D0',
    alignItems: 'flex-start', gap: 10,
  },
  infoText: { flex: 1, fontSize: 13, color: '#166534', lineHeight: 19 },

  studentLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 22 },
  studentLinkText: { fontSize: 14, color: '#64748B', fontWeight: '600', textDecorationLine: 'underline' },
});
