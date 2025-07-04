import { ChevronDownIcon, ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Box } from "./ui/box";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { Heading } from "./ui/heading";
import { Pressable } from "./ui/pressable";
import { Button, ButtonText } from "./ui/button";
import { useLocalSearchParams, useRouter } from "expo-router";

interface SelectOption {
    name: string;
    currencyCode: string;
    symbol: string;
}

interface SelectItemProps {
  name: string;
  currencyCode: string;
    symbol: string;
    handleGuestUserUpdate:()=> void,
    page:string
}

const CustomSelectItem: React.FC<SelectItemProps> = ({
  name,
  currencyCode,
  symbol ,
  handleGuestUserUpdate,
  page
}) => {
  const router = useRouter();

  return (
    <VStack className="mt-6 space-y-6">
              {/* Country */}
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/select-country",
                    params: { page: page }, 
                  });
                }}
                className="mb-5"
              >
                <HStack className="justify-between items-center">
                  <Heading size="md">Country</Heading>
                  <HStack space="lg" className="items-center">
                  <Text>{name ? name : "Never"}</Text>
                    <Icon
                      as={ChevronRightIcon}
                      size="xl"
                      className="text-typography-500"
                    />
                  </HStack>
                </HStack>
              </Pressable>
  
              {/* Currency */}
              <Pressable className="mb-5">
                <HStack className="justify-between items-center">
                  <Heading size="md">Currency</Heading>
                  <HStack space="lg" className="items-center">
                    <Text>{name ? currencyCode : "Never"}</Text>
                    <Icon
                      as={ChevronRightIcon}
                      size="xl"
                      className="text-typography-500"
                    />
                  </HStack>
                </HStack>
              </Pressable>
  
              {/* Continue Button */}
              <Button 
                size="md" 
                variant="outline" 
                action={name ? 'positive' : 'negative'} 
                onPress={handleGuestUserUpdate}
               // disabled={selectedCountry ? true : false}
                >
                <ButtonText>Continue</ButtonText>
              </Button>
            </VStack>
  );
};
export default CustomSelectItem;
