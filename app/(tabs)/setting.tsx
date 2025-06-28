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
import {
  getCurrencyLabelByValue,
  getCurrencyByCountry,
} from "../../Util/HelperFunction";
import { router, useLocalSearchParams } from "expo-router";
import { userTransactions } from "@/db/Transactions";
import { CloseIcon, Icon, RemoveIcon } from "@/components/ui/icon";
import { removeGuestUser } from "@/service/stateActions";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from "@/components/ui/actionsheet";

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
  const isLoggedIn = guest && guest.id && !guest.country;
  const [confirmType, setConfirmType] = useState<"logout" | "delete" | null>(null);
  const { selectedCountry, currencyCode, currencySymbol } =
    useLocalSearchParams();
  const { deleteGuestUser, updateGuestUserAndUpdateState } =
    userTransactions();

  useEffect(() => {}, [getCurrencyLabelByValue, getCurrencyByCountry]);

  const handleGuestUserUpdate = async () => {
    if (!guest?.id) {
      console.warn("Guest ID is not available yet.");
      return; // or show a toast / error to user
    }

    try {
      const guestUser = await updateGuestUserAndUpdateState({
        id: guest.id,
        country: selectedCountry.toString(),
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
    <Box>
      <VStack>
        <Card size="md" variant="elevated" className="m-3">
          <HStack space="md">
            <Avatar className="bg-indigo-600">
              <AvatarFallbackText className="text-white">
                {guest?.name}
              </AvatarFallbackText>
              <AvatarBadge />
            </Avatar>
            <VStack>
              <Heading size="sm">{guest?.name}</Heading>
              <Text size="sm">sessionId: {guest?.id}</Text>
            </VStack>
          </HStack>
        </Card>
        <Heading className="pt-5 px-5">Location Details</Heading>
        <VStack className="w-full px-5">
          <Card size="md" variant="elevated" className="m-3">
            <CustomSelectItem
              name={(selectedCountry as string) ?? guest?.country ?? ""}
              currencyCode={
                (currencyCode as string) ?? guest?.currencyCode ?? ""
              }
              symbol={(currencySymbol as string) ?? guest?.currencySymbol ?? ""}
              handleGuestUserUpdate={handleGuestUserUpdate}
              page={"/setting"}
            />
          </Card>
        </VStack>

        <Heading className="pt-5 px-5">Settings And Tools</Heading>
        <VStack className="w-full px-5">
          <Card size="md" variant="elevated" className="m-3">
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
                  <Text className="color-red-600 font-medium">Delete</Text>
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
                  <Text className="color-blue-600 font-medium">Log Out</Text>
                </HStack>
              </Pressable>
            </VStack>
          </Card>
        </VStack>

        <Heading className="pt-5 px-5">App Information</Heading>
        <VStack className="w-full px-5">
          <Card size="md" variant="elevated" className="m-3">
            <VStack space="lg">
              <Pressable>
                <HStack className="justify-between">
                  <Text className="font-medium">App Version</Text>
                  <Text className="font-medium">2025.12</Text>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack className="justify-between">
                  <Text className="font-medium">Build</Text>
                  <Text className="font-medium">20250611.150806</Text>
                </HStack>
              </Pressable>
            </VStack>
          </Card>
        </VStack>
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
  <ActionsheetContent  className="pb-10">
    <ActionsheetDragIndicatorWrapper>
      <ActionsheetDragIndicator />
    </ActionsheetDragIndicatorWrapper>

    <VStack space="md" className="min-w-full px-4" style={{alignItems:"flex-start"}}>
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
      <Text className="font-bold text-lg">
        {title}
      </Text>

      {/* Confirm button */}
      <Pressable onPress={onConfirm} className="w-full">
                <HStack space="lg">
                  {/* <Icon as={RemoveIcon} size="md" /> */}
                  <AntDesignIcon
                    size={15}
                    name="logout"
                    color="#888"
                    className="mt-1"
                  />
                                    <Text
                    className={`font-medium ${
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

