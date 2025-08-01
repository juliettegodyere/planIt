import { useState } from "react";
import { Pressable } from "./ui/pressable";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "./ui/actionsheet";
import { VStack } from "./ui/vstack";
import { Input, InputField } from "./ui/input";
import { Button, ButtonText } from "./ui/button";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { ChevronRightIcon, EditIcon, Icon, MailIcon } from "./ui/icon";
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { Box } from "./ui/box";
import CancelActionSheet from "./CancelActionsheet";

type Props = {
  note?: string;
  placeholder?: string;
  onNoteChange?: (text: string) => void;
  onDone?: (note: string) => void;
};

const NoteInputSheet = ({
  note: controlledNote,
  placeholder = "Add a note",
  onNoteChange,
  onDone,
}: Props) => {
  const [showSheet, setShowSheet] = useState(false);
  const [uncontrolledNote, setUncontrolledNote] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [isOpenDiscardSheet, setIsOpenDiscardSheet] = useState(false);

  const isControlled = controlledNote !== undefined;
  const note = isControlled ? controlledNote : uncontrolledNote;

  const openSheet = () => {
    setHasChanged(false); // Reset change tracking on open
    setShowSheet(true);
  };


  const closeSheet = () => setShowSheet(false);

  const handleChange = (text: string) => {
    if (isControlled) {
      setHasChanged(text !== controlledNote);
      onNoteChange?.(text);
    } else {
      setHasChanged(text !== uncontrolledNote);
      setUncontrolledNote(text);
      onNoteChange?.(text);
    }
  };

  const handleDone = () => {
    console.log("OnDone clicked");
    onDone?.(note);
    closeSheet?.();
  };
  

  const handleCancel = () => {
    if (hasChanged) {
      setIsOpenDiscardSheet(true); // Show discard confirmation
    } else {
      closeSheet(); // No changes, close directly
    }
  };

  const handleDiscard = () => {
    setIsOpenDiscardSheet(false);
    closeSheet(); // Actually close the sheet
  };
  
  const handleDiscardConfirmationSheet = () => {
    setIsOpenDiscardSheet(false); // Just close discard confirmation
  };

  return (
    <>
      <Pressable  onPress={openSheet}>
       <VStack>
       <HStack className="justify-between">
          <HStack space="md">
            <Icon as={EditIcon} className="text-lg mt-1 text-gray-900" />
            <Text className="text-lg text-gray-900">
              {note.trim() ? "View Note" : "Add Note"}
            </Text>
          </HStack>
          <Icon as={ChevronRightIcon} className="mt-1 text-gray-900" />
        </HStack>
        <Text className="text-sm text-gray-900">{note}</Text>
       </VStack>
      </Pressable>

      <Actionsheet isOpen={showSheet} onClose={closeSheet}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <HStack space="4xl" className="py-2 w-full justify-between">
            <Pressable onPress={handleCancel}>
              <Text className="text-red-600">Cancel</Text>
            </Pressable>
            <Text className="font-bold text-lg">Note and #tags</Text>
            <Text className="font-bold text-lg"></Text>
          </HStack>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ height: "90%", width: "100%" }}
          >
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <VStack space="md" className="p-4 w-full">
                {/* <Text className="text-lg font-semibold">Note</Text> */}
                <Input
                  variant="underlined"
                  size="lg"
                  style={{ minHeight: 120 }}
                >
                  <InputField
                    multiline
                    numberOfLines={10}
                    placeholder={placeholder}
                    value={note}
                    onChangeText={handleChange}
                    className="text-base"
                  />
                </Input>
              </VStack>
               <Button onPress={handleDone} variant="solid" action="primary" className="mt-24" isDisabled={!hasChanged}>
                  <ButtonText>Done</ButtonText>
                </Button>
            </ScrollView>
          </KeyboardAvoidingView>
        </ActionsheetContent>
      </Actionsheet>
      <CancelActionSheet
        isOpen={isOpenDiscardSheet}
        handleClose={handleDiscard}
        handleCancel={handleDiscardConfirmationSheet}
        text1="Discard Changes?"
        text2="Cancel"
        //topInfo=""
        //subtopInfo=""
      />
    </>
  );
};

export default NoteInputSheet;
