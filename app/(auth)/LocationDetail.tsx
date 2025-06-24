import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

type Prop = {
  showActionsheet: boolean;
  setShowActionsheet: (val: boolean) => void;
  handleClose: () => void;
};

export default function LocationDetail({ showActionsheet, handleClose, setShowActionsheet }: Prop) {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const router = useRouter();
  return (
    <Actionsheet isOpen={showActionsheet} onClose={handleClose} snapPoints={[36]}>
      <KeyboardAvoidingView
        behavior="position"
        style={{ position: "relative", flex: 1, justifyContent: "flex-end" }}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full pt-5">
            <HStack space="md" className="justify-center items-center">
              <VStack className="flex-1">
                <Text className="font-bold">Location Details</Text>
              </VStack>
            </HStack>
            <VStack className="mt-6">
              {/* Country */}
              <Pressable onPress={() => {
                router.push("/select-country")
                setShowActionsheet(false)
              }}>
                <HStack className="justify-between">
                  <Heading size="lg">Country</Heading>
                  <HStack space="lg">
                    <Text>{selectedCountry || "Never"}</Text>
                    <Icon as={ChevronRightIcon} size="xl" className="text-typography-500" />
                  </HStack>
                </HStack>
              </Pressable>

              {/* Currency (optional similar logic) */}
              <Pressable>
                <HStack className="justify-between my-6">
                  <Heading>Currency</Heading>
                  <HStack space="md">
                    <Text>Never</Text>
                    <Icon as={ChevronRightIcon} size="xl" className="text-typography-500" />
                  </HStack>
                </HStack>
              </Pressable>

              <Button size="md" variant="solid" action="primary" className="mt-2">
                <ButtonText>Continue</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
  );
}
