import React, {useState } from "react";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import {theme} from '../../assets/colors'

export default function Auth() {
  const [isGuestLoggingIn, setGuestLoggingIn] = useState(false);

  const router = useRouter();

  const handleGuestLogin = async () => {
    router.replace({
      pathname: "/select-country",
      params: { page: "/(tabs)", mode: "create" },
    });
  };

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
          <VStack space="md" style={{ alignItems: "center" }}>
            <Button
              onPress={handleGuestLogin}
              disabled={isGuestLoggingIn}
              style={{
                width: 250,
                backgroundColor: isGuestLoggingIn ? "#A0AEC0" : theme.colors.buttonPrimary, 
                justifyContent: "center",
                opacity: isGuestLoggingIn ? 0.6 : 1,
              }}
            >
              <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
                {isGuestLoggingIn ? "Loading..." : "Continue as a Guest"}
              </ButtonText>
            </Button>
          </VStack>
      </Box>
    </>
  );
}
