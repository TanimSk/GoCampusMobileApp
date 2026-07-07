import React, { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getStudentProfile, getStudentStats } from '../api/gocampus';
import { formatCurrency, getInitials } from '../utils/formatters';

export default function ProfileScreen({ navigation }) {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadProfile() {
        if (!session?.accessToken) {
          return;
        }

        setLoading(true);

        try {
          const [profileData, statsData] = await Promise.all([
            getStudentProfile(session.accessToken),
            getStudentStats(session.accessToken),
          ]);

          if (!active) {
            return;
          }

          setProfile(profileData);
          setStats(statsData);
        } catch (error) {
          if (active) {
            Alert.alert('Unable to Load Profile', error.message || 'Please try again.');
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadProfile();

      return () => {
        active = false;
      };
    }, [session?.accessToken])
  );

  const menuItems = [
    { id: 'id', iconName: 'card', label: 'My Student ID', sub: profile?.student_id_num || session?.user?.username || 'Unavailable' },
    { id: 'rides', iconName: 'bus', label: 'My Ride History', sub: `${stats?.total_rides ?? 0} total rides` },
    { id: 'wallet', iconName: 'wallet', label: 'Wallet & Payments', sub: `${formatCurrency(stats?.balance)} balance` },
    { id: 'verified', iconName: 'checkmark-circle', label: 'Account Status', sub: 'Verified Student' },
    { id: 'about', iconName: 'information-circle', label: 'About GoCampus', sub: 'Live API connected' },
  ];

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.replace('StudentLogin');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.bigAvatar}>
            <Text style={styles.bigAvatarText}>{getInitials(profile?.student_name, 'ST')}</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <>
              <Text style={styles.profileName}>{profile?.student_name || 'Student'}</Text>
              <Text style={styles.profileId}>{profile?.student_id_num || session?.user?.username}</Text>
            </>
          )}
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#166534" />
            <Text style={styles.verifiedText}> Verified Student</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
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
              {i <menuItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}> Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 34 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  pageTitle: {
    fontSize: 28, fontWeight: '800', color: '#0F172A',
    letterSpacing: -0.5, paddingHorizontal: 24,
    paddingTop: 30, paddingBottom: 20,
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
