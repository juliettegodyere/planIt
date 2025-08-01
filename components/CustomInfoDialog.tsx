import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
    AlertDialogBackdrop,
  } from "@/components/ui/alert-dialog";
  import { Box } from "@/components/ui/box";
  import { Button, ButtonText } from "@/components/ui/button";
  import { Heading } from "@/components/ui/heading";
  import { Text } from "@/components/ui/text";
  import { Icon } from "@/components/ui/icon";
  import React from "react";
  
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
      <AlertDialog isOpen={isOpen} onClose={onClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent className="gap-4 items-center">
          {/* {icon && (
            <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
              {icon}
            </Box>
          )} */}
          <AlertDialogHeader>
            <Heading size="md" className="text-center">
              {title}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="md" className="text-center">
              {message}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="mt-2 flex-row gap-2">
            <Button
              size="sm"
              action="negative"
              className="px-[30px]"
              onPress={onConfirm}
              variant={confirmVariant}
            >
              <ButtonText>{confirmText}</ButtonText>
            </Button>
            <Button
              size="sm"
              variant="outline"
              action="secondary"
              className="px-[30px]"
              onPress={onClose}
            >
              <ButtonText>{cancelText}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default CustomInfoDialog;
  