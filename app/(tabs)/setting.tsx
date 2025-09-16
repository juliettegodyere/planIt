import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "@/service/store";
import CustomSelectItem from "@/components/CustomSelectItem";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import { userTransactions } from "@/db/Transactions";
import { BellIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { removeGuestUser, setGuestUserHydrated } from "@/service/stateActions";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Switch } from "@/components/ui/switch";
import { useNotification } from "../../db/context/NotificationProvider";

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
  const [confirmType, setConfirmType] = useState<"logout" | "delete" | null>(
    null
  );
  const { selectedCountry, currencyCode, currencySymbol } =
    useLocalSearchParams();
  const { deleteGuestUser, updateGuestUserInDB } = userTransactions();
  const router = useRouter();
  const {
    notificationsEnabled,
    setNotificationsEnabled,
    reminders,
    cancelReminder,
    requestPermission,
  } = useNotification();

  useEffect(() => {
    if (!guest) {
      router.push("/(auth)");
    }
  }, [state]);

  const handleGuestUserDelete = () => {
    setConfirmType("delete");
  };

  const handleGuestUserLogout = () => {
    setConfirmType("logout");
  };

  const handleConfirm = async () => {
    if (confirmType === "logout") {
      dispatch(removeGuestUser());
      dispatch(setGuestUserHydrated(false));
    } else if (confirmType === "delete" && guest?.id) {
      await deleteGuestUser(guest.id); // wrap in try/catch optionally
    }
    setConfirmType(null); // close modal
  };

  return (
    <Box className="p-2">
      <VStack>
        <Card size="md" variant="elevated" className="mb-3">
          <HStack space="md">
            <Avatar className="bg-indigo-600">
              <AvatarFallbackText className="text-white" size="xl">
                {guest?.name}
              </AvatarFallbackText>
              <AvatarBadge />
            </Avatar>
            <VStack space="md">
              <Text
                size="xl"
                className="font-bold"
                style={{ color: "#333333" }}
              >
                {guest?.name}
              </Text>
              <Text size="md" style={{ color: "#888888" }}>
                sessionId: {guest?.id}
              </Text>
            </VStack>
          </HStack>
        </Card>
        <Card className="mb-3">
          <VStack space="lg">
            <Text size="xl" className="font-bold" style={{ color: "#333333" }}>
              Update Location Details
            </Text>
            {guest && <CustomSelectItem guestUser={guest} />}
          </VStack>
        </Card>
        <Card className="mb-3">
          <VStack space="lg">
            <Text size="xl" className="font-bold" style={{ color: "#333333" }}>
              Settings & Tools
            </Text>
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
              <HStack className="justify-between">
                <HStack space="md">
                  <Icon as={BellIcon} className="text-typography-500 mt-1" />
                  <Text
                    className="font-bold text-lg"
                    style={{ color: "#888888" }}
                  >
                    Push notifications
                  </Text>
                </HStack>
                <Box>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={async (value) => {
                      if (value) {
                        const ok = await requestPermission();
                        if (!ok) {
                          // snap back if denied
                          setNotificationsEnabled(false);
                        }
                      } else {
                        // Turn OFF: cancel scheduled reminders and stop new ones
                        setNotificationsEnabled(false);
                        for (const reminder of reminders) {
                          if (reminder?.id) {
                            await cancelReminder(reminder.id);
                          }
                        }
                      }
                    }}
                    size="md"
                    trackColor={{ false: "#D1D5DB", true: "#FF6347" }}
                    thumbColor="#F1F1F1"
                    ios_backgroundColor="#D1D5DB"
                  />
                </Box>
              </HStack>
            </VStack>
          </VStack>
        </Card>
        <Card>
          <VStack space="lg">
            <Text size="xl" className="font-bold" style={{ color: "#333333" }}>
              App Information
            </Text>
            <VStack space="xl">
              <Pressable>
                <HStack className="justify-between">
                  <Text
                    className="font-bold text-lg"
                    style={{ color: "#888888" }}
                  >
                    App Version
                  </Text>
                  <Text
                    size="md"
                    className="font-normal "
                    style={{ color: "#888888" }}
                  >
                    1.0.0
                  </Text>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack className="justify-between">
                  <Text
                    className="font-bold text-lg"
                    style={{ color: "#888888" }}
                  >
                    Build
                  </Text>
                  <Text
                    size="md"
                    className="font-normal "
                    style={{ color: "#888888" }}
                  >
                    exposdk:53.0.0
                  </Text>
                </HStack>
              </Pressable>
            </VStack>
          </VStack>
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
