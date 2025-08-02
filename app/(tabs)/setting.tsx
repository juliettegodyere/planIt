import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "@/service/store";
import CustomSelectItem from "@/components/CustomSelectItem";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { userTransactions } from "@/db/Transactions";
import { CloseIcon, Icon, RemoveIcon } from "@/components/ui/icon";
import { removeGuestUser } from "@/service/stateActions";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";

interface ConfirmActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmLabel?: string;
}

export default function Settings() {
  const { state, dispatch } = useShoppingListContext();
  const { guest } = state;
  const isLoggedIn = guest && guest.id && !guest.countryName;
  const [confirmType, setConfirmType] = useState<"logout" | "delete" | null>(
    null
  );
  const { selectedCountry, currencyCode, currencySymbol } =
    useLocalSearchParams();
  const { deleteGuestUser, updateGuestUserAndUpdateState } = userTransactions();
  const router = useRouter();

  useEffect(() => {
    if(!guest){
      router.push("/(auth)")
    }
  }, [state]);

  const handleGuestUserUpdate = async () => {
    if (!guest?.id) {
      console.warn("Guest ID is not available yet.");
      return; // or show a toast / error to user
    }

    try {
      const guestUser = await updateGuestUserAndUpdateState({
        id: guest.id,
        countryName: selectedCountry.toString(),
        currencyCode: currencyCode.toString(),
        currencySymbol: currencySymbol.toString(),
      });

      if (guestUser) {
        router.replace("/setting");
      }
    } catch (error) {
      console.error("Guest login failed:", error);
    }
  };

  // const handleGuestUserDelete = () => {
  //   if (!guest?.id) {
  //     console.warn("Guest ID is not available yet.");
  //     return; // or show a toast / error to user
  //   }
  //   deleteGuestUser(guest.id)
  // }

  // const handleGuestUserLogout = () => {
  //   dispatch(removeGuestUser());
  // }

  const handleGuestUserDelete = () => {
    setConfirmType("delete");
  };

  const handleGuestUserLogout = () => {
    setConfirmType("logout");
  };

  const handleConfirm = async () => {
    if (confirmType === "logout") {
      dispatch(removeGuestUser());
    } else if (confirmType === "delete" && guest?.id) {
      await deleteGuestUser(guest.id); // wrap in try/catch optionally
    }
    setConfirmType(null); // close modal
  };

  return (
    <Box className="p-2">
      <VStack>
        <Card size="md" variant="elevated" className="">
          <HStack space="md">
            <Avatar className="bg-indigo-600">
              <AvatarFallbackText className="text-white">
                {guest?.name}
              </AvatarFallbackText>
              <AvatarBadge />
            </Avatar>
            <VStack>
              <Heading size="lg">{guest?.name}</Heading>
              <Text size="md">sessionId: {guest?.id}</Text>
            </VStack>
          </HStack>
        </Card>
        <Card className="mt-2" style={{ backgroundColor: "#F1F1F1" }}>
          <Heading>Location Details</Heading>
          <Card className="mt-2">
            <CustomSelectItem
              name={(selectedCountry as string) ?? guest?.countryName ?? ""}
              currencyCode={
                (currencyCode as string) ?? guest?.currencyCode ?? ""
              }
              symbol={(currencySymbol as string) ?? guest?.currencySymbol ?? ""}
              handleGuestUserUpdate={handleGuestUserUpdate}
              page={"/setting"}
            />
          </Card>
        </Card>
        <Card className="mt-2" style={{ backgroundColor: "#F1F1F1" }}>
          <Heading>Settings & Tools</Heading>
          <Card className="mt-2">
            <VStack space="lg">
              <Pressable onPress={handleGuestUserDelete}>
                <HStack space="lg">
                  {/* <Icon as={RemoveIcon} size="md" /> */}
                  <AntDesignIcon
                    size={15}
                    name="delete"
                    color="#888"
                    className="mt-1"
                  />
                  <Text className="color-red-600 font-bold text-lg">
                    Delete
                  </Text>
                </HStack>
              </Pressable>

              <Pressable onPress={handleGuestUserLogout}>
                <HStack space="lg">
                  {/* <Icon as={RemoveIcon} size="md" /> */}
                  <AntDesignIcon
                    size={15}
                    name="logout"
                    color="#888"
                    className="mt-1"
                  />
                  <Text className="color-blue-600 font-bold text-lg">
                    Log Out
                  </Text>
                </HStack>
              </Pressable>
            </VStack>
          </Card>
        </Card>

        <Card className="mt-2" style={{backgroundColor:"#F1F1F1"}}>
        <Heading >App Information</Heading>
          <Card className="mt-2">
          <VStack space="xl">
              <Pressable>
                <HStack className="justify-between">
                  <Text className="text-lg text-gray-900 font-bold">App Version</Text>
                  <Text className="text-lg text-gray-900 font-normal">1.0.0</Text>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack  className="justify-between">
                  <Text  className="text-lg text-gray-900 font-bold">Build</Text>
                  <Text className="text-lg text-gray-900 font-normal">exposdk:53.0.0</Text>
                </HStack>
              </Pressable>
            </VStack>
          </Card>
        </Card> 
      </VStack>
      <ConfirmActionSheet
        isOpen={confirmType !== null}
        onClose={() => setConfirmType(null)}
        onConfirm={handleConfirm}
        title={
          confirmType === "logout"
            ? "Are you sure you want to logout?"
            : "Are you sure you want to delete this guest account?"
        }
        confirmLabel={confirmType === "logout" ? "Logout" : "Delete"}
      />
    </Box>
  );
}

export const ConfirmActionSheet: React.FC<ConfirmActionSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmLabel = "Confirm",
}) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="pb-10">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack
          space="md"
          className="min-w-full px-4"
          style={{ alignItems: "flex-start" }}
        >
          {/* Close button row */}
          <Pressable onPress={onClose} style={{ alignSelf: "flex-end" }}>
            <HStack className="justify-end w-full">
              <Icon
                as={CloseIcon}
                size="lg"
                className="stroke-background-500"
              />
            </HStack>
          </Pressable>

          {/* Title */}
          <Text className="font-bold text-lg text-gray-900">{title}</Text>

          {/* Confirm button */}
          <Pressable onPress={onConfirm} className="w-full">
            <HStack space="lg">
              {/* <Icon as={RemoveIcon} size="md" /> */}
              <AntDesignIcon
                size={15}
                name="logout"
                color="#888"
                className="mt-1 "
              />
              <Text
                className={`font-medium text-lg ${
                  confirmLabel === "Logout" ? "text-blue-600" : "text-red-600"
                }`}
              >
                {confirmLabel}
              </Text>
            </HStack>
          </Pressable>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
