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
import CustomSwitch from "./CustomSwitch";
import { HStack } from "./ui/hstack";
import { Card } from "./ui/card";
import CancelActionSheet from "./CancelActionsheet";
import PriceComponent from "./PriceComponent";
import QuantityComponent from "./QuantityComponent";
import PriorityComponent from "./PriorityComponent";
import ItemReminderComponent from "./ItemReminderCompoment";
import { useEffect, useState } from "react";
import AddCategorySheet from "./AddCategorySheet";
import { useShoppingActions } from "@/db/Transactions";
import { getShoppingItemById } from "@/db/EntityManager";
import { ShoppingItemTypes } from "@/service/types";
import { useSQLiteContext } from "expo-sqlite";
import { Divider } from "./ui/divider";
import { useShoppingListContext } from "@/service/store";
import NoteInputSheet from "./NoteComponentV2";
import AddAttachmentComponent from "./AddAttachmentActionsheet";

const ItemInformationSheet: React.FC<ItemInformationSheetProps> = ({
  isOpen,
  onClose,
  onDone,
  shoppingList,
  selectedItem,
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
  handleUpdateItems,
  reminderDate,
  setReminderDate,
  reminderTime,
  setReminderTime,
  isReminderTimeEnabled,
  setIsReminderTimeEnabled,
  isReminderDateEnabled,
  setIsReminderDateEnabled,
  earlyReminder,
  setEarlyReminder,
  repeatReminder,
  setRepeatReminder,
  guest,
}) => {
  const db = useSQLiteContext();
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteWarningActionSheet, setShowDeleteWarningActionSheet] =
    useState(false);
  const [showAddCategoryActionsheet, setShowAddCategoryActionsheet] =
    useState(false);
  const { updateShoppingItemCategory, getCategoryById, updateShoppingItemAndUpdateState } = useShoppingActions();
  const [categoryLabel, setCategoryLabel] = useState<string | null>(null);
  const [_selectedItem, set_SelectedItem] = useState<ShoppingItemTypes | null>(
    null
  );
  const { state, dispatch } = useShoppingListContext();

  useEffect(() => {
    set_SelectedItem(selectedItem ?? null);

    if (!selectedItem) return;

    if (selectedItem?.attachments) {
      try {
        const parsed = JSON.parse(selectedItem.attachments);
        if (Array.isArray(parsed)) {
          setAttachments(parsed);
        }
      } catch (error) {
        console.error("Failed to parse attachments:", error);
      }
    }
    // Set enabled flags first
    setIsReminderTimeEnabled(selectedItem.isReminderTimeEnabled ?? false);
    setIsReminderDateEnabled(selectedItem.isReminderDateEnabled ?? false);

    // Conditionally clear or set reminder values
    if (
      !selectedItem.isReminderDateEnabled &&
      !selectedItem.isReminderTimeEnabled
    ) {
      setReminderDate("");
      setReminderTime("");
    } else {
      setReminderDate(selectedItem.reminderDate || "");
      setReminderTime(selectedItem.reminderTime || "");
    }

    // The rest
    setEarlyReminder(selectedItem.earlyReminder ?? "None");
    setRepeatReminder(selectedItem.repeatReminder ?? "Never");
  }, [selectedItem]);

  useEffect(() => {
    const fetchCategoryLabel = async () => {
      if (!_selectedItem) return;

      try {
        const category = await getCategoryById(_selectedItem.category_item_id);

        if (category?.label === "Uncategorized") {
          setCategoryLabel("Uncategorized");
        } else {
          setCategoryLabel(category?.label ?? null);
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);
      }
    };

    fetchCategoryLabel();
  }, [_selectedItem]);


  const imageAttachments = attachments.filter((att) => att.type === "image");

  const imageUrls = imageAttachments.map((att) => ({ url: att.data }));
 
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={true}
              overScrollMode="never" // Android only
            >
              <VStack space="lg">
                <Card variant="elevated" className=" bg-white">
                  <HStack className="justify-between items-start" style={{width:"100%"}}>
                    <Box className="max-w-[50%]">
                      <CustomCheckbox
                        shoppingList={shoppingList}
                        isChecked={isChecked}
                        handleCheckboxChange={handleCheckboxChange}
                        size="lg"
                        onClose={onClose}
                        
                      />
                      <Box className="my-3">
                        {categoryLabel === "Uncategorized" ? (
                          <Pressable
                            onPress={() => setShowAddCategoryActionsheet(true)}
                          >
                            <Text size="md">Change category</Text>
                          </Pressable>
                        ) : (
                          <Text size="lg">{categoryLabel}</Text>
                        )}
                      </Box>
                    </Box>
                    <HStack space="md" className="items-end min-w-[30%] ">
                      <Text size="lg" className="font-medium flex-wrap">
                        Purchased
                      </Text>
                      <CustomSwitch
                        value={itemPurchase}
                        onToggle={handleMarkItemAsPurchased}
                      />
                    </HStack>
                  </HStack>
                </Card>
                <Card>
                  <VStack className="pb-2">
                    <PriceComponent
                      priceInput={priceInput}
                      handleChange={handlePriceInputChange}
                      handleBlur={handlePriceInputBlur}
                      handleFocus={handlePriceInputFocus}
                      guest={guest}
                    />
                  </VStack>
                </Card>
                <Card>
                  <QuantityComponent
                    qtyVal={
                      _selectedItem && _selectedItem.quantity !== "1"
                        ? _selectedItem.quantity
                        : qtyVal
                    }
                    qtyUnit={
                      _selectedItem && _selectedItem.qtyUnit !== "None"
                        ? _selectedItem.qtyUnit
                        : qtyUnit
                    }
                    handleUpdateQuantity={handleUpdateQuantity}
                    SetQtyUnit={SetQtyUnit}
                    shoppingList={shoppingList}
                    qtyOptions={qtyOptions}
                  />
                  <Box className="mt-4">
                    <PriorityComponent
                      priorityVal={
                        _selectedItem && _selectedItem.priority !== "None"
                          ? _selectedItem.priority
                          : priorityVal
                      }
                      priorityOption={priorityOption}
                      setPriorityVal={setPriorityVal}
                    />
                  </Box>
                </Card>
                {/**This card is used for reminders and the implementation is relatively complete. It is 
                 * disabled and will be used in V2 */}
                {/* <Card>
                  <VStack className="w-full">
                    <ItemReminderComponent
                      reminderDate={reminderDate}
                      setReminderDate={setReminderDate}
                      reminderTime={reminderTime}
                      setReminderTime={setReminderTime}
                      isReminderTimeEnabled={isReminderTimeEnabled}
                      setIsReminderTimeEnabled={setIsReminderTimeEnabled}
                      isReminderDateEnabled={isReminderDateEnabled}
                      setIsReminderDateEnabled={setIsReminderDateEnabled}
                      earlyReminder={earlyReminder}
                      setEarlyReminder={setEarlyReminder}
                      repeatReminder={repeatReminder}
                      setRepeatReminder={setRepeatReminder}
                    />
                  </VStack>
                </Card> */}
                <Card>
                  <VStack space="md">
                    <NoteInputSheet
                      note={
                        _selectedItem && _selectedItem.note !== ""
                          ? _selectedItem.note
                          : note
                      }
                      placeholder = {selectedItem && selectedItem.note ? "View note" : "Add a note"}
                      onNoteChange={HandleSetNote}
                    />
                    {/* <AllPurposeCustomMenu
                      value={"Add Receipt"}
                      menuItems={imageAttachmentOptions}
                      onSelect={handleSelect}
                    /> */}
                    <Divider/>
                    <AddAttachmentComponent 
                    handleAttachment={handleAttachment}
                    imageAttachments={imageAttachments} 
                    setAttachments={setAttachments}
                    />
                    
                  </VStack>
                </Card>
              </VStack>
               {/**This component is used for showing similar purchased items and the implementation is relatively complete. It is 
                 * disabled and will be used in V2 */}
             {/* <ItemHistoryComponent 
                state={state.shoppingItemLists} 
                selectedItem={_selectedItem? _selectedItem:null}
                // setZoomedImageIndex={setZoomedImageIndex}
                // setShowDeleteWarningActionSheet={setShowDeleteWarningActionSheet}
                // setShowModal={setShowModal}
                handleAttachment={handleAttachment}
                setSelectedItem={set_SelectedItem}
                updateShoppingItemAndUpdateState={updateShoppingItemAndUpdateState}
                imageAttachments={imageAttachments}
                setAttachments={setAttachments}
             /> */}
            </ScrollView>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
      <CancelActionSheet
        isOpen={isOpenDiscardSheet}
        handleClose={handleDiscard}
        handleCancel={handleDiscardConfirmationSheet}
        text1="Discard Changes"
        text2="Cancel"
        topInfo=""
      />
      <AddCategorySheet
        isOpen={showAddCategoryActionsheet}
        onClose={() => setShowAddCategoryActionsheet(false)}
        selectedItem={_selectedItem}
      />
    </>
  );
};

export default ItemInformationSheet;

//TODOs - When a picture is takem, ask the user whetter they want to keep or discard
// Make image smaller and give option to delete on the right
// Make provision to also preview the scanned text.
