
import DisplayQuantity from "./DisplayQuantity";
import DisplayPrice from "./DisplayPrice";
import DisplayPriority from "./DisplayPriority";
import { VStack } from "./ui/vstack";
import { Box } from "./ui/box";

interface ShoppingItemDetailsProps {
  item: any;
  isSelected: boolean;
  selectedItem: any;
}

const ShoppingItemDetails = ({
  item,
  isSelected,
  selectedItem,
}: ShoppingItemDetailsProps) => {
  return (
    <VStack 
   
    >
      <Box className="">
        <DisplayQuantity
          item={item}
          isSelected={isSelected}
          selectedItem={selectedItem}
        />
      </Box>
      <Box>
        <DisplayPrice item={item} selectedItem={selectedItem} />
      </Box>
      <Box>
        <DisplayPriority item={item} selectedItem={selectedItem} />
      </Box>
    </VStack>
  );
};

export default ShoppingItemDetails;
