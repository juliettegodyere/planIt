import { StyleSheet, ScrollView, View, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useShoppingListContext } from "@/service/store";
import {
  CategoriesType,
  CategoryItemResponseType,
  ShoppingItemTypes,
} from "@/service/types";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import ItemThumbnail from "@/components/ItemThumbnail";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { useEffect, useState } from "react";
import { useShoppingActions } from "@/db/Transactions";
import { Pressable } from "@/components/ui/pressable";
import { Divider } from "@/components/ui/divider";
import {
  formatDate,
  togglePurchased,
} from "@/Util/HelperFunction";
import { ActionType, AttachmentParam } from "@/components/type";
import AddAttachmentComponent from "@/components/AddAttachmentActionsheet";
import { Box } from "@/components/ui/box";
import { ShoppingListStateTypes } from "@/service/state";
import { updateItem } from "@/service/stateActions";
import ShoppingButton from "@/components/ShoppingButton";
import { useSQLiteContext } from "expo-sqlite";
import { Image } from "@/components/ui/image";
import {
  updateReminderFields,
  getReminderByItemId,
} from "@/db/EntityManager";
import { useShoppingItemActions } from "@/hooks/useShoppingItemActions";
import { EditIcon, Icon } from "@/components/ui/icon";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { DEFAULTS } from "@/Util/constants/defaults";
import PriceComponent from "@/components/PriceComponent";
import QuantitySelector from "@/components/QuantitySelector";
import CustomMenu from "@/components/CustomMenu";
import { priorityOption, qtyOptions } from "@/data/dataStore";
import PriorityComponent from "@/components/PriorityComponent";
import { Input, InputField } from "@/components/ui/input";
import AddCategorySheet from "@/components/AddCategorySheet";

const ItemDetails = () => {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItemLists, guest, catalogItems } = state;
  const { id } = useLocalSearchParams();
  const { getCategoryById } = useShoppingActions();
  const db = useSQLiteContext();

  const [selectedItem, setSelectedItem] =
    useState<ShoppingListStateTypes | null>(null);
  const [category, setCategory] = useState<CategoriesType | null>(null);
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState<AttachmentParam[]>([]);
  const [actionType, setActionType] = useState<ActionType | null>("none");
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [filteredByItems, setFilteredByItems] = useState<
    ShoppingListStateTypes[]
  >([]);
  const [selectedItemToEdit, setSelectedItemToEdit] =
    useState<ShoppingListStateTypes | null>(null);
  const { updateShoppingItemAndReturn } = useShoppingActions();
  const { createOrToggleShoppingItem, isCreating } = useShoppingItemActions(db);

  const [priceInput, setPriceInput] = useState(DEFAULTS.PRICE);
  const [qtyVal, SetQtyVal] = useState(DEFAULTS.QUANTITY);
  const [qtyUnit, SetQtyUnit] = useState(DEFAULTS.QTY_UNIT);
  const [priorityVal, setPriorityVal] = useState(DEFAULTS.PRIORITY);
  const [showAddCategoryActionsheet, setShowAddCategoryActionsheet] =
  useState(false);

  useEffect(() => {
    const item = shoppingItemLists.find(
      (entry: ShoppingListStateTypes) => entry.id === id
    );
    if (item) {
      setSelectedItem(item);
    }
  }, [id]);

  const imageAttachments = attachments.filter((att) => att.type === "image");

  useEffect(() => {
    const fetchCategory = async () => {
      if (selectedItem) {
        const category = await getCategoryById(selectedItem.category_item_id);
        if (category) {
          setCategory(category);
        } else {
          console.warn("Category not found");
        }
      }
    };
    fetchCategory();
  }, [id, selectedItem]);

  useEffect(() => {
    if (selectedItem) {
      const itemByName: ShoppingListStateTypes[] = shoppingItemLists
        .filter(
          (entry: ShoppingListStateTypes) => entry.name === selectedItem.name
        )
        .sort(
          (a, b) =>
            new Date(b.modifiedDate).getTime() -
            new Date(a.modifiedDate).getTime()
        );
      // 🟢 sort DESC (most recent first)

      if (itemByName.length > 0) {
        setFilteredByItems(itemByName);
      }
    }
  }, [id, selectedItem, shoppingItemLists]);

  const handleClose = () => {
    setShowActionsheet(false);

    setActionType("none");
  };

  const handleAttachment = (newAttachment: AttachmentParam) => {
    setAttachments((prev) => [...prev, newAttachment]);
    //handleClose();
  };

  const handleUpdateItems = async () => {
    if (!selectedItemToEdit?.id) {
      console.error("Cannot update item: ID is missing");
      return;
    }
    //If an input is undefined, null, or same as before, keep the old value
    const itemToDispatch: ShoppingListStateTypes = {
      ...selectedItemToEdit,
      price: priceInput !== undefined && priceInput !== selectedItemToEdit.price 
        ? priceInput 
        : selectedItemToEdit.price,
      quantity: qtyVal ?? selectedItemToEdit.quantity,
      qtyUnit: qtyUnit ?? selectedItemToEdit.qtyUnit,
      note: note ?? selectedItemToEdit.note,
      priority: priorityVal ?? selectedItemToEdit.priority,
      attachments: attachments 
        ? JSON.stringify(attachments) 
        : selectedItemToEdit.attachments,
    };    

      const itemUpdated = await updateShoppingItemAndReturn(itemToDispatch)

      if (itemUpdated) {
        setSelectedItemToEdit(itemUpdated);
        dispatch(updateItem(itemUpdated.id, itemUpdated));
      }
      setShowActionsheet(false);
  };

  const handleEdit = (id: string) => {
    setShowActionsheet(true);

    const itemToEdit = filteredByItems.find(
      (entry: ShoppingItemTypes) => entry.id === id
    );

    if (itemToEdit) {
      setSelectedItemToEdit(itemToEdit);
      SetQtyVal(itemToEdit.quantity)
      SetQtyUnit(itemToEdit.qtyUnit)
      setPriceInput(itemToEdit.price)
      setPriorityVal(itemToEdit.priority)
      setNote(itemToEdit.note)
      setAttachments(JSON.parse(itemToEdit.attachments))
    }
  };

  const handlePriceInputFocus = () => {
    if (priceInput === DEFAULTS.PRICE) {
      setPriceInput(DEFAULTS.EMPTY);
    }
  };

  const handlePriceInputBlur = () => {
    if (priceInput.trim() === DEFAULTS.EMPTY) {
      setPriceInput(DEFAULTS.PRICE);
    }
  };

  const handleUpdateQuantity = async (change: number) => {
    const lastQty = qtyVal ?? selectedItemToEdit?.quantity ?? 1;
    const newQty = Math.max(1, Number(lastQty) + change);

    SetQtyVal(String(newQty));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: "white" }}
      keyboardShouldPersistTaps="handled"
      bounces={true}
      overScrollMode="never" // Android only
    >
      <VStack>
        {selectedItem ? (
          <>
            <Card className="mb-5">
              <HStack className="justify-between mt-10 mb-4 w-full">
                <VStack space="md" className="max-w-[70%]">
                  <ItemThumbnail
                    name={selectedItem.name}
                    size={48}
                    bgColor="#e67e22"
                    textColor="#fff"
                  />
                  <Heading className="text-xl text-gray-900">
                    {selectedItem.name}
                  </Heading>
                  <Text className="text-md" style={{ color: "#888888" }}>
                    {category ? category.label : ""}
                  </Text>
                </VStack>
              </HStack>
              <VStack space="md">
                <HStack>
                  <Text
                    className="font-bold"
                    size="md"
                    style={{ color: "#888888" }}
                  >
                    • Last purchased on{" "}
                  </Text>
                  <Text
                    className="font-bold"
                    size="md"
                    style={{ color: "#FF6347" }}
                  >
                    {formatDate(selectedItem.modifiedDate)}
                  </Text>
                </HStack>
                <Text
                  className="font-bold"
                  size="md"
                  style={{ color: "#888888" }}
                >
                  • Purchased {filteredByItems.length} times
                </Text>
              </VStack>
              {!shoppingItemLists.find(
                (entry) =>
                  entry.name === selectedItem.name &&
                  entry.selected === true &&
                  entry.purchased === false
              ) && (
                <HStack space="lg" className="mt-5">
                  <ShoppingButton
                    label="Undo purchase"
                    variant="outline"
                    size="sm"
                    color="#888888"
                    onPress={() =>
                      togglePurchased(
                        selectedItem,
                        dispatch,
                        updateShoppingItemAndReturn,
                        db,
                        getReminderByItemId,
                        updateReminderFields,
                        false
                      )
                    }
                  />
                  <ShoppingButton
                    label="Buy it again"
                    variant="solid"
                    size="sm"
                    color="#FF6347"
                    onPress={() => {
                      const item = catalogItems.find(
                        (entry: CategoryItemResponseType) =>
                          entry.label === selectedItem.name
                      );

                      if (item) {
                        createOrToggleShoppingItem(item);
                      } else {
                        console.warn(
                          "Item not found in catalog:",
                          selectedItem.name
                        );
                      }
                    }}
                  />
                </HStack>
              )}
            </Card>
            <Divider />
            <Card className="mt-5">
              {filteredByItems.map((item, idx) => {
                return (
                  <View key={idx}>
                    <HStack className="justify-between">
                      <Heading>{formatDate(item.modifiedDate)}</Heading>
                      <TouchableOpacity
                        className="rounded-full"
                        style={{
                          borderColor: "#888888",
                          borderWidth: 1,
                          padding: 3,
                        }}
                        onPress={() => handleEdit(item.id)}
                      >
                        <Icon
                          as={EditIcon}
                          className="text-typography-950 m-2 w-4 h-4"
                        />
                      </TouchableOpacity>
                    </HStack>
                    <Card
                      style={{
                        borderWidth: 1,
                        marginVertical: 15,
                        borderColor: "#888888",
                      }}
                    >
                      <VStack space="xl">
                        <HStack className="justify-between">
                          <Text>Amount</Text>
                          <Text
                            className="text-md font-normal"
                            style={{ color: "#888888" }}
                          >
                            {guest?.currencySymbol ?? "£"}
                            {selectedItem.price}
                          </Text>
                        </HStack>
                        <HStack className="justify-between">
                          <Text>Quantity</Text>
                          <HStack>
                            <Text
                              className="text-md font-normal"
                              style={{ color: "#888888" }}
                            >
                              {item.quantity}
                            </Text>
                            <Text
                              className="text-md font-normal"
                              style={{ color: "#888888" }}
                            >
                              {" "}
                              {item.qtyUnit}
                            </Text>
                          </HStack>
                        </HStack>
                        <HStack className="justify-between">
                          <Text>Priority</Text>
                          <Text
                            className="text-md font-normal"
                            style={{ color: "#888888" }}
                          >
                            {item.priority}
                          </Text>
                        </HStack>
                        {item.note && (
                          <VStack space="lg">
                            <Text
                              className="text-md font-normal"
                              style={{ color: "#888888" }}
                            >
                              Notes
                            </Text>
                            <Text
                              className="text-md font-normal"
                              style={{ color: "#888888" }}
                            >
                              {item.note}
                            </Text>
                          </VStack>
                        )}
                        {item.attachments &&
                          JSON.parse(item.attachments).length > 0 && (
                            <VStack space="lg">
                              <Text
                                className="text-md font-normal"
                                style={{ color: "#888888" }}
                              >
                                Attachments
                              </Text>
                              {JSON.parse(item.attachments).map(
                                (img: AttachmentParam, inx: number) => (
                                  <HStack key={inx} space="lg">
                                    <Image
                                      source={{ uri: img.data }}
                                      alt={`Attachment ${inx}`}
                                      size="xs"
                                      className="rounded-sm"
                                    />
                                  </HStack>
                                )
                              )}
                            </VStack>
                          )}
                      </VStack>
                    </Card>
                  </View>
                );
              })}
            </Card>
          </>
        ) : (
          <Text>Item not found</Text>
        )}
      </VStack>

      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
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
              <Pressable onPress={handleClose}>
                <Text
                  style={{ color: "#FF6347" }}
                  size="xl"
                  className="font-medium"
                >
                  Cancel
                </Text>
              </Pressable>
              <Heading size="md" className="font-bold">
                Edit Item
              </Heading>
              <Pressable onPress={() => handleUpdateItems()}>
                <Text
                  style={{ color: "#FF6347" }}
                  size="xl"
                  className="font-semibold"
                >
                  Done
                </Text>
              </Pressable>
            </HStack>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={true}
              overScrollMode="never" // Android only
              //contentContainerStyle={{backgroundColor:"#FFFFFF", borderRadius:10}}
            >
              {selectedItemToEdit && (
                <VStack space="sm" className="mb-4">
                  <Card className="justify-between mt-10">
                    <VStack space="md">
                      <ItemThumbnail
                        name={selectedItemToEdit.name}
                        size={48}
                        bgColor="#e67e22"
                        textColor="#fff"
                      />
                      <Heading className="text-xl text-gray-900">
                        {selectedItemToEdit.name}
                      </Heading>
                      {/* <Text className="text-md" style={{ color: "#888888" }}>
                        {category ? category.label : ""}
                      </Text> */}
                     <Box className="mt-2 w-[40%]">
                      {category?.label === "Uncategorized" ? (
                        <TouchableOpacity
                          onPress={() => setShowAddCategoryActionsheet(true)}
                          style={{ backgroundColor: "#FF6347", borderRadius:12, padding:3}}
                        >
                          <Text size="md" className="text-white text-center font-medium">Change category</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text size="lg">{category?.label}</Text>
                      )}
                    </Box>
                    </VStack>
                    <HStack className="mt-3 pb-3">
                      <Text
                        className="font-bold"
                        size="md"
                        style={{ color: "#888888" }}
                      >
                        • Purchased on{" "}
                      </Text>
                      <Text
                        className="font-bold"
                        size="md"
                        style={{ color: "#FF6347" }}
                      >
                        {formatDate(selectedItemToEdit.modifiedDate)}
                      </Text>
                    </HStack>
                  </Card>
                  <Card>
                    <VStack space="xl" className="mb-3">
                      <Text className="font-medium text-lg"  style={{color:"#888888"}}>Update Price: </Text>
                      <PriceComponent
                        priceInput={priceInput}
                        handleChange={setPriceInput}
                        handleBlur={handlePriceInputBlur}
                        handleFocus={handlePriceInputFocus}
                        guest={guest}
                      />
                    </VStack>
                  </Card>
                  <Card>
                  <VStack space="xl" className="w-full mb-3">
                    <Text className="font-medium text-lg"  style={{color:"#888888"}}>Update Note: </Text>
                    <Input
                      variant="underlined"
                      size="lg"
                      //style={{ minHeight: 120 }}
                    >
                      <InputField
                        // multiline
                        // numberOfLines={10}
                        placeholder="Edit note"
                        value={note}
                        onChangeText={setNote}
                        className="text-base"
                      />
                    </Input>
                  </VStack>
                  </Card>
                  <Card>
                    <VStack space="xl" className="mb-3">
                      <Text className="font-medium text-lg"  style={{color:"#888888"}}>Update Quantity: </Text>
                      <HStack space="lg" >
                        <QuantitySelector
                          quantity={qtyVal}
                          onIncrease={() => handleUpdateQuantity(1)}
                          onDecrease={() => handleUpdateQuantity( -1)}
                          onDelete={() => console.log("Quantity can not be removed")}
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
                    </VStack>
                  </Card>
                  <Card>
                 <VStack className="m-3">
                    <PriorityComponent
                      priorityVal={priorityVal}
                      priorityOption={priorityOption}
                      setPriorityVal={setPriorityVal}
                    />
                  </VStack>
                 </Card>
                 <Card>
                 <VStack className="mb-5">
                    <AddAttachmentComponent
                      handleAttachment={handleAttachment}
                      imageAttachments={imageAttachments}
                      setAttachments={setAttachments}
                    />
                  </VStack>
                 </Card>
                </VStack>
              )}
            </ScrollView>
            </KeyboardAvoidingView>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
      <AddCategorySheet
        isOpen={showAddCategoryActionsheet}
        onClose={() => setShowAddCategoryActionsheet(false)}
        selectedItem={selectedItemToEdit}
        dispatch={dispatch}
      />
    </ScrollView>
  );
};
export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start",
    textAlignVertical: "top", // Ensures text starts at the top-left
    //borderColor: '#ccc',
    //borderWidth: 1,
    padding: 10,
  },
});
