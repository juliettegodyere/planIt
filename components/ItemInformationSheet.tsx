import { ItemInformationSheetProps } from "./type";
import { Pressable, ScrollView, TouchableOpacity } from "react-native";
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
import { HStack } from "./ui/hstack";
import { Card } from "./ui/card";
import CancelActionSheet from "./CancelActionsheet";
import PriceComponent from "./PriceComponent";
import PriorityComponent from "./PriorityComponent";
import ItemReminderComponent from "./ItemReminderCompoment";
import { useEffect, useState } from "react";
import AddCategorySheet from "./AddCategorySheet";
import { useShoppingActions } from "@/db/Transactions";
import { Divider } from "./ui/divider";
import { useShoppingListContext } from "@/service/store";
import NoteInputSheet from "./NoteComponentV2";
import AddAttachmentComponent from "./AddAttachmentActionsheet";
import { ShoppingListStateTypes } from "@/service/state";
import ShoppingListCheckboxRow from "./ShoppingListCheckboxRow";
import { CategoryItemResponseType } from "@/service/types";
import ShoppingButton from "./ShoppingButton";
import QuantitySelector from "./QuantitySelector";
import CustomMenu from "./CustomMenu";

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
  //repeatReminder,
  setRepeatReminder,
  guest,
}) => {
  const { state, dispatch } = useShoppingListContext();
  const [showAddCategoryActionsheet, setShowAddCategoryActionsheet] =
    useState(false);
  const { getCategoryById } = useShoppingActions();
  const [categoryLabel, setCategoryLabel] = useState<string | null>(null);
  const [_selectedItem, set_SelectedItem] =
    useState<ShoppingListStateTypes>(selectedItem);
  const [_shoppingList, set_ShoppingList] =
    useState<CategoryItemResponseType>(shoppingList);
  const { deleteShoppingItemAndReturn } = useShoppingActions();

  useEffect(() => {
    set_SelectedItem(selectedItem);

    if (!_selectedItem) return;

    if (_selectedItem?.attachments) {
      try {
        const parsed = JSON.parse(_selectedItem.attachments);
        if (Array.isArray(parsed)) {
          setAttachments(parsed);
        }
      } catch (error) {
        console.error("Failed to parse attachments:", error);
      }
    }
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

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
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
                  <VStack>
                    <ShoppingListCheckboxRow
                      shoppingList={shoppingList}
                      shoppingItem={selectedItem}
                      isChecked={isChecked}
                      shoppingItemLists={state.shoppingItemLists}
                      dispatch={dispatch}
                      deleteShoppingItemAndReturn={deleteShoppingItemAndReturn}
                      // handleCheckboxChange={handleCheckboxChange}
                    />
                    <HStack className="justify-between">
                      <Box className="mt-2">
                        {categoryLabel === "Uncategorized" ? (
                          <TouchableOpacity
                          onPress={() => setShowAddCategoryActionsheet(true)}
                          style={{ backgroundColor: "#FF6347", borderRadius:12, padding:3}}
                        >
                          <Text size="md" className="text-white text-center font-medium">Change category</Text>
                        </TouchableOpacity>
                        ) : (
                          <Text size="lg">{categoryLabel}</Text>
                        )}
                      </Box>
                      {
                        _selectedItem.selected && (
                          <ShoppingButton
                        label={
                          itemPurchase ? "undo Purchase" : "Mark as purchased"
                        }
                        variant={itemPurchase ? "solid" : "outline"}
                        size="md"
                        color="#FF6347"
                        onPress={() => handleMarkItemAsPurchased()}
                      />
                        )
                      }
                    </HStack>
                  </VStack>
                </Card>
                <Card>
                  <HStack space="lg">
                    <QuantitySelector
                      quantity={qtyVal}
                      onIncrease={() => handleUpdateQuantity(shoppingList.value, 1)}
                      onDecrease={() => handleUpdateQuantity(shoppingList.value, -1)}
                      onDelete={() =>
                        console.log("The min is 1 here")
                      }
                    />
                    <CustomMenu
                      value={qtyUnit}
                      menuItems={qtyOptions}
                      onSelect={(key) => {
                        SetQtyUnit(qtyOptions[Number(key)]);
                      }}
                      text="Select Unit"
                    />
                  </HStack>
                  <VStack style={{ marginTop: 25 }}>
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
                  <VStack className="w-full">
                    <ItemReminderComponent
                      reminderDate={reminderDate}
                      setReminderDate={setReminderDate}
                      reminderTime={reminderTime}
                      setReminderTime={setReminderTime}
                      isReminderTimeEnabled={Boolean(isReminderTimeEnabled)}
                      setIsReminderTimeEnabled={setIsReminderTimeEnabled}
                      isReminderDateEnabled={Boolean(isReminderDateEnabled)}
                      setIsReminderDateEnabled={setIsReminderDateEnabled}
                      earlyReminder={earlyReminder}
                      setEarlyReminder={setEarlyReminder}
                      setRepeatReminder={setRepeatReminder}
                    />
                  </VStack>
                </Card>
                <Card>
                  <VStack space="md">
                    <NoteInputSheet
                      note={
                        _selectedItem && _selectedItem.note !== ""
                          ? _selectedItem.note
                          : note
                      }
                      placeholder={
                        selectedItem && selectedItem.note
                          ? "View note"
                          : "Add a note"
                      }
                      onNoteChange={HandleSetNote}
                    />
                    <Divider />
                    <Box className="mb-4">
                      <AddAttachmentComponent
                        handleAttachment={handleAttachment}
                        imageAttachments={imageAttachments}
                        setAttachments={setAttachments}
                      />
                    </Box>
                    <Divider />

                    <Box className="mt-2">
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
        dispatch={dispatch}
      />
    </>
  );
};

export default ItemInformationSheet;
