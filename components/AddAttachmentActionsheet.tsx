import React from "react";
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
import { Box } from "@/components/ui/box";
import { Button, ButtonText, ButtonGroup } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  Icon,
  CloseIcon,
  EyeOffIcon,
  EditIcon,
  ClockIcon,
  DownloadIcon,
  TrashIcon,
  LinkIcon,
} from "@/components/ui/icon";
import { CameraIcon, FileIcon, FileUpIcon, ScanBarcodeIcon, ScanTextIcon, UploadCloud, VideoIcon } from "lucide-react-native";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddAttachmentActionsheet = ({ isOpen, onClose }: Props) => {
  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="px-5">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={onClose}>
            <ActionsheetIcon className="stroke-background-700" as={FileUpIcon} />
            <ActionsheetItemText>File</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={onClose}>
            <ActionsheetIcon
              className="stroke-background-700"
              as={ScanTextIcon}
            />
            <ActionsheetItemText>Document scanner</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={onClose}>
            <ActionsheetIcon className="stroke-background-700" as={ScanBarcodeIcon} />
            <ActionsheetItemText>QR Code</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={onClose}>
            <ActionsheetIcon
              className="stroke-background-700"
              as={CameraIcon}
            />
            <ActionsheetItemText>Camera</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={onClose}>
            <ActionsheetIcon className="stroke-background-700" as={LinkIcon} />
            <ActionsheetItemText>Link</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem  onPress={onClose}>
            <ActionsheetIcon className="stroke-background-700" as={VideoIcon} />
            <ActionsheetItemText>Photo or Video</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default AddAttachmentActionsheet;
