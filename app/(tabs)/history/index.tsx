import { Box } from "@/components/ui/box";
import { useShoppingListContext } from "@/service/store";
import { useRouter } from "expo-router";
import { Text, View, FlatList } from "react-native";
import HistoryItem from "@/components/HistoryItems";
import {cleanUpItem} from "../../../Util/HelperFunction"
import { SelectedItemType } from "@/service/state";

export default function History() {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItemLists } = state;
  const router = useRouter();

  
  const groupByDate = (items: SelectedItemType[]) => {
    return items
      .map(cleanUpItem) // 👈 clean up first
      .filter(item => {
        const lastPurchased = item.purchased[item.purchased.length - 1];
        return lastPurchased === true;
      })
      .reduce((acc, item) => {
        const lastCreateDate = new Date(
          item.modifiedDate[item.modifiedDate.length - 1]
        )
          .toISOString()
          .split("T")[0];
  
        if (!acc[lastCreateDate]) acc[lastCreateDate] = [];
        acc[lastCreateDate].push(item);
  
        return acc;
      }, {} as Record<string, SelectedItemType[]>);
  };
  

  const groupedItems = groupByDate(shoppingItemLists); 
  return (
    <Box>
      {/* <FlatList 
        data={Object.entries(groupedItems)}
        keyExtractor={(item) => item[0]}
        renderItem={({item}) => (
          <HistoryItem items ={item}/>
        )}
        /> */}
    </Box>
  );
}