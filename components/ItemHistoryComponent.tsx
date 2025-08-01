import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContentText,
  AccordionIcon,
  AccordionContent,
} from "@/components/ui/accordion";
import { Divider } from "@/components/ui/divider";
import { ChevronUpIcon, ChevronDownIcon, Icon, LinkIcon, ChevronRightIcon } from "@/components/ui/icon";
import { VStack } from "./ui/vstack";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { Card } from "./ui/card";
import { HStack } from "./ui/hstack";
import { ShoppingItemTypes } from "@/service/types";
import {
  isToday,
  isYesterday,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  format,
} from "date-fns";
import { Pressable } from "react-native";
import ImageDisplayComponent from "./ImageDisplayComponent";
import { AttachmentParam } from "./type";
import { useState } from "react";
import { useShoppingActions } from "@/db/Transactions";
import { useImageViewer } from "@/hooks/useImageViewer";
import { Image } from "@/components/ui/image";
import AddImageActionSheet from "./AddImageActionSheet";
import { ImageModalViewer } from "./ImageModalViewer";
import CancelActionSheet from "./CancelActionsheet";

type Props = {
  state: ShoppingItemTypes[];
  selectedItem: ShoppingItemTypes | null;
  handleAttachment: (attachment: AttachmentParam) => void;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<ShoppingItemTypes | null>
  >;
  updateShoppingItemAndUpdateState: (entry: ShoppingItemTypes) => void;
  imageAttachments: AttachmentParam[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentParam[]>>;
};

const ItemHistoryComponent = ({
  state,
  selectedItem,
  handleAttachment,
  setSelectedItem,
  updateShoppingItemAndUpdateState,
  imageAttachments,
  setAttachments
}: Props) => {

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

  const [showActionsheet, setShowActionsheet] = useState(false);
  const [_exitingItem, set_ExistingItem] = useState<ShoppingItemTypes | null>(
    null
  );

  const openSheet = () => {
    setShowActionsheet(true);
  };

  // const {
  //   updateShoppingItemAndUpdateState,
  // } = useShoppingActions();

 
  //Write your own setAttachement to update images for an existing item
  // const handleAttachmentTest = async (newAttachment: AttachmentParam) => {
  //   const now = new Date().toISOString();
  //   if (!selectedItem?.id) {
  //     console.error("Cannot update item: ID is missing");
  //     return;
  //   }
    // Ensure attachments are parsed correctly
  //   const currentAttachments: AttachmentParam[] = selectedItem.attachments
  //     ? JSON.parse(selectedItem.attachments)
  //     : [];

  //   const updatedAttachments = [...currentAttachments, newAttachment];

  //   const item_update: ShoppingItemTypes = {
  //     ...selectedItem,
  //     modifiedDate: now,
  //     attachments: JSON.stringify(updatedAttachments),
  //   };

  //   await updateShoppingItemAndUpdateState(item_update);
  //   const updated = state.find((i) => i.id === selectedItem.id);
  //   if (updated) {
  //     setSelectedItem(updated);
  //   }
  //   setAttachments(updatedAttachments);
  // };

  const handleAttachmentWithItem = async (
    existingItem: ShoppingItemTypes,
    newAttachment: AttachmentParam
  ) => {
    const now = new Date().toISOString();
    if (!existingItem?.id) {
      console.error("Cannot update item: ID is missing");
      return;
    }
  
    const currentAttachments: AttachmentParam[] = existingItem.attachments
      ? JSON.parse(existingItem.attachments)
      : [];
  
    const updatedAttachments = [...currentAttachments, newAttachment];
  
    const item_update: ShoppingItemTypes = {
      ...existingItem,
      modifiedDate: now,
      attachments: JSON.stringify(updatedAttachments),
    };
  
    await updateShoppingItemAndUpdateState(item_update);
    // const updated = state.find((i) => i.id === existingItem.id);
    // if (updated) {
    //   setSelectedItem(updated);
    // }
    setAttachments(updatedAttachments);
  };

  const handleDeleteAttachment = async (
    existingItem: ShoppingItemTypes,
    attachmentToDelete: AttachmentParam
  ) => {
    const now = new Date().toISOString();
  
    if (!existingItem?.id) {
      console.error("Cannot update item: ID is missing");
      return;
    }
  
    // Step 1: Parse current attachments
    const currentAttachments: AttachmentParam[] = existingItem.attachments
      ? JSON.parse(existingItem.attachments)
      : [];
  
    // Step 2: Filter out the one to delete
    const updatedAttachments = currentAttachments.filter(
      (att) => att.data !== attachmentToDelete.data
    );
  
    // Step 3: Build update payload
    const item_update: ShoppingItemTypes = {
      ...existingItem,
      modifiedDate: now,
      attachments: JSON.stringify(updatedAttachments),
    };
  
    // Step 4: Persist the update
    await updateShoppingItemAndUpdateState(item_update);

  };

  const shoppingItemLists = state
    .filter((item) => item.name === selectedItem?.name && item.purchased)
    .sort(
      (a, b) =>
        new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime()
    );

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    const now = new Date();
    const days = differenceInDays(now, date);
    const weeks = differenceInWeeks(now, date);
    const months = differenceInMonths(now, date);
    const years = differenceInYears(now, date);

    if (years >= 1) {
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }

    if (months >= 1) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }

    if (weeks >= 1) {
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }

    if (days > 1) {
      return `${days} days ago`;
    }

    return format(date, "EEE d MMM yyyy");
  };
  const imageUrls_ = shoppingItemLists.flatMap((item) => {
    try {
      const parsed = JSON.parse(item.attachments);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((att) => att && att.type === 'image' && att.data)
          .map((att) => ({ url: att.data }));
      }
    } catch (e) {
      console.warn("Invalid JSON in attachments:", item.attachments);
    }
    return [];
  });
  console.log("shoppingItemLists-ItemHistoryComponent")
  console.log(shoppingItemLists)
  return (
    <>
      {shoppingItemLists.length > 0 && (
        <VStack className="py-8">
          <Heading className="pb-3" size="lg">
            Item History
          </Heading>
          <Card>
            <HStack className="justify-between">
              <Heading className="pb-3" size="sm">
                Number of Transactions
              </Heading>
              <Text>{shoppingItemLists.length}</Text>
            </HStack>
            <Divider />
            <VStack>
              <Heading className="py-3" size="md">
                Details
              </Heading>
              {shoppingItemLists.map((item, index) => (
                <Accordion
                  size="md"
                  variant="filled"
                  type="single"
                  isCollapsible={true}
                  isDisabled={false}
                  className="w-[90%] border border-outline-200"
                  key={item.key || index} // Fallback to index in case item.key is undefined
                >
                  <AccordionItem value={item.key || index.toString()}>
                    <AccordionHeader>
                      <AccordionTrigger>
                        {({ isExpanded }) => (
                          <>
                            <AccordionTitleText>
                              {`Purchased ${formatDate(item.modifiedDate)}`}
                            </AccordionTitleText>
                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="ml-3"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="ml-3"
                              />
                            )}
                          </>
                        )}
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>
                      <HStack className="justify-between">
                        <Text className=" font-medium text-lg">Amount</Text>
                        <Text>
                          {item.price === "0" ? "N/A" : "£" + item.price}
                        </Text>
                      </HStack>
                      <HStack className="justify-between pb-2 ">
                        <Text className=" font-medium text-lg">Quantity</Text>
                        <Text>{item.quantity}</Text>
                      </HStack>
                      <HStack className="justify-between pb-2 ">
                        <Text className=" font-medium text-lg">
                          Quantity Unit
                        </Text>
                        <Text>
                          {item.qtyUnit === "None" ? "N/A" : item.qtyUnit}
                        </Text>
                      </HStack>
                      <HStack className="justify-between pb-2 ">
                        <Text className=" font-medium text-lg">Priority</Text>
                        <Text>
                          {item.priority === "None" ? "N/A" : item.priority}
                        </Text>
                      </HStack>
                      {item.note && (
                        <VStack className="justify-between pb-2">
                          <Text className="pb-2 font-medium text-lg">
                            Notes
                          </Text>
                          <Text>{item.note}</Text>
                        </VStack>
                      )}
                      <VStack>
                        {/* {item?.attachments ? (
                          <ImageDisplayComponent
                            imageAttachments={
                              Array.isArray(JSON.parse(item.attachments))
                              ? JSON.parse(item.attachments).filter(
                                  (att: AttachmentParam | null) =>
                                    att !== null && att.type === "image"
                                )
                              : []
                            }
                            handleAttachment={(newAttachment) => handleAttachmentWithItem(item, newAttachment)}
                            handleAttachmentWithItem={handleDeleteAttachment}
                            existingItem={item}
                          />
                        ) : null} */}
                        <Pressable
                            onPress={() => {
                              openModalAtIndex(0);
                              set_ExistingItem(item)
                            }}
                          >
                          <HStack className="justify-between">
                            <HStack space="sm" style={{ alignItems: "center" }}>
                              <Icon as={LinkIcon} size="lg" />
                              <Text className="font-medium text-lg">View Receipts</Text>
                            </HStack>
                            {JSON.parse(item.attachments).length > 0 ? (
                              <Image
                              source={{ uri: JSON.parse(item.attachments)[0].data }}
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
                    </AccordionContent>
                  </AccordionItem>
                  <Divider />
                </Accordion>
              ))}
            </VStack>
          </Card>
        </VStack>
      )}
      <AddImageActionSheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
        onAttachment={(newAttachment) => handleAttachmentWithItem(_exitingItem!, newAttachment)}
      />
      {/* Modal Viewer using refactored shared component */}
      <ImageModalViewer
        showModal={showModal}
        setShowModal={setShowModal}
        imageUrls={imageUrls_}
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

export default ItemHistoryComponent;

//Fails when attempted to add new images to existing items
