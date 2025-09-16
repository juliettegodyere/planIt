import { FlatList, TouchableOpacity } from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { useShoppingListContext } from "@/service/store";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { countries } from "@/data/dataStore";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { userTransactions } from "@/db/Transactions";
import { createUserType } from "@/service/types";
import { updateGuestUser, setGuestUserHydrated, addItem, addGuestUser } from "@/service/stateActions";

export default function SelectCountryScreen() {
  const router = useRouter();
  const { dispatch } = useShoppingListContext();
  const { addNewGuestUserToDB, updateGuestUserInDB} = userTransactions();
  const { page, mode, id } = useLocalSearchParams<{ page?: string; mode?: "create" | "update", id?:string }>();

  const handleSelect = async (country: createUserType) => {
    if (mode === "create") {
      const newUser = await addNewGuestUserToDB(country);
      if(newUser){
        dispatch(addGuestUser(newUser));
      }
     
    } else if (mode === "update") {
      if (!id) {
        throw new Error("Guest user id is required for update");
      }
      
      const updatedUser = await updateGuestUserInDB({
        id: id,        
        ...country     
      });
     if(updatedUser){
      dispatch(updateGuestUser(updatedUser));
     }
    }
    dispatch(setGuestUserHydrated(true))
    if (page) router.push(page as Href);
  };

  return (
    <VStack className="p-4">
      <VStack className="pb-5" space="md">
        <Heading size="lg">Select a Country</Heading>
        <Text>
          This should be the country where you live so we could
          capture the currency you transact in.
        </Text>
      </VStack>

      <FlatList
        data={countries}
        keyExtractor={(item) => item.countryName}
        renderItem={({ item }) => (
          <Card>
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <HStack className="justify-between items-center py-3 border-b border-gray-200">
                <Text className="text-xl">{item.countryName}</Text>
              </HStack>
            </TouchableOpacity>
          </Card>
        )}
      />
    </VStack>
  );
}
