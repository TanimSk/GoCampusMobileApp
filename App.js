import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './context/AuthContext';

// Student screens
import StudentLoginScreen    from './screens/StudentLoginScreen';
import CreateAccountScreen   from './screens/CreateAccountScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import StudentMapScreen      from './screens/StudentMapScreen';
import WalletScreen          from './screens/WalletScreen';
import ProfileScreen         from './screens/ProfileScreen';

// Driver screens
import DriverLoginScreen     from './screens/DriverLoginScreen';
import DriverDashboardScreen from './screens/DriverDashboardScreen';
import DriverMapScreen       from './screens/DriverMapScreen';
import ScannerScreen         from './screens/ScannerScreen';
import HistoryScreen         from './screens/HistoryScreen';
import EarningsScreen        from './screens/EarningsScreen';

const Root         = createNativeStackNavigator();
const StudentTab   = createBottomTabNavigator();
const DriverTab    = createBottomTabNavigator();

// ─── Tab bar config ───────────────────────────────────────────────────────────
const STUDENT_TABS = [
  { name: 'SDashboard', label: 'Dashboard', icon: 'home',   component: StudentDashboardScreen },
  { name: 'SMap',       label: 'Map',       icon: 'map',    component: StudentMapScreen },
  { name: 'Wallet',     label: 'Wallet',    icon: 'wallet', component: WalletScreen },
  { name: 'Profile',    label: 'Profile',   icon: 'person', component: ProfileScreen },
];

const DRIVER_TABS = [
  { name: 'DDashboard', label: 'Dashboard', icon: 'home',      component: DriverDashboardScreen },
  { name: 'DMap',       label: 'Map',       icon: 'map',       component: DriverMapScreen },
  { name: 'Scanner',    label: 'Scanner',   icon: 'qr-code',   component: ScannerScreen },
  { name: 'History',    label: 'History',   icon: 'time',      component: HistoryScreen },
  { name: 'Earnings',   label: 'Earnings',  icon: 'cash',      component: EarningsScreen },
];

function buildTabOptions(accentColor) {
  return ({ route }) => {
    const tabDef = [...STUDENT_TABS, ...DRIVER_TABS].find(t => t.name === route.name);
    return {
      headerShown: false,
      tabBarActiveTintColor: accentColor,
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingBottom: 8,
        paddingTop: 6,
        height: 68,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      tabBarLabel: tabDef?.label || route.name,
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? tabDef?.icon : `${tabDef?.icon}-outline`}
          size={22}
          color={color}
        />
      ),
    };
  };
}

function StudentTabs() {
  return (
    <StudentTab.Navigator screenOptions={buildTabOptions('#3B82F6')}>
      {STUDENT_TABS.map(t => (
        <StudentTab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </StudentTab.Navigator>
  );
}

function DriverTabs() {
  return (
    <DriverTab.Navigator screenOptions={buildTabOptions('#22C55E')}>
      {DRIVER_TABS.map(t => (
        <DriverTab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </DriverTab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Root.Navigator screenOptions={{ headerShown: false }}>
          <Root.Screen name="StudentLogin"  component={StudentLoginScreen} />
          <Root.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Root.Screen name="StudentMain"   component={StudentTabs} />
          <Root.Screen name="StudentHistory" component={HistoryScreen} />
          <Root.Screen name="DriverLogin"   component={DriverLoginScreen} />
          <Root.Screen name="DriverMain"    component={DriverTabs} />
        </Root.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
