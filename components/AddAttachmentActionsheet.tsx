import React, { useEffect, useState } from "react";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  Icon,
  LinkIcon,
  ChevronRightIcon,
} from "@/components/ui/icon";
import { AttachmentParam } from "./type";
import { Image } from "@/components/ui/image";
import CancelActionSheet from "./CancelActionsheet";
import { useImageViewer } from "@/hooks/useImageViewer";
import { ImageModalViewer } from "./ImageModalViewer";
import AddImageActionSheet from "./AddImageActionSheet";


interface Props {
  handleAttachment: (attachment: AttachmentParam) => void;
  imageAttachments: AttachmentParam[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentParam[]>>;
}

const AddAttachmentComponent = ({handleAttachment, imageAttachments, setAttachments}:Props) => {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [pendingZoomUpdate, setPendingZoomUpdate] = useState(false);

  const {
    zoomedImageIndex,
    showModal,
    setShowModal,
    showDeleteWarning,
    setShowDeleteWarning,
    setZoomedImageIndex,
    imageUrls,
    openModalAtIndex,
    handleDelete,
  } = useImageViewer(imageAttachments, setAttachments);

  useEffect(() => {
    if (imageAttachments.length === 0) {
      setShowModal(false);
    }
  }, [imageAttachments]);

  useEffect(() => {
    if (pendingZoomUpdate && imageUrls.length > 0) {
      setZoomedImageIndex(imageUrls.length - 1); // Zoom to the latest
      setPendingZoomUpdate(false); // Reset flag
    }
  }, [imageUrls, pendingZoomUpdate]);

  const openSheet = () => {
    setHasChanged(false);
    setShowActionsheet(true);
  };

  
  const handleAttachmentWithZoomUpdate = (attachment: AttachmentParam) => {
    setPendingZoomUpdate(true); // We want to update zoom after new image added
    handleAttachment(attachment);
  };
  
  return (
    <>
      <VStack>
        <Pressable
            onPress={() => {
              if (imageAttachments.length > 0) {
                openModalAtIndex(0);
              } else {
                openSheet();
              }
            }}
          >
          <HStack className="justify-between">
            <HStack space="sm" style={{ alignItems: "center" }}>
              <Icon as={LinkIcon} size="lg" />
              <Text className="font-medium text-lg"  style={{color:"#888888"}}>{imageAttachments.length > 0 ? "View Receipts": "Add Receipt"}</Text>
            </HStack>
            {imageAttachments.length > 0 ? (
               <Image
               source={{ uri: imageAttachments[0].data }}
               alt={`Attachment 1`}
               size="xs"
               className="rounded-sm"
             />
            ):(
              <Icon as={ChevronRightIcon} className="text-typography-500" />
            )}
          </HStack>
        </Pressable>
      </VStack>
      <AddImageActionSheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
        onAttachment={handleAttachmentWithZoomUpdate}
      />
      {/* Modal Viewer using refactored shared component */}
      <ImageModalViewer
        showModal={showModal}
        setShowModal={setShowModal}
        imageUrls={imageUrls}
        zoomedImageIndex={zoomedImageIndex}
        setZoomedImageIndex={setZoomedImageIndex}
        onAddPress={openSheet}
        showDeleteWarning={showDeleteWarning}
        setShowDeleteWarning={setShowDeleteWarning}
        onDelete={handleDelete}
      />

      {/* Delete confirmation */}
      <CancelActionSheet
        isOpen={showDeleteWarning}
        handleClose={handleDelete}
        handleCancel={() => setShowDeleteWarning(false)}
        text1="Delete"
        text2="Cancel"
        topInfo="Delete receipt"
        subtopInfo="We won't save it, so you'll need to add a new one."
      />
    </>
  );
};

export default AddAttachmentComponent;

