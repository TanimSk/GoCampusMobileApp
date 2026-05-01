import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MENU_ITEMS = [
  { id: 'id',     iconName: 'card',             label: 'My Student ID',     sub: 'STU-2024-001' },
  { id: 'rides',  iconName: 'bus',              label: 'My Ride History',   sub: '34 total rides' },
  { id: 'wallet', iconName: 'wallet',           label: 'Wallet & Payments', sub: '৳485.50 balance' },
  { id: 'notif',  iconName: 'notifications',   label: 'Notifications',     sub: 'Enabled' },
  { id: 'help',   iconName: 'chatbubble-ellipses', label: 'Help & Support', sub: 'FAQ, contact' },
  { id: 'about',  iconName: 'information-circle', label: 'About GoCampus', sub: 'v1.0.0' },
];

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => navigation.replace('StudentLogin') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.bigAvatar}>
            <Text style={styles.bigAvatarText}>AJ</Text>
          </View>
          <Text style={styles.profileName}>Alex Johnson</Text>
          <Text style={styles.profileId}>STU-2024-001</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#166534" />
            <Text style={styles.verifiedText}> Verified Student</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                <View style={styles.menuIconBox}>
                  <Ionicons name={item.iconName} size={20} color="#64748B" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSub}>{item.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>
              {i < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}> Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  pageTitle: {
    fontSize: 28, fontWeight: '800', color: '#0F172A',
    letterSpacing: -0.5, paddingHorizontal: 24,
    paddingTop: 20, paddingBottom: 20,
  },

  profileCard: {
    backgroundColor: '#FFF', marginHorizontal: 24, borderRadius: 20,
    padding: 24, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  bigAvatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  bigAvatarText: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  profileName: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  profileId: { fontSize: 14, color: '#64748B', marginBottom: 12 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#DCFCE7', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  verifiedText: { fontSize: 13, fontWeight: '700', color: '#166534' },

  menuCard: {
    backgroundColor: '#FFF', marginHorizontal: 24, borderRadius: 20,
    overflow: 'hidden', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 16,
  },
  menuIconBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  menuTextCol: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  menuSub: { fontSize: 12, color: '#94A3B8' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 18 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 24, borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: '#FEF2F2', borderWidth: 1.5, borderColor: '#FECACA',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#EF4444' },
});
