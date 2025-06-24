import { FlatList, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";

const countries = [
    { name: "United Kingdom", currencyCode: "GBP", symbol: "£" },
    { name: "Canada", currencyCode: "CAD", symbol: "C$" },
    { name: "Nigeria", currencyCode: "NGN", symbol: "₦" },
    { name: "Germany", currencyCode: "EUR", symbol: "€" },
    { name: "Japan", currencyCode: "JPY", symbol: "¥" },
  ];
type CountryItem = {
    name: string;
    currencyCode: string;
    symbol: string;
  };
export default function SelectCountryScreen() {
  const router = useRouter();

//   const handleSelect = (country: string) => {
//     // Pass selected country back to the previous screen using router.replace or router.back with params
//     router.push({ pathname: "/", params: { selectedCountry: country } }); // You may adapt this to your layout
//   };

  const handleSelect = (country: CountryItem) => {
    router.push({
      pathname: "/",
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
