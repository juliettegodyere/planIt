
import DisplayQuantity from "./DisplayQuantity";
import DisplayPrice from "./PriceComponent";
import DisplayPriority from "./DisplayPriority";
import { VStack } from "./ui/vstack";
import { Box } from "./ui/box";
import { ShoppingItemTypes } from "@/service/types";

interface ShoppingItemDetailsProps {
  item: any;
  selectedItem: any;
  shoppingItems:ShoppingItemTypes[]
}

const ShoppingItemDetails = ({
  item,
  selectedItem,
  shoppingItems
}: ShoppingItemDetailsProps) => {
  console.log("ShoppingItemDetails")
  console.log(shoppingItems)
  return (
    <VStack 
    >
      <Box className="">
        <DisplayQuantity
          item={item}
          selectedItem={selectedItem}
          shoppingItems={shoppingItems}
        />
      </Box>
      <Box>
        <DisplayPrice 
          item={item} 
          selectedItem={selectedItem} 
          shoppingItems={shoppingItems}
          />
      </Box>
      <Box>
        <DisplayPriority 
          item={item} 
          selectedItem={selectedItem} 
          shoppingItems={shoppingItems}
          />
      </Box>
    </VStack>
  );
};

export default ShoppingItemDetails;

// To edit an item, set selected to true, purchase remains true, set qty, unit, price, & priority. So if for a particular item
// the selected and purchase is true, meaning it's an edit.
