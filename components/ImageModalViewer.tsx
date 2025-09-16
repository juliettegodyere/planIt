import ImageViewer from "react-native-image-zoom-viewer"; // or your preferred viewer
import {
  Icon,
  CloseIcon,
  TrashIcon,
  ShareIcon,
  AddIcon,
} from "@/components/ui/icon";
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "./ui/modal";
import CancelActionSheet from "./CancelActionsheet";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

import { Box } from "./ui/box";

export const ImageModalViewer = ({
  showModal,
  setShowModal,
  imageUrls,
  zoomedImageIndex,
  setZoomedImageIndex,
  onAddPress,
  showDeleteWarning,
  setShowDeleteWarning,
  onDelete,
}: {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  imageUrls: { url: string }[];
  zoomedImageIndex: number | null;
  setZoomedImageIndex: (i: number | null) => void;
  onAddPress?: () => void;
  showDeleteWarning: boolean;
  setShowDeleteWarning: (val: boolean) => void;
  onDelete: () => void;
}) => {

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setZoomedImageIndex(null);
        }}
        size="full"
      >
        <ModalContent className="flex-1 bg-black rounded-sm">
          <ModalHeader className="mt-safe flex-row justify-between items-center px-4 pb-4">
            <ModalCloseButton>
              <Icon as={CloseIcon} size="lg" className="text-white w-6 h-6" />
            </ModalCloseButton>
            <Text className="text-white font-bold text-lg">Preview</Text>
            <Pressable onPress={onAddPress}>
              <HStack>
                <Icon as={AddIcon} size="lg" className="text-white" />
                <Text className="text-white font-bold">Add</Text>
              </HStack>
            </Pressable>
          </ModalHeader>

          <Box className="flex-1 w-full">
            <ImageViewer
              imageUrls={imageUrls}
              index={zoomedImageIndex ?? 0}
              onCancel={() => {
                setShowModal(false);
                setZoomedImageIndex(null);
              }}
              enableSwipeDown
            />
          </Box>

          <ModalFooter className="mb-safe w-full flex-row justify-between px-4 pt-5">
            <Icon size="lg" as={ShareIcon} className="text-white w-6 h-6" />
            <Pressable onPressIn={() => setShowDeleteWarning(true)}>
              <Icon size="lg" as={TrashIcon} className="text-white w-6 h-6" />
            </Pressable>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CancelActionSheet
        isOpen={showDeleteWarning}
        handleClose={onDelete}
        handleCancel={() => setShowDeleteWarning(false)}
        text1="Delete"
        text2="Cancel"
        topInfo="Delete receipt"
        subtopInfo="We won't save it, so you'll need to add a new one."
      />
    </>
  );
};
