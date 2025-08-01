import { AttachmentParam } from "./type";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { Icon, TrashIcon } from "./ui/icon";
import { Pressable } from "./ui/pressable";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { Image } from "@/components/ui/image";
import { useImageViewer } from '../hooks/useImageViewer';
import { ImageModalViewer } from './ImageModalViewer';
import AddImageActionSheet from "./AddImageActionSheet";
import { useState } from "react";
import { ShoppingItemTypes } from "@/service/types";


type Props = {
  imageAttachments: AttachmentParam[];
  handleAttachment: (attachment: AttachmentParam) => void;
  handleAttachmentWithItem: (existingItem: ShoppingItemTypes, attachment: AttachmentParam) => Promise<void>;
  existingItem:ShoppingItemTypes
};

const ImageDisplayComponent = ({ imageAttachments, handleAttachment, handleAttachmentWithItem, existingItem }: Props) => {
  const [showActionsheet, setShowActionsheet] = useState(false);

  const openSheet = () => {
    setShowActionsheet(true);
  };

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
  } = useImageViewer(imageAttachments, handleAttachment,  {
    existingItem: existingItem,
    onDeleteAttachmentFromItem: handleAttachmentWithItem
  });
  
  return (
    <>
      {imageAttachments.length > 0 && (
        <VStack className="mt-4" space="md">
          {imageAttachments.map((attachment, index) => (
            <Box key={index}>
              {attachment.type === "image" ? (
                <HStack className="justify-between">
                  <Pressable
                    key={index}
                    onPress={() => openModalAtIndex(index)}
                  >
                    <Image
                      source={{ uri: attachment.data }}
                      alt={`Attachment ${index + 1}`}
                      size="xs"
                      className="rounded-sm"
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setZoomedImageIndex(index);
                      setShowDeleteWarning(true);
                    }}
                  >
                    <Icon
                      size="lg"
                      as={TrashIcon}
                      className="text-red-500 m-3 w-6 h-6"
                    />
                  </Pressable>
                </HStack>
              ) : (
                <Box className="p-2 bg-gray-100 rounded-md">
                  <Text className="text-black text-base break-words">
                    {attachment.data || "No text found"}
                  </Text>
                </Box>
              )}
            </Box>
          ))}
        </VStack>
      )}
      <AddImageActionSheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
        onAttachment={handleAttachment}
      />
      {/* Modal Viewer */}
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
    </>
  );
};

export default ImageDisplayComponent;
