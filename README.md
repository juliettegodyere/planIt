# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## 🛒 Shopping Cart App Roadmap

### 🧱 Phase 1: Setup & Core

#### ✅ Done
- [x] Setup folder structure for frontend and backend
- [x] Create React Native app using Expo
- [x] Setup development build using EAS
- [x] Design app icon and splash screen
- [x] Setup Gluestack for components
- [x] Setup Expo Router (stack + tab)
- [x] Configure local storage using AsyncStorage
- [x] Create sample shopping list data
- [x] Display data on the home page

#### 🚧 To Do
- [ ] Setup Spring Boot backend using Spring Initializr
- [ ] Set up Global State (recommend Zustand)
- [ ] Handle Guest Login (UUID, save to AsyncStorage)
- [ ] Handle Google Login (Expo AuthSession)
- [ ] Handle Facebook Login (Expo AuthSession)
- [ ] Link native modules properly for dev-client (Google, FB)
- [ ] Implement shopping list DB in backend
- [ ] Save items to localStorage (for guest users)
- [ ] Save items to backend (for logged-in users)

### 🛍️ Phase 2: Home Page
- [ ] Add FAB for input (open ActionSheet)
- [ ] Style item cards (checkbox, label)
- [ ] On checkbox click: show Quantity, Price, Priority
- [ ] Add "Mark as Bought" button

### 📜 Phase 3: History Page
- [ ] Group purchased items by date
- [ ] Modal to view item purchase history

### ⚙️ Phase 4: Settings Page
- [ ] Show user profile (name, email, etc)
- [ ] Display joined date, country, currency
- [ ] Notification preferences
- [ ] App version and build info

### 🧪 Phase 5: Final Touches
- [ ] Full testing: guest & logged-in flows
- [ ] Deploy Spring Boot backend to AWS (Elastic Beanstalk or EC2)
- [ ] Build Android + iOS apps with EAS
- [ ] Submit to App Store & Play Store

## Configure Development Build

```bash
 npm i -g eas-cli
```

```bash
 eas login
```

if you are not logged in

```bash
 eas init
```

Follow the prompt to create a project

```bash
 eas build:configure
```
Choose the platform you want to configure. An eas.json should be created in your project

```bash
 eas build --profile development --platform ios
```

is used to build your Expo app for iOS using EAS Build (Expo Application Services) with a custom build profile.

The subsequent prompts will ask you to allow install of `expo-dev-client`, the `iOS bundle identifier` you want, enter your `Apple account`, Then you register a device

```bash
   npx expo start --dev-client
```

This command starts the Metro bundler (your local development server) specifically for use with a development build of your app — aka the Expo Dev Client.