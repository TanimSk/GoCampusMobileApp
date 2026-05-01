import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Modal, TextInput,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRESET_AMOUNTS  = [50, 100, 200, 500];
const PAYMENT_METHODS = ['bKash', 'Nagad', 'Debit / Credit Card'];

function TopUpSheet({ visible, onClose, onConfirm }) {
  const [selected, setSelected] = useState(100);
  const [custom, setCustom]     = useState('100');
  const [method, setMethod]     = useState('bKash');

  const handleSelect = (amt) => { setSelected(amt); setCustom(String(amt)); };

  const handleConfirm = () => {
    const amount = parseInt(custom, 10);
    if (!amount || amount < 10) { Alert.alert('Invalid', 'Minimum top-up is ৳10.'); return; }
    onConfirm(amount, method);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Top Up Wallet</Text>
          <Text style={styles.sheetSubtitle}>Select Amount (৳)</Text>

          <View style={styles.presetsRow}>
            {PRESET_AMOUNTS.map(amt => (
              <TouchableOpacity
                key={amt}
                style={[styles.presetBtn, selected === amt && styles.presetBtnActive]}
                onPress={() => handleSelect(amt)}
              >
                <Text style={[styles.presetText, selected === amt && styles.presetTextActive]}>৳{amt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customInputRow}>
            <Text style={styles.currencyPrefix}>৳</Text>
            <TextInput
              style={styles.customInput}
              value={custom}
              onChangeText={v => { setCustom(v); setSelected(null); }}
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleConfirm} activeOpacity={0.85}>
            <Text style={styles.addBtnText}>Add ৳{custom || 0} to Wallet</Text>
          </TouchableOpacity>

          <Text style={styles.payViaLabel}>Pay via:</Text>
          <View style={styles.payMethodsRow}>
            {PAYMENT_METHODS.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.payMethodBtn, method === m && styles.payMethodActive]}
                onPress={() => setMethod(m)}
              >
                <Text style={[styles.payMethodText, method === m && styles.payMethodTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 20 }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function WalletScreen() {
  const [balance, setBalance]   = useState(485.50);
  const [showSheet, setShowSheet] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Wallet</Text>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceCardHeader}>
            <View style={styles.cardIconBox}>
              <Ionicons name="card" size={20} color="#FFF" />
            </View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>৳{balance.toFixed(2)}</Text>
          <Text style={styles.balanceSub}>GoCampus Wallet · Student Account</Text>
          <TouchableOpacity style={styles.topUpBtn} onPress={() => setShowSheet(true)} activeOpacity={0.85}>
            <Ionicons name="add" size={18} color="#3B82F6" />
            <Text style={styles.topUpBtnText}>Top Up Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Security note */}
        <View style={styles.securityBox}>
          <Ionicons name="shield-checkmark" size={20} color="#22C55E" />
          <Text style={styles.securityText}>
            All transactions are secured and encrypted. Your payment info is never stored on device.
          </Text>
        </View>
      </ScrollView>

      <TopUpSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onConfirm={(amount, method) => {
          setBalance(prev => prev + amount);
          setShowSheet(false);
          Alert.alert('Success! 🎉', `৳${amount} added via ${method}.`);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },

  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 20 },

  balanceCard: {
    backgroundColor: '#3B82F6', borderRadius: 20, padding: 24, marginBottom: 16,
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  balanceCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  cardIconBox: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  balanceLabel: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  balanceAmount: { fontSize: 44, fontWeight: '900', color: '#FFF', letterSpacing: -1, marginBottom: 8 },
  balanceSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 20 },
  topUpBtn: {
    backgroundColor: '#FFF', borderRadius: 12,
    paddingVertical: 13, paddingHorizontal: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  topUpBtnText: { fontSize: 15, fontWeight: '700', color: '#3B82F6' },

  securityBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#F0FDF4', borderRadius: 14,
    borderWidth: 1, borderColor: '#BBF7D0',
    padding: 16, gap: 10,
  },
  securityText: { flex: 1, fontSize: 13, color: '#166534', lineHeight: 19 },

  // Bottom Sheet
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheetWrap: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 12 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3, marginBottom: 4 },
  sheetSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 16 },

  presetsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  presetBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    alignItems: 'center', backgroundColor: '#F8FAFC',
  },
  presetBtnActive: { borderColor: '#3B82F6', backgroundColor: '#EEF2FF' },
  presetText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  presetTextActive: { color: '#3B82F6' },

  customInputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16,
  },
  currencyPrefix: { fontSize: 16, color: '#64748B', marginRight: 6, fontWeight: '600' },
  customInput: { flex: 1, fontSize: 18, color: '#0F172A', fontWeight: '700', padding: 0 },

  addBtn: {
    backgroundColor: '#3B82F6', borderRadius: 14,
    paddingVertical: 17, alignItems: 'center', marginBottom: 16,
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  addBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  payViaLabel: { fontSize: 13, color: '#64748B', marginBottom: 10 },
  payMethodsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  payMethodBtn: {
    paddingVertical: 9, paddingHorizontal: 16, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC',
  },
  payMethodActive: { borderColor: '#3B82F6', backgroundColor: '#EEF2FF' },
  payMethodText: { fontSize: 13, fontWeight: '500', color: '#64748B' },
  payMethodTextActive: { color: '#3B82F6', fontWeight: '700' },
});
