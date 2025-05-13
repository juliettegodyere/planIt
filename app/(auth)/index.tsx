import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { handleGuestLogin, handleAuthLogin } from "@/service/authentication";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useShoppingListContext } from "@/service/store";
import {setUser, setGuestUser } from "@/service/stateActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useRouter } from "expo-router";

export default function Auth() {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItems } = state;
  const router = useRouter();

  // GoogleSignin.configure({
  //   webClientId: '', 
  //   scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  //   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //   forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  //   iosClientId: '', 
  //   profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  // });
 

  useEffect(() => {
   
  }, []);
  

  // const onGooglePress = () => {
  //   handleAuthLogin("google", dispatch);
  // };

  // const onFacebookPress = () => {
  //  // handleAuthLogin("facebook", dispatch, response);
  // };

  return (
    <Box
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F0FA",
      }} // light blue background
    >
      {/* <Button
        onPress={() => onFacebookPress()}
        style={{
          width: 250,
          backgroundColor: "#3b5998", // Facebook blue
          marginVertical: 8,
          justifyContent: "center",
        }}
      >
        <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
          Login with Facebook
        </ButtonText>
      </Button>

      <Button
        // onPress={() => promptAsync()}
        style={{
          width: 250,
          backgroundColor: "#DB4437", // Google red
          marginVertical: 8,
          justifyContent: "center",
        }}
      >
        <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
          Login with Google
        </ButtonText>
      </Button> */}

      <Button
        onPress={() => handleGuestLogin(dispatch, () => router.replace('/(tabs)'))}
        style={{
          width: 250,
          backgroundColor: "#3498db", // Your primary blue
          marginVertical: 8,
          justifyContent: "center",
        }}
      >
        <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
          Continue as a Guest
        </ButtonText>
      </Button>
      {/* <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onGooglePress}
      /> */}
       
    </Box>
  );
}
