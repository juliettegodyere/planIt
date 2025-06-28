import { FlatList, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { countries } from "@/data/dataStore";

type CountryItem = {
    name: string;
    currencyCode: string;
    symbol: string;
  };
  type KnownRoutes = "/" | "/setting";

export default function SelectCountryScreen() {
  const router = useRouter();
  const rawPage = useLocalSearchParams().page;
  const page = Array.isArray(rawPage) ? rawPage[0] : rawPage;

const handleSelect = (country: CountryItem) => {
  if (!page || !["/", "/setting"].includes(page)) return;

  router.push({
    pathname: page as KnownRoutes,
    params: {
      selectedCountry: country.name,
      currencyCode: country.currencyCode,
      currencySymbol: country.symbol,
    },
  });
};
  return (
    <VStack className="p-4">
    <FlatList
      data={countries}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => {
        return (
          <Pressable onPress={() => handleSelect(item)}>
            <HStack className="justify-between items-center py-3 border-b border-gray-200">
              <Text className="text-xl">{item.name}</Text>
            </HStack>
          </Pressable>
        );
      }}
    />
  </VStack>
  );
}
