import { ItemInformationSheetProps } from "./type";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import CustomCheckbox from "@/components/CustomCheckbox";
import { Box } from "./ui/box";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { VStack } from "./ui/vstack";
import AllPurposeCustomMenu from "./AllPurposeCustomMenu";
import { imageAttachmentOptions } from "@/data/dataStore_";
import TakePhotoComponent from "./TakePhotoComponent";
import PhotoLibraryComponent from "./PhotoLibraryComponent";
import ScanDocumentComponent from "./ScanDocumentComponent";
import CustomSwitch from "./CustomSwitch";
import { HStack } from "./ui/hstack";
import { Card } from "./ui/card";
import CancelActionSheet from "./CancelActionsheet";
import PriceComponent from "./PriceComponent";
import NoteComponent from "./NoteComponent";
import QuantityComponent from "./QuantityComponent";
import PriorityComponent from "./PriorityComponent";
import ItemReminderComponent from "./ItemReminderCompoment";
import { Image } from "@/components/ui/image";
import { useState } from "react";
import ImageViewer from "react-native-image-zoom-viewer";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { CloseIcon, Icon, ShareIcon, TrashIcon } from "./ui/icon";

const ItemInformationSheet: React.FC<ItemInformationSheetProps> = ({
  isOpen,
  onClose,
  onDone,
  shoppingList,
  isChecked,
  handleCheckboxChange,
  itemPurchase,
  handleMarkItemAsPurchased,
  priceInput,
  handlePriceInputChange,
  handlePriceInputBlur,
  handlePriceInputFocus,
  note,
  HandleSetNote,
  qtyVal,
  handleUpdateQuantity,
  qtyUnit,
  SetQtyUnit,
  qtyOptions,
  priorityVal,
  setPriorityVal,
  setAttachments,
  priorityOption,
  showActionsheet,
  handleClose,
  handleSelect,
  actionType,
  attachments,
  handleAttachment,
  isOpenDiscardSheet,
  handleDiscard,
  handleDiscardConfirmationSheet,
  handleRemoveAttachment,
  handleUpdateItems
}) => {
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteWarningActionSheet, setShowDeleteWarningActionSheet] = useState(false);

  const imageAttachments = attachments.filter((att) => att.type === "image");

  const imageUrls = imageAttachments.map((att) => ({ url: att.data }));

  const handleDelete = () => {
    console.log(zoomedImageIndex)
    setAttachments(prev => prev.filter((_, i) => i !== zoomedImageIndex));
    setShowDeleteWarningActionSheet(false)
    setZoomedImageIndex(null)
  }
  return (
    <>
      <Actionsheet
        isOpen={isOpen}
        onClose={onClose}
        style={
          {
            //backgroundColor: "#F1F1F1",
            //height: "75%", // take up 90% of screen height
          }
        }
      >
        <ActionsheetBackdrop />
        <ActionsheetContent
          className="px-5"
          style={{
            backgroundColor: "#F1F1F1",
            height: "95%",       
            maxHeight: "95%",    
            flexDirection: "column",
          }}
        >
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
            <VStack style={{ maxWidth: "100%" }}>
              <HStack className="justify-between w-full mt-3 pb-5">
                <Pressable onPress={onClose}>
                  <Text
                    style={{ color: "#FF6347" }}
                    size="xl"
                    className="font-medium"
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Heading size="md" className="font-bold">
                  Details
                </Heading>
                <Pressable onPress={handleUpdateItems}>
                  <Text
                    style={{ color: "#FF6347" }}
                    size="xl"
                    className="font-semibold"
                  >
                    Done
                  </Text>
                </Pressable>
              </HStack>
              <ScrollView >
              <VStack space="lg">
                <Card variant="elevated" className=" bg-white">
                  <HStack className="justify-between">
                    <Box>
                      <CustomCheckbox
                        value={shoppingList.value}
                        label={shoppingList.label}
                        size="lg"
                        isChecked={isChecked(shoppingList.value)}
                        onChange={() => handleCheckboxChange(shoppingList)}
                      />
                      <Box className="my-3">
                        <Text size="lg">{shoppingList.category}</Text>
                      </Box>
                    </Box>
                    <HStack space="md" style={{ alignContent: "flex-end" }}>
                      <Text size="lg" className="font-medium">
                        Purchased
                      </Text>
                      <CustomSwitch
                        value={itemPurchase}
                        onToggle={handleMarkItemAsPurchased}
                      />
                      {/* <Switch
                        value={itemPurchase}
                        trackColor={{ false: "#F1F1F1", true: "#FF6347" }}
                        thumbColor="#F1F1F1"
                        onToggle={handleMarkItemAsPurchased}
                        // ios_backgroundColor={"#FF6347"}
                      /> */}
                    </HStack>
                  </HStack>
                </Card>
                <Card>
                  <VStack>
                    <PriceComponent
                      priceInput={priceInput}
                      handleChange={handlePriceInputChange}
                      handleBlur={handlePriceInputBlur}
                      handleFocus={handlePriceInputFocus}
                    />
                    <NoteComponent
                      noteInput={note}
                      handleChange={HandleSetNote}
                    />
                  </VStack>
                </Card>
                <Card>
                  <QuantityComponent
                    qtyVal={qtyVal}
                    qtyUnit={qtyUnit}
                    handleUpdateQuantity={handleUpdateQuantity}
                    SetQtyUnit={SetQtyUnit}
                    shoppingList={shoppingList}
                    qtyOptions={qtyOptions}
                  />
                </Card>
                <Card>
                  <VStack>
                    <PriorityComponent
                      priorityVal={priorityVal}
                      priorityOption={priorityOption}
                      setPriorityVal={setPriorityVal}
                    />
                    <ItemReminderComponent />
                  </VStack>
                </Card>
                <Card>
                  <VStack space="md">
                    <AllPurposeCustomMenu
                      value={"Add Attachment"}
                      menuItems={imageAttachmentOptions}
                      onSelect={handleSelect}
                    />
                    {imageAttachments.length > 0 && (
                      <VStack className="mt-4" space="md">
                        {imageAttachments.map((attachment, index) => (
                          <Box key={index}>
                            {attachment.type === "image" ? (
                              <HStack className="justify-between">
                                <Pressable
                                key={index}
                                onPress={() => {
                                  setZoomedImageIndex(index);
                                  setShowModal(true);
                                  console.log(showModal);
                                }}
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
                                    setShowDeleteWarningActionSheet(true);
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
                                <Text className="text-black text-base break-words">{attachment.data || 'No text found'}</Text>
                              </Box>
                            )}
                          </Box>
                        ))}
                      </VStack>
                    )}
                    <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
                      <ActionsheetBackdrop />
                      <ActionsheetContent>
                        <ActionsheetDragIndicatorWrapper>
                          <ActionsheetDragIndicator />
                        </ActionsheetDragIndicatorWrapper>

                        {actionType === "camera" && (
                          <Box
                            style={{
                              display:
                                actionType === "camera" ? "flex" : "none",
                              marginTop: 50,
                            }}
                          >
                            <TakePhotoComponent
                              onCapture={handleAttachment}
                              onCancel={handleClose}
                            />
                          </Box>
                        )}
                        {actionType === "scan" && (
                          <Box
                            style={{
                              display: actionType === "scan" ? "flex" : "none",
                              marginTop: 50,
                            }}
                          >
                            <ScanDocumentComponent
                              onScan={handleAttachment}
                              onCancel={handleClose}
                            />
                          </Box>
                        )}
                        {actionType === "library" && (
                          <PhotoLibraryComponent
                            onPick={handleAttachment}
                            onCancel={handleClose}
                          />
                        )}
                      </ActionsheetContent>
                    </Actionsheet>
                  </VStack>
                </Card>
              </VStack>
              </ScrollView>
            </VStack>
        </ActionsheetContent>
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setZoomedImageIndex(null);
          }}
          size="full"
        >
          <ImageViewer
            imageUrls={imageUrls}
            index={zoomedImageIndex ?? 0}
            onCancel={() => {
              setShowModal(false);
              setZoomedImageIndex(null);
            }}
            enableSwipeDown
          />
        </Modal>
      </Actionsheet>
      <CancelActionSheet
        isOpen={isOpenDiscardSheet}
        handleClose={handleDiscard}
        handleCancel={handleDiscardConfirmationSheet}
        text1="Discard Changes"
        text2="Cancel"
        topInfo=""
      />
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setZoomedImageIndex(null);
        }}
        size="full"
      >
        <ModalContent className="flex-1 h-full w-full rounded-sm bg-black border-black">
          <ModalHeader className="mt-safe flex-row justify-between items-center px-4 pb-4">
            <Text className="text-white text-lg font-bold">Preview</Text>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="lg"
                className="text-typography-200  m-3 w-6 h-6"
              />
            </ModalCloseButton>
          </ModalHeader>
          {/* <ModalBody className="flex-1 p-0"> */}
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
          {/* </ModalBody> */}
          <ModalFooter className="mb-safe w-full flex-row justify-between px-4 pt-5">
            <Icon
              size="lg"
              as={ShareIcon}
              className="text-typography-200  m-3 w-6 h-6"
            />
            <Icon
              size="lg"
              as={TrashIcon}
              className="text-typography-200 m-3 w-6 h-6"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CancelActionSheet
        isOpen={showDeleteWarningActionSheet}
        handleClose={handleDelete}
        handleCancel={()=> setShowDeleteWarningActionSheet(false)}
        text1="Delete"
        text2="Cancel"
        topInfo=""
      />
    </>
  );
};

export default ItemInformationSheet;

//TODOs - When a picture is takem, ask the user whetter they want to keep or discard
// Make image smaller and give option to delete on the right
// Make provision to also preview the scanned text.
