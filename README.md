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

🛒 Shopping Cart App — Roadmap
An offline-first shopping list app using React Native + SQLite with support for guest usage and optional cloud sync later.

🧱 Phase 1: Core Setup
✅ ## Completed
✅ Project structure (frontend & backend)

✅ Created Expo app with EAS build

✅ App icon and splash screen

✅ Expo Router (stack + tab navigation)

✅ UI with Gluestack components

✅ React Context for global state

✅ Removed AsyncStorage (using SQLite instead)

✅ Sample shopping list data displayed

🚧 ## In Progress
☐ Setup Spring Boot backend (for optional sync)

☐ Guest login (UUID stored in SQLite)

☐ Google & Facebook login (via Expo AuthSession)

☐ Save items in SQLite for guests

☐ Save items to backend for logged-in users

🛍️ ## Phase 2: Inventory Management (SQLite)
✅ Add items (FAB + ActionSheet)

✅ Style item cards (checkbox, label)

✅ On check: show Quantity, Price, Priority

✅ "Mark as Bought" functionality

✅ Filter by category

✅ Sort by selection & alphabetically

✅ Search items by query (real-time typing)

✅ Merge user-defined & pre-defined items

✅ Persist all items using SQLite

📜 ## Phase 3: Purchase History
✅ Group purchased items by date

✅ Modal to view item history

☐ Re-add items from history to list

⚙️ ## Phase 4: Settings Page
✅ Show user info (name, email, etc.)

✅ Display joined date, country, currency

☐ Notification preferences

☐ App version and build info

🌐 ## Phase 5: Cloud Sync (Optional)
Enables syncing for logged-in users (Google/Facebook)

☐ Set up Spring Boot backend

☐ API to sync items and user info

☐ Handle login (Google / Facebook)

☐ Push/pull sync from SQLite

☐ Handle offline-to-online sync

🧪 ## Final Phase: Polish & Deploy
☐ Full testing (guest & logged-in flows)

☐ Deploy backend to AWS (Elastic Beanstalk / EC2)

☐ Build Android & iOS with EAS

☐ Publish to App Store & Google Play

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


TODOs
1. Complete the guest login
2. Implement the offline mode ✅
3. On the right of the item in history, show how many times the item has been purchades
3. Make the history details editable
4. Make it possible for users to add notes on the history details page
5. Add info on the profile page to inform users to sign up with social media login and the importance
5. Add notification - Whe there is new upgrade
6. Add app version in the profile page