import { StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useShoppingListContext } from "@/service/store";
import { CategoriesType, ShoppingItemTypes } from "@/service/types";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import ItemThumbnail from "@/components/ItemThumbnail";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { useEffect, useState } from "react";
import { useShoppingActions } from "@/db/Transactions";
import { Pressable } from "@/components/ui/pressable";
import {
  ChevronRightIcon,
  EditIcon,
  Icon,
  MailIcon,
} from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";
import { formatDate } from "@/Util/HelperFunction";
import { EyeIcon } from "lucide-react-native";
import NoteInputSheet from "@/components/NoteComponentV2";
import ItemHistoryComponent from "@/components/ItemHistoryComponent";
import { ActionType, AttachmentParam } from "@/components/type";
import AddAttachmentComponent from "@/components/AddAttachmentActionsheet";
import { Box } from "@/components/ui/box";

const ItemDetails = () => {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItemLists, guest } = state;
  const { id } = useLocalSearchParams();
  const { getCategoryById,updateShoppingItemAndUpdateState } = useShoppingActions();
  const [selectedItem, setSelectedItem] = useState<ShoppingItemTypes | null>(
    null
  );
  const [category, setCategory] = useState<CategoriesType | null>(null);
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState<AttachmentParam[]>([]);
  const [actionType, setActionType] = useState<ActionType | null>("none");
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [filteredByItems, setFilteredByItems] = useState<ShoppingItemTypes[]>(
    []
  );
  
  useEffect(() => {
    const item = shoppingItemLists.find(
      (entry: ShoppingItemTypes) => entry.id === id
    );
    if (item) {
      setSelectedItem(item);
      if(item.note){
        setNote(item.note)
        setAttachments(JSON.parse(item.attachments))
      }
    }
  }, [id]);

  const imageAttachments = attachments.filter((att) => att.type === "image");

  const imageUrls = imageAttachments.map((att) => ({ url: att.data }));

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
      const itemByName: ShoppingItemTypes[] = shoppingItemLists.filter(
        (entry: ShoppingItemTypes) => entry.name === selectedItem.name
      );
      if (itemByName.length > 0) {
        setFilteredByItems(itemByName);
      }
    }
  }, [id, selectedItem]);

  const getTotalAmount = (): number => {
    return filteredByItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const handleClose = () => {
    setShowActionsheet(false);

    setActionType("none");
  };

  const handleAttachment = (newAttachment: AttachmentParam) => {
    setAttachments((prev) => [...prev, newAttachment]);
    handleClose();
  };

  const handleUpdateItems = async () => {

    if (!selectedItem?.id) {
      console.error("Cannot update item: ID is missing");
      return;
    }
    const trimmedNote = note.trim();
    const item_update: ShoppingItemTypes = {
      ...selectedItem,
      note: trimmedNote,
    };

    if (selectedItem.note !== note) {
      await updateShoppingItemAndUpdateState(item_update);
      const updated = state.shoppingItemLists.find((i) => i.id === selectedItem.id);
      if (updated) {
        setSelectedItem(updated);
      }    
   }
  };

  return (
    <ScrollView 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ backgroundColor:'white'}}
    keyboardShouldPersistTaps="handled"
    bounces={true}
    overScrollMode="never" // Android only
    >
      <VStack >
      {selectedItem ? (
        <>
          <Card>
            <HStack className="justify-between mt-10 mb-4 w-full">
              <VStack space="md" className="max-w-[70%]">
                <ItemThumbnail
                  name={selectedItem.name}
                  size={48}
                  bgColor="#e67e22"
                  textColor="#fff"
                />
                <Heading className="text-xl text-gray-900">{selectedItem.name}</Heading>
                <Text className="text-md text-gray-900">{category ? category.label : ""}</Text>
              </VStack>
              <VStack space="md">
                <Pressable>
                 {/* <VStack space="md">
                  <Icon as={EyeIcon} size="lg" className=""/>
                  <Text>View Similar Items</Text>
                 </VStack> */}
                </Pressable>
              </VStack>
            </HStack>
          </Card>
          <Divider />
          {/* <Card>
            <Pressable>
              <HStack className="justify-between">
                <VStack>
                  <Text>Buy Again</Text>
                </VStack>
                <Icon as={ChevronRightIcon} className="text-typography-500" />
              </HStack>
            </Pressable>
          </Card>
          <Divider /> */}

          <Card >
            {/* <Pressable className="pb-4">
              <HStack className="justify-between">
                <HStack space="md">
                  <Icon as={MailIcon} className="text-typography-500" />
                  <Text>Add Receipt</Text>
                </HStack>
                <Icon as={ChevronRightIcon} className="text-typography-500" />
              </HStack>
            </Pressable> */}
            <Box className="pb-5">
            <NoteInputSheet
              note={note}
              placeholder = {selectedItem && selectedItem.note ? "View note" : "Add a note"}
              onNoteChange={(text) => setNote(text)}
              onDone={handleUpdateItems}
            />
            </Box>
            <Divider />
            {/* <Pressable className="pt-4">
              <HStack className="justify-between">
                <HStack space="md">
                  <Icon as={EditIcon} className="text-typography-500" />
                  <Text>Add Notes and Tags</Text>
                </HStack>
                <Icon as={ChevronRightIcon} className="text-typography-500" />
              </HStack>
            </Pressable> */}
             <Box className="mt-4">
             <AddAttachmentComponent 
                handleAttachment={handleAttachment}
                imageAttachments={imageAttachments} 
                setAttachments={setAttachments}
                />
             </Box>
          </Card>
          <Divider />
          <Card className="py-4">
            <Heading size="xl" className="pb-5">Details</Heading>
            <VStack space="2xl">
            <HStack className="justify-between">
              <Text className="text-md text-gray-900 font-bold">Purchased on</Text>
              <Text className="text-md text-gray-900 font-normal">{formatDate(new Date(selectedItem.modifiedDate))}</Text>
            </HStack>
            <HStack className="justify-between">
              <Text className="text-md text-gray-900 font-bold">Amount</Text>
              <Text className="text-md text-gray-900 font-normal"> {selectedItem.price}</Text>
            </HStack>
            <HStack className="justify-between">
              <Text className="text-md text-gray-900 font-bold">Quantity Purchased</Text>
              <Text className="text-md text-gray-900 font-normal">{selectedItem.quantity + " " + selectedItem.qtyUnit}</Text>
            </HStack>
            <HStack className="justify-between">
              <Text className="text-md text-gray-900 font-bold">Priority</Text>
              <Text className="text-md text-gray-900 font-normal">{selectedItem.priority}</Text>
            </HStack>
            </VStack>
          </Card>
          <Divider />
          {/* <Card className="pb-4">
            <Heading className="pb-3">History</Heading>
            <HStack className="justify-between pb-3">
              <Text>Total Time Product was Purchased</Text>
              <Text>{filteredByItems.length}</Text>
            </HStack>
            <HStack className="justify-between pb-3">
              <Text>Total Item Amount </Text>
              <Text>£{getTotalAmount().toFixed(2)}</Text>
            </HStack>
          </Card> */}
          {/* <Card className="pb-40">
          <ItemHistoryComponent
            state={state.shoppingItemLists}
            selectedItem={selectedItem}
          />
          </Card> */}
        </>
      ) : (
        <Text>Item not found</Text>
      )}
    </VStack>
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
