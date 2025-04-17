import { StyleSheet } from "react-native";
import { VStack } from "@/components/ui/vstack";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { useShoppingListContext } from "../service/stateManager";
import { theme } from "../assets/colors";
import {
  addItem,
  updateSelected,
  addNewEntry,
  updatePurchase,
} from "../service/stateActions";
import DisplayQuantity from "../components/DisplayQuantity";
import DisplayPrice from "../components/DisplayPrice";
import DisplayPriority from "../components/DisplayPriority";
import { HStack } from "./ui/hstack";
import { Button, ButtonText } from "./ui/button";
import PurchaseButton from "./PurchaseButton";

interface ShoppingListItem {
  label: string;
  value: string;
  category: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number[];
  qtyUnit: string[];
  price: string[];
  purchased: boolean[];
  selected: boolean[]; // ✅ Ensure selected is an array
  createDate: string[];
  modifiedDate: string[];
  priority: string[];
  category: string;
}

type Props = {
  shoppingList: ShoppingListItem;
};

export default function ShoppingListItem({ shoppingList }: Props) {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItems } = state;

  const isChecked = (id: string) => {
    const item = shoppingItems.find((item: ShoppingItem) => item.id === id);
    return item ? item.selected[item.selected.length - 1] : false;
  };

  const handleCheckboxChange = (item: ShoppingListItem) => {
    const now = new Date().toISOString();
    const existingItem = shoppingItems.find(
      (existingItem: ShoppingItem) => existingItem.id === item.value
    );
    if (existingItem) {
      const lastPurchaseStatus =
        existingItem.purchased?.[existingItem.purchased.length - 1] ?? false;
      const lastSelectedStatus =
        existingItem.selected?.[existingItem.selected.length - 1] ?? false;

      if (lastPurchaseStatus) {
        //set selecteted to false
        dispatch(updateSelected(item.value));
      } else {
        if (lastPurchaseStatus == true) {
          //Selected is false and purchased is true
          dispatch(
            addNewEntry({
              id: item.value,
              modifiedDate: now,
              createDate: now,
              price: String(0), // Single value (not an array)
              purchased: false, // Single value
              selected: false, // Single value
              qtyUnit: "None", // Single value
              quantity: 1, // Single value
              priority: "Low",
            })
          );
        } else {
          dispatch(updateSelected(item.value));
        }
      }
    } else {
      dispatch(
        addItem({
          id: item.value,
          name: item.label,
          quantity: [1],
          qtyUnit: ["None"],
          purchased: [false],
          selected: [true],
          price: [String(0)],
          createDate: [now],
          modifiedDate: [now],
          category: item.category,
          priority: ["Low"],
        })
      );
    }
  };
  
  const selectedItem = shoppingItems.find(
    (i: ShoppingItem) =>
      i.id === shoppingList.value && i.selected[i.selected.length - 1] === true
  );
  const isBought =
    selectedItem?.purchased?.[selectedItem.purchased.length - 1] || false;
  const isSelected =
    selectedItem?.selected?.[selectedItem.selected.length - 1] || false;
  return (
    <Card size="md" variant="elevated" className="m-2">
      <HStack space="4xl"
      style={{
        alignItems: "center",
        justifyContent: "space-between", // ensures spacing between items
        width: "100%", // full width
      }}>
        <Checkbox
          value={shoppingList.value}
          size="lg"
          isChecked={isChecked(shoppingList.value)}
          onChange={() => handleCheckboxChange(shoppingList)}
        >
          <CheckboxIndicator
            style={{
              backgroundColor: isSelected && theme.colors.iconSecondary,
              borderColor: isSelected && theme.colors.fontSecondary,
            }}
          >
            <CheckboxIcon
              as={AntDesignIcon}
              name="check"
              color={theme.colors.fontSecondary}
              size="md"
            />
          </CheckboxIndicator>
          <CheckboxLabel
            style={{
              textDecorationLine: isBought ? "line-through" : "none", // Strike-through when bought
              fontFamily: theme.fonts.bold,
              fontSize: theme.sizes.medium,
              color: theme.colors.fontPrimary,
            }}
          >
            {shoppingList.label}
          </CheckboxLabel>
        </Checkbox>
        {selectedItem && (
            <PurchaseButton
            item={shoppingList}
            isBought={isBought}
            selectedItem={selectedItem}
            
            />
        )}
      </HStack>
      {selectedItem && (
        <VStack>
          <Box className="mt-3">
            <DisplayQuantity
              item={shoppingList}
              isSelected={isSelected}
              selectedItem={selectedItem}
            />
          </Box>
          <Box>
            <DisplayPrice item={shoppingList} selectedItem={selectedItem} />
          </Box>
          <Box>
            <DisplayPriority item={shoppingList} selectedItem={selectedItem} />
          </Box>
        </VStack>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({});
