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

## TODOs
- Setup a folder to contain the front end and backend ✅
- Create React native app using Expo ✅
- Setup development build using EAS ✅
- Design the app icon and the splash screen ✅
- Setup Glustack for components ✅
- Setup expo router ✅
- Setup expo Stack router in route Layout ✅
- Setup expo Tab router - Home, History, Setting ✅
- Handle Guest login
- Handle OAuth login - Facebook and Google (Frontend)
- Setup the springboot using initialize
- Handle OAuth login - Facebook and Google (backend)
- Setup Global state
- Create shoppinglist data ✅
- Display data on the index page using Flatview
- Style the list items in the frontend
- Design the shoppinglist database
- handle Saving of user input on the frontend
- handle Saving of user input on the backend
- Handle the History page
- Handle the setting page
- Test application
- deploy the backend on AWS
- deploy the fronend on the App store

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

The subsequent prompts will ask you to allow install of `expo-dev-client`, the `iOS bundle identifier` you want want, enter your `Apple account`, Then you register a device