// hooks/useImageViewer.ts
import { AttachmentParam } from "@/components/type";
import { ShoppingItemTypes } from "@/service/types";
import { useState, useEffect } from "react";

export function useImageViewer(
  imageAttachments: AttachmentParam[],
  setAttachments: any,
  options?: {
    existingItem?: ShoppingItemTypes;
    onDeleteAttachmentFromItem?: (
      item: ShoppingItemTypes,
      attachment: AttachmentParam
    ) => Promise<void>;
  }
) {
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const imageUrls = imageAttachments.map((att) => ({ url: att.data }));

  useEffect(() => {
    if (imageAttachments.length === 0) {
      setShowModal(false);
    }
  }, [imageAttachments]);

  const openModalAtIndex = (index: number) => {
    setZoomedImageIndex(index);
    setShowModal(true);
  };

  const handleDelete = async() => {
    if (zoomedImageIndex === null) return;

    const deletedAttachment = imageAttachments[zoomedImageIndex];
    if (!deletedAttachment) return;

    // 1. If existingItem + handler are provided, use them
    if (options?.existingItem && options?.onDeleteAttachmentFromItem) {
      await options.onDeleteAttachmentFromItem(
        options.existingItem,
        deletedAttachment // This should already be of type AttachmentParam
      );
    }

    setAttachments((prev: any[]) => {
      const updated = prev.filter((_, i) => i !== zoomedImageIndex);
      return updated;
    });

    setShowDeleteWarning(false);

    setZoomedImageIndex((prev) => {
      if (imageAttachments.length <= 1) return null;
      if (prev === imageAttachments.length - 1) return prev - 1;
      return prev;
    });
  };
  
  return {
    zoomedImageIndex,
    showModal,
    setShowModal,
    showDeleteWarning,
    setShowDeleteWarning,
    setZoomedImageIndex,
    imageUrls,
    openModalAtIndex,
    handleDelete,
  };
}
