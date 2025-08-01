import { useState } from "react";
import { CameraIcon, LinkIcon, VideoIcon } from "lucide-react-native";
import TakePhotoComponent from "./TakePhotoComponent";
import PhotoLibraryComponent from "./PhotoLibraryComponent";
import { AttachmentParam } from "./type";
import {
    Actionsheet,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetBackdrop,
    ActionsheetItem,
    ActionsheetIcon,
    ActionsheetItemText,
  } from "@/components/ui/actionsheet";
import { Box } from "./ui/box";
import { Divider } from "./ui/divider";
import { VStack } from "./ui/vstack";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAttachment: (attachment: AttachmentParam) => void;
}

const AddImageActionSheet = ({ isOpen, onClose, onAttachment }: Props) => {
  const [type, setType] = useState("");
  const [showPickerSheet, setShowPickerSheet] = useState(false);

  const handleOption = (option: string) => {
    setType(option);
    setShowPickerSheet(true);
  };

  const closeAll = () => {
    setType("");
    setShowPickerSheet(false);
    onClose();
  };

  return (
    <>
      {/* Main Options Sheet */}
      <Actionsheet isOpen={isOpen} onClose={closeAll}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-transparent border-0">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem className="bg-white justify-center">
            <VStack space="md">
              <ActionsheetItemText className="text-center text-lg text-gray-900 font-bold">
                Add Receipt?
              </ActionsheetItemText>
              <ActionsheetItemText className="text-center text-sm text-gray-700">
                Make sure it's a JPEG, PNG, PDF, or GIF up to 20MB
              </ActionsheetItemText>
            </VStack>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem
            onPress={() => handleOption("camera")}
            //className="bg-white rounded-md"
            className="justify-center align-middle bg-white"
          >
            <ActionsheetIcon
              as={CameraIcon}
              className="stroke-background-700"
              size="md"
            />
            <ActionsheetItemText className="text-lg text-gray-900">Take Photo</ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem
            onPress={() => handleOption("library")}
            //className="bg-white rounded-md"
            className="justify-center align-middle bg-white mb-4"
          >
            <ActionsheetIcon as={LinkIcon} className="stroke-background-700" size="md"/>
            <ActionsheetItemText className="text-lg text-gray-900">Choose from Library</ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={closeAll} className="justify-center align-middle bg-white mb-4">
            <ActionsheetItemText className="text-red-600 font-medium text-xl mb-3">
              Cancel
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>

      {/* Photo Picker / Camera Sheet */}
      <Actionsheet
        isOpen={showPickerSheet}
        onClose={() => setShowPickerSheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {type === "camera" && (
            <Box className="mt-10">
              <TakePhotoComponent
                onCapture={(img) => {
                  onAttachment(img);
                  setShowPickerSheet(false);
                  closeAll();
                }}
                onCancel={() => setShowPickerSheet(false)}
              />
            </Box>
          )}
          {type === "library" && (
            <PhotoLibraryComponent
              onPick={(img) => {
                onAttachment(img);
                setShowPickerSheet(false);
                closeAll();
              }}
              onCancel={() => setShowPickerSheet(false)}
            />
          )}
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default AddImageActionSheet;
