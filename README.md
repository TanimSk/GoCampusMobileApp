# GoCampus – Unified Campus Cart App

A React Native (Expo) app for both **students** and **e-cart drivers** on campus.

## App Flow

App Launch → Student Login (default)
  ├─ Create Account
  ├─ Student App  tabs: Dashboard, Map, Wallet, Profile
  └─ [E-cart Driver Login] link → Driver Login → Driver App tabs: Dashboard, Scanner, History, Earnings

## Setup & Run

npm install
npx expo start         # scan QR with Expo Go
npx expo start --android   # or use emulator

## Key Dependencies
- @react-navigation/native + native-stack + bottom-tabs
- react-native-svg  (campus map)
- expo-camera       (QR scanning)
