# HEARTLINK Mobile App (React Native with Expo)

This is the dedicated cross-platform mobile application for **HEARTLINK** (Android & iOS), built with **React Native (Expo)**, TypeScript, and Lucide Icons.

---

## 📱 Mobile Screens & Features

1. **🌹 Dating**:
   - Modern portrait card deck
   - Smooth swipe gestures (Like, Pass, Super Like)
   - Compatibility scoring badges
   - Real-time mutual match celebration modal
2. **💍 AI Matchmaking**:
   - Natural language search bar (e.g. *"Someone from Kolkata who wants marriage"*)
   - Quick search chips
   - Multi-vector compatibility cards (Values, Lifestyle, Interests, Location)
   - One-tap Connect button
3. **🎭 Blind Matchmaking**:
   - Anonymous persona badge (e.g. *Starlit Architect*, *Midnight Philosopher*)
   - Zero identity leaks (photos & real names hidden until mutual consent)
   - **Mutual Consent Reveal Handshake button**
4. **💬 Messages / Chat**:
   - Live real-time chat with read receipts and timestamps
   - Separate tabs for Direct Matches and Blind Matches
   - Instant response simulator for testing
5. **👤 Profile & VIP Club**:
   - User profile details
   - **1-Click Persona Switcher** (Sophia, Aryan, Priya, Elena, Marcus, Admin)
   - Gold & Platinum VIP test checkout upgrades

---

## 🚀 Running the Mobile App

### Step 1: Ensure the Backend Server is Running
In the root `heartlink` directory:
```bash
npm start
```
(Server operates at `http://localhost:3000`).

### Step 2: Start the Expo Development Server
In the `mobile` directory:
```bash
cd mobile
npm start
```

### Step 3: Test on Your Phone or Emulator
- **On Real Android or iPhone**:
  1. Install the free **Expo Go** app from Google Play Store or Apple App Store.
  2. Scan the QR code displayed in the terminal.
  3. The HEARTLINK app will load directly on your phone!
- **On Web Browser (Instant Preview)**:
  - Press `w` in the terminal to view the interactive mobile simulator in Chrome.
- **On Android Emulator**:
  - Press `a` in the terminal.
- **On iOS Simulator (Mac)**:
  - Press `i` in the terminal.

---

## 📦 Building Standalone APK / IPA for App Stores

To generate production APK/AAB files for Google Play and IPA files for Apple App Store:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in and configure:
   ```bash
   eas login
   eas build:configure
   ```
3. Build for Android (`.apk` / `.aab`):
   ```bash
   eas build --platform android --profile preview
   ```
4. Build for iOS (`.ipa`):
   ```bash
   eas build --platform ios
   ```
