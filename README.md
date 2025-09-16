# Welcome to planit 👋

planIt is a smart shopping list app that helps users quickly create and manage shopping lists. Users can choose from millions of preloaded items or manually add custom entries. The app also tracks completed purchases, stores shopping history, and makes future shopping faster and more organized.

## 🛠️ Tech Stack

This project is built with the following technologies:

1. **[Expo](https://expo.dev/)** – For building and deploying the React Native app seamlessly.  
2. **[Gluestack](https://gluestack.io/)** – UI component library for fast and accessible design.  
3. **[TypeScript](https://www.typescriptlang.org/)** – Ensures type safety and better developer experience.  
4. **[EAS (Expo Application Services)](https://docs.expo.dev/eas/)** – Used for building, testing, and deploying the app to iOS/Android.  
5. **[SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)** – Local persistent storage for offline-first functionality.  

## 🚀 Getting Started

### 1. Install EAS CLI

```bash
 npm i -g eas-cli
```
### 2. Log in to Expo

```bash
 eas login
```
(If you are not already logged in, follow the prompts.)

### 3. Initialize EAS in your project

```bash
 eas init
```
Follow the interactive setup to create or link your project.

### 4. Configure EAS build

```bash
 eas build:configure
```
Select your platform (iOS/Android). This creates an eas.json configuration file in your project.

### 🛠 Development Build (Local Testing)

```bash
 eas build --profile development --platform ios
```

- Installs expo-dev-client
- Prompts for iOS bundle identifier
- Asks for Apple Developer credentials
- Lets you register your device for development builds

Once built, run:

```bash
   npx expo start --dev-client
```

This starts the Metro bundler for the Expo Dev Client.

### 👀 Preview / Test Build

Preview builds are useful for sharing with testers before going to production.

✅ Step 1: Add a `preview` profile to `eas.json`:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "store"
    }
  }
}

```

✅ Step 2: Build for preview

iOS:

```bash
eas build --profile preview --platform ios
```
Android:

```bash
eas build --profile preview --platform android
```
- Generates an .ipa file signed with your Apple credentials
- Android → generates APK for internal testers or sideloading
- You can install directly on registered devices or upload to TestFlight

✅ Step 3: Install on device
- iOS: Use .ipa or upload to TestFlight
- Android: Install APK directly or upload to Google Play Internal Testing

### 📦 Production Build (App Store / Play Store)

When you’re ready to release:
iOS:

```bash
eas build --profile production --platform ios
```

```bash
eas submit --platform ios
```
- Generates App Store–ready .ipa
- Upload via Transporter or EAS Submit
- Sends build to App Store Connect for review

Android:

```bash
eas build --profile production --platform android
```
- Generates an App Store–ready .ipa
- Upload via Transporter (Mac) or directly through EAS

```bash
eas submit --platform android
```
- Generates AAB (Android App Bundle) for Google Play
- Upload via EAS Submit or directly to Play Console
- Can also generate APK for manual distribution if needed

This sends the build to the App Store for review.