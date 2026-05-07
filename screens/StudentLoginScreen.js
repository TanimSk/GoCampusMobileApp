import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function StudentLoginScreen({ navigation }) {
  const { signIn, signOut } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your Student ID and password.');
      return;
    }

    setLoading(true);

    try {
      const session = await signIn({
        id: studentId.trim(),
        password: password.trim(),
      });

      if (session.role !== 'STUDENT') {
        await signOut();
        Alert.alert('Access Denied', 'These credentials do not belong to a student account.');
        return;
      }

      navigation.replace('StudentMain');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <TouchableOpacity style={styles.back}>
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <View style={styles.logoBox}>
            <Ionicons name="person" size={30} color="#3B82F6" />
          </View>
        </View>

        <Text style={styles.title}>Student Login</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue</Text>

        <Text style={styles.label}>Student ID</Text>
        <View style={styles.inputRow}>
          <Ionicons name="card-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. STU-2024-001"
            placeholderTextColor="#C4C9D4"
            value={studentId}
            onChangeText={setStudentId}
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
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.loginBtnText}>{loading ? 'Signing in…' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate('CreateAccount')}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>Create Account</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={styles.ecartLink}
          onPress={() => navigation.navigate('DriverLogin')}
        >
          <MaterialCommunityIcons name="bus-electric" size={17} color="#64748B" />
          <Text style={styles.ecartLinkText}>  E-cart Driver Login</Text>
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
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center',
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

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },

  createBtn: {
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#3B82F6',
  },
  createBtnText: { color: '#3B82F6', fontSize: 16, fontWeight: '700' },

  ecartLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 22 },
  ecartLinkText: { fontSize: 14, color: '#64748B', fontWeight: '600', textDecorationLine: 'underline' },
});
