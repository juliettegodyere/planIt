import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useShoppingListContext } from "@/service/store";
import {setUser, setGuestUser } from "@/service/stateActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { guestUserType } from "../../service/types";

import { useShoppingActions, userTransactions } from "@/db/Transactions";
import LocationDetail from "./LocationDetail";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Auth() {
  const { addNewGuestUserAndUpdateState, updateGuestUserAndUpdateState } = userTransactions();
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const { state, dispatch } = useShoppingListContext();
  const {guest} = state
  const isLoggedIn = guest && guest.id && !guest.country;
  const {selectedCountry, currencyCode, currencySymbol } = useLocalSearchParams();
          const handleClose = () => setShowActionsheet(false);

  // const { shoppingItems } = state;
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
  
  console.log("Login Page")

  // const onGooglePress = () => {
  //   handleAuthLogin("google", dispatch);
  // };

  // const onFacebookPress = () => {
  //  // handleAuthLogin("facebook", dispatch, response);
  // };

  const handleGuestLogin = async () => {
    try {
      const guestUser = await addNewGuestUserAndUpdateState(); // should save to global state
      if (guestUser) {
        router.replace('/select-country'); // move them to select country
      }
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  };

  const handleGuestUserUpdate = async () => {
    console.log("Update user function")
    console.log(guest)
    console.log(guest.id)
    try {
      const guestUser = await updateGuestUserAndUpdateState({
        id: guest.id, // required!
        country: selectedCountry.toString(),
        currencyCode: currencyCode.toString(),
        currencySymbol: currencySymbol.toString()
      });
      if (guestUser) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  };
console.log(guest)
console.log(selectedCountry)
  return (
    <>
      <Box
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F1F1F1",
        }}
      >
        {(isLoggedIn) ? (
          <VStack className="w-full pt-5 px-5">
            {/* Header */}
            <HStack space="md" className="justify-center items-center">
              <VStack className="flex-1">
                <Heading size="2xl" bold={true} className="text-center mb-2">Provide Location Details</Heading>
              </VStack>
            </HStack>
  
            {/* Country & Currency Selection */}
            <VStack className="mt-6 space-y-6">
              {/* Country */}
              <Pressable
                onPress={() => {
                  router.push("/select-country");
                }}
                className="mb-5"
              >
                <HStack className="justify-between items-center">
                  <Heading size="lg">Country</Heading>
                  <HStack space="lg" className="items-center">
                  <Text>{selectedCountry ? selectedCountry : "Never"}</Text>
                    <Icon
                      as={ChevronRightIcon}
                      size="xl"
                      className="text-typography-500"
                    />
                  </HStack>
                </HStack>
              </Pressable>
  
              {/* Currency */}
              <Pressable className="mb-5">
                <HStack className="justify-between items-center">
                  <Heading size="lg">Currency</Heading>
                  <HStack space="lg" className="items-center">
                    <Text>{selectedCountry ? currencyCode : "Never"}</Text>
                    <Icon
                      as={ChevronRightIcon}
                      size="xl"
                      className="text-typography-500"
                    />
                  </HStack>
                </HStack>
              </Pressable>
  
              {/* Continue Button */}
              <Button 
                size="md" 
                variant="outline" 
                action={selectedCountry ? 'positive' : 'negative'} 
                onPress={handleGuestUserUpdate}
               // disabled={selectedCountry ? true : false}
                >
                <ButtonText>Continue</ButtonText>
              </Button>
            </VStack>
          </VStack>
        ) : (
          <VStack space="md" style={{alignItems:"center"}}>
            {/* Facebook Login */}
            <Button
              style={{
                width: 250,
                backgroundColor: "#3b5998",
                justifyContent: "center",
              }}
            >
              <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
                Login with Facebook
              </ButtonText>
            </Button>
  
            {/* Google Login */}
            <Button
              style={{
                width: 250,
                backgroundColor: "#DB4437",
                justifyContent: "center",
              }}
            >
              <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
                Login with Google
              </ButtonText>
            </Button>
  
            {/* Guest Login */}
            <Button
              onPress={handleGuestLogin}
              style={{
                width: 250,
                backgroundColor: "#3498db",
                justifyContent: "center",
              }}
            >
              <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
                Continue as a Guest
              </ButtonText>
            </Button>
          </VStack>
        )}
      </Box>
  
      {/* Optional Location Sheet */}
      {/* <LocationDetail
        showActionsheet={showActionsheet}
        handleClose={handleClose}
        setShowActionsheet={setShowActionsheet}
      /> */}
    </>
  );  
}
