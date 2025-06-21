import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Platform } from "react-native";
import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Pressable } from "./ui/pressable";
import { Heading } from "./ui/heading";
import { CloseIcon, Icon } from "./ui/icon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddNoteActionsheet({ isOpen, onClose }: Props) {
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <ActionsheetBackdrop />
      
          <ActionsheetContent style={{ maxHeight: '90%'}}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
      
            {/* KeyboardAvoidingView wraps the whole area */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
              style={{ maxWidth:"100%"}}
            >
            
              {/* Flexbox layout to separate scroll and footer */}
              <VStack style={{ maxWidth:"100%"}}>
              <HStack className="justify-between w-full mt-3">
                <Pressable onPress={onClose}>
                  <Icon
                    as={CloseIcon}
                    size="lg"
                    className="stroke-background-500"
                  />
                </Pressable>
                <Heading size="md" className="font-semibold">
                    Note
                </Heading>
                <Pressable onPress={() => console.log("Notes")}>
                  <Text>Done</Text>
                </Pressable>
                
              </HStack>
                {/* Scrollable content */}
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  //contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, maxWidth:"100%" }}
                  showsVerticalScrollIndicator={false}
                >
                  <VStack space="4xl" className="w-full pt-5">
                    <FormControl  size="lg">
                      <FormControlLabel>
                      </FormControlLabel>
                      <Textarea className="min-w-[100%] min-h-[50%] border-0">
                        <TextareaInput />
                      </Textarea>
                      <FormControlHelper>
                        <FormControlHelperText>
                          Type your comment above
                        </FormControlHelperText>
                      </FormControlHelper>
                    </FormControl>
                  </VStack>
                </ScrollView>
      
                <Box
                  style={{
                    backgroundColor:"#F1F1F1",
                    padding:7,
                  }}
                >
                  <Pressable>
                    <Text className="text-blue-700 font-semibold text-md">Scan Text @</Text>
                  </Pressable>
                </Box>
              </VStack>
            </KeyboardAvoidingView>
          </ActionsheetContent>
        </Actionsheet>
      );      
}
