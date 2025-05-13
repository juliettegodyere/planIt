import AsyncStorage from "@react-native-async-storage/async-storage";
import { setGuestUser, setUser } from "./stateActions";
import { ShoppingListAction } from "./store";
import { Dispatch } from "react";
import { UserInfo, GuestUserInfo } from "./state";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
  User
} from '@react-native-google-signin/google-signin';
import { useRouter } from "expo-router";

// Android client ID: 718749830947-mi51a4ggbaopkvfk4g3pknt3bq3d5m6u.apps.googleusercontent.com
// IOS Client ID: 718749830947-15fiuodcrenfveajk45uq0emn9fle5tl.apps.googleusercontent.com

export const handleGuestLogin = async (
  dispatch: Dispatch<ShoppingListAction>,
  onSuccess: () => void
) => {
  const userDetails = {
    sessionId: `guest-${Date.now()}`,
    name: "Guest",
    createdAt: new Date().toISOString(),
    country: "",
    currency: "",
  };
  const guest = await AsyncStorage.getItem("@guestUser");

  if (guest) {
    try {
      const parsedGuest: GuestUserInfo = JSON.parse(guest);
      dispatch(setGuestUser(parsedGuest));
      onSuccess()
    } catch (err) {
      console.error("Failed to parse guest:", err);
    }
  } else {
    try {
      setGuestUser(userDetails);
      await AsyncStorage.setItem("@guestUser", JSON.stringify(userDetails));
      onSuccess()
    } catch (error) {
      console.error("Failed to save guest user:", error);
    }
  }
};


export const handleAuthLogin = async (
  provider: "google" | "facebook",
  dispatch: Dispatch<ShoppingListAction>,
) => {
  console.log("Provider:", provider);

  const user = await AsyncStorage.getItem("@user");

  if (provider === "google") {
    try {
      // Ensure Google Play Services are available (Android only)
      await GoogleSignin.hasPlayServices();

      // Begin Google Sign-In
      const response = await GoogleSignin.signIn();

      // Save to AsyncStorage and dispatch
      //await AsyncStorage.setItem("@user", JSON.stringify(userInfo));
      //dispatch(setUser(userInfo));
      console.log("Signed in user:", response.data);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Login already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available or outdated.");
      } else {
        console.log("Some other error occurred.");
      }
    }
  } else if (provider === "facebook") {
    // TODO: Handle Facebook logic here
  }
};

const getUserInfo = async (
  token: string,
  dispatch: Dispatch<ShoppingListAction>
) => {
  if (!token) return;

  try {
    const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await res.json();
    console.log(user);
    await AsyncStorage.setItem("@user", JSON.stringify(user));
    dispatch(setUser(user));
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }
};
