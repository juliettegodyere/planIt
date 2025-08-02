import React, {useState } from "react";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { useShoppingListContext } from "@/service/store";
import { userTransactions } from "@/db/Transactions";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomSelectItem from "@/components/CustomSelectItem";
import { Card } from "@/components/ui/card";

export default function Auth() {
  const { state, dispatch } = useShoppingListContext();
  const { guest } = state;
  const [isGuestLoggingIn, setGuestLoggingIn] = useState(false);
  // const isLoggedIn = guest && guest.id && !guest.country;
  const needsLocationInfo = guest?.id && !guest.countryName;

  const { selectedCountry, currencyCode, currencySymbol } =
    useLocalSearchParams();

  const router = useRouter();

  // const handleGuestLogin = async () => {
  //   console.log("I was clicked")
  //   if (isGuestLoggingIn) return;
  //   setGuestLoggingIn(true);
  //   try {
  //     const guestUser = await addNewGuestUserAndUpdateState();
  //     if (guestUser) {
  //       router.replace("/select-country");
  //     }
  //   } catch (error) {
  //     console.error("Guest login failed:", error);
  //   } finally {
  //     setGuestLoggingIn(false);
  //   }
  // };
  const handleGuestLogin = async () => {
    // if (isGuestLoggingIn) return;
    // setGuestLoggingIn(true);
    router.replace("/select-country");
    // try {
    //   const guestUser = await addNewGuestUserAndUpdateState();
    //   if (guestUser) {
    //     router.replace("/select-country");
    //   }
    // } catch (error) {
    //   console.error("Guest login failed:", error);
    // } finally {
    //   setGuestLoggingIn(false);
    // }
  };
  // const handleGuestUserUpdate = async () => {
  //   if (!guest?.id) {
  //     console.warn("Guest ID is not available yet.");
  //     return;
  //   }

  //   if (!selectedCountry && !currencyCode && !currencySymbol) {
  //     console.warn(
  //       "selectedCountry, currencyCode, currencySymbol are not available yet."
  //     );
  //     return;
  //   }

  //   try {
  //     const guestUser = await updateGuestUserAndUpdateState({
  //       id: guest.id,
  //       countryName: selectedCountry.toString(),
  //       currencyCode: currencyCode.toString(),
  //       currencySymbol: currencySymbol.toString(),
  //     });

  //     if (guestUser) {
  //       router.replace("/(tabs)");
  //     }
  //   } catch (error) {
  //     console.error("Guest login failed:", error);
  //   }
  // };

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
        {/* {needsLocationInfo ? (
          <Card className="w-full pb-10">
            <HStack space="md" className="justify-center items-center">
              <VStack className="flex-1">
                <Heading size="2xl" bold={true} className="text-center my-10">
                  Provide Location Details
                </Heading>
              </VStack>
            </HStack>
            <CustomSelectItem
              name={(selectedCountry as string) ?? guest?.country ?? ""}
              currencyCode={
                (currencyCode as string) ?? guest?.currencyCode ?? ""
              }
              symbol={(currencySymbol as string) ?? guest?.currencySymbol ?? ""}
              handleGuestUserUpdate={handleGuestUserUpdate}
              page={"/(auth)"}
            />
          </Card>
        ) : ( */}
          <VStack space="md" style={{ alignItems: "center" }}>
            {/* Facebook Login */}
            {/* <Button
              style={{
                width: 250,
                backgroundColor: "#3b5998",
                justifyContent: "center",
              }}
            >
              <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
                Login with Facebook
              </ButtonText>
            </Button> */}

            {/* Google Login */}
            {/* <Button
              style={{
                width: 250,
                backgroundColor: "#DB4437",
                justifyContent: "center",
              }}
            >
              <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
                Login with Google
              </ButtonText>
            </Button> */}

            {/* Guest Login */}
            <Button
              onPress={handleGuestLogin}
              disabled={isGuestLoggingIn}
              style={{
                width: 250,
                backgroundColor: isGuestLoggingIn ? "#A0AEC0" : "#3498db", // gray if loading
                justifyContent: "center",
                opacity: isGuestLoggingIn ? 0.6 : 1, // optional visual feedback
              }}
            >
              <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
                {isGuestLoggingIn ? "Loading..." : "Continue as a Guest"}
              </ButtonText>
            </Button>
          </VStack>
        {/* )} */}
      </Box>
    </>
  );
}
