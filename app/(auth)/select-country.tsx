import { FlatList, Pressable, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { countries } from "@/data/dataStore";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { userTransactions } from "@/db/Transactions";
import { createUserType } from "@/service/types";

type CountryItem = {
  name: string;
  currencyCode: string;
  symbol: string;
};
type KnownRoutes = "/(auth)" | "/setting";

export default function SelectCountryScreen() {
  const router = useRouter();
  const rawPage = useLocalSearchParams().page;
  const page = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const { addNewGuestUserAndUpdateState, updateGuestUserAndUpdateState } =
  userTransactions();

  const handleSelect = async (country: createUserType) => {
    // if (!page || !["/(auth)", "/setting"].includes(page)) return;

    // router.push({
    //   pathname: page as KnownRoutes,
    //   params: {
    //     selectedCountry: country.name,
    //     currencyCode: country.currencyCode,
    //     currencySymbol: country.symbol,
    //   },
    // });
    // console.log("The country");
    // console.log(country);
    const updatedItem = await addNewGuestUserAndUpdateState(country);
    // console.log(updatedItem);
    if(updatedItem){
      router.push("/(tabs)")
    }
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
