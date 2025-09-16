// // import {
// //     AlertDialog,
// //     AlertDialogContent,
// //     AlertDialogHeader,
// //     AlertDialogFooter,
// //     AlertDialogBody,
// //     AlertDialogBackdrop,
// //   } from "@/components/ui/alert-dialog";
//   import { Box } from "@/components/ui/box";
//   import { Button, ButtonText } from "@/components/ui/button";
//   import { Heading } from "@/components/ui/heading";
//   import { Text } from "@/components/ui/text";
//   import { Icon } from "@/components/ui/icon";
//   import React from "react";
  
//   type Props = {
//     isOpen: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
//     icon?: React.ReactNode;
//     title: string;
//     message: string;
//     confirmText?: string;
//     cancelText?: string;
//     confirmVariant?: "solid" | "link" | "outline";
//   };
  
//   const CustomInfoDialog = ({
//     isOpen,
//     onClose,
//     onConfirm,
//     icon,
//     title,
//     message,
//     confirmText = "Confirm",
//     cancelText = "Cancel",
//     confirmVariant = "solid",
//   }: Props) => {
//     return (
//       <AlertDialog isOpen={isOpen} onClose={onClose} size="md">
//         <AlertDialogBackdrop />
//         <AlertDialogContent className="gap-4 items-center">
//           {/* {icon && (
//             <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
//               {icon}
//             </Box>
//           )} */}
//           <AlertDialogHeader>
//             <Heading size="md" className="text-center">
//               {title}
//             </Heading>
//           </AlertDialogHeader>
//           <AlertDialogBody>
//             <Text size="md" className="text-center">
//               {message}
//             </Text>
//           </AlertDialogBody>
//           <AlertDialogFooter className="mt-2 flex-row gap-2">
//             <Button
//               size="sm"
//               action="negative"
//               className="px-[30px]"
//               onPress={onConfirm}
//               variant={confirmVariant}
//             >
//               <ButtonText>{confirmText}</ButtonText>
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               action="secondary"
//               className="px-[30px]"
//               onPress={onClose}
//             >
//               <ButtonText>{cancelText}</ButtonText>
//             </Button>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     );
//   };
  
//   export default CustomInfoDialog;
  

import React from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { twMerge } from "tailwind-merge";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon?: React.ReactNode;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "solid" | "link" | "outline";
};

const CustomInfoDialog = ({
  isOpen,
  onClose,
  onConfirm,
  icon,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "solid",
}: Props) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isOpen}
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <View className="flex-1 justify-center items-center bg-black/50">
        {/* Dialog Content */}
        <View className="bg-white rounded-2xl w-80 p-6 shadow-lg items-center gap-4">
          {/* Icon */}
          {icon && (
            <View className="rounded-full h-14 w-14 bg-red-100 items-center justify-center">
              {icon}
            </View>
          )}

          {/* Header */}
          <Text className="text-lg font-bold text-center">{title}</Text>

          {/* Body */}
          <Text className="text-gray-600 text-center">{message}</Text>

          {/* Footer Buttons */}
          <View className="flex-row mt-2 gap-4">
            {/* Confirm Button */}
            <TouchableOpacity
              onPress={onConfirm}
              className={twMerge(
                "px-6 py-2 rounded-lg",
                confirmVariant === "solid" && "bg-red-500",
                confirmVariant === "outline" &&
                  "border border-red-500 bg-transparent",
                confirmVariant === "link" && "bg-transparent"
              )}
            >
              <Text
                className={twMerge(
                  "font-semibold",
                  confirmVariant === "solid" ? "text-white" : "text-red-500"
                )}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300"
            >
              <Text className="text-gray-600">{cancelText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomInfoDialog;
